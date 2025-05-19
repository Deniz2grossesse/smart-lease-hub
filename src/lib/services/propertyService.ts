
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface PropertyFormData {
  title: string;
  address: string;
  city: string;
  postal_code: string;
  property_type: string;
  rooms: number;
  area: number;
  price: number;
  description?: string;
  images?: File[];
}

export const createProperty = async (propertyData: PropertyFormData) => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;
    
    // 1. Création de la propriété dans la base de données
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        title: propertyData.title,
        address: propertyData.address,
        city: propertyData.city,
        postal_code: propertyData.postal_code,
        property_type: propertyData.property_type,
        rooms: propertyData.rooms,
        area: propertyData.area,
        price: propertyData.price,
        description: propertyData.description || null,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Upload des images si présentes
    if (propertyData.images && propertyData.images.length > 0) {
      const imageUrls: string[] = [];
      
      for (const image of propertyData.images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${property.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);
          
        imageUrls.push(publicUrl);
      }
      
      // 3. Mise à jour de la propriété avec les URLs des images
      if (imageUrls.length > 0) {
        await supabase
          .from('properties')
          .update({ images: imageUrls })
          .eq('id', property.id);
          
        // Mettre à jour l'objet property localement
        property.images = imageUrls;
      }
    }

    toast({
      title: "Bien immobilier ajouté avec succès",
      description: "Votre bien a été ajouté à votre portefeuille.",
    });
    
    return property;
  } catch (error: any) {
    console.error("Erreur lors de la création de la propriété:", error);
    toast({
      title: "Erreur lors de l'ajout du bien",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchProperties = async () => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return properties;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des propriétés:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer vos biens immobiliers",
      variant: "destructive",
    });
    return [];
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Bien supprimé",
      description: "Le bien immobilier a été supprimé avec succès",
    });

    return true;
  } catch (error: any) {
    console.error("Erreur lors de la suppression de la propriété:", error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer ce bien immobilier",
      variant: "destructive",
    });
    return false;
  }
};
