
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Property, PropertyFormData } from '@/lib/types/property';
import { validatePropertyForm, sanitizeInput } from '@/lib/utils/validation';

export type { PropertyFormData } from '@/lib/types/property';

export const createProperty = async (propertyData: PropertyFormData): Promise<Property> => {
  try {
    const errors = validatePropertyForm(propertyData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;
    
    const sanitizedData = {
      title: sanitizeInput(propertyData.title),
      address: sanitizeInput(propertyData.address),
      city: sanitizeInput(propertyData.city),
      postal_code: sanitizeInput(propertyData.postal_code),
      property_type: propertyData.property_type,
      rooms: propertyData.rooms,
      area: propertyData.area,
      price: propertyData.price,
      description: propertyData.description ? sanitizeInput(propertyData.description) : null,
      owner_id: userId,
    };
    
    const { data: property, error } = await supabase
      .from('properties')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (propertyData.images && propertyData.images.length > 0) {
      const imageUrls: string[] = [];
      
      for (const image of propertyData.images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${property.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, image, {
              metadata: {
                user_id: userId,
                property_id: property.id
              }
            });
            
          if (uploadError) {
            continue;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
            
          imageUrls.push(publicUrl);
        } catch (uploadError) {
          continue;
        }
      }
      
      if (imageUrls.length > 0) {
        const imageEntries = imageUrls.map((url, index) => ({
          property_id: property.id,
          url: url,
          is_primary: index === 0
        }));
        
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageEntries);
          
        if (imagesError) {
          console.warn('Erreur lors de l\'insertion des images:', imagesError);
        }
      }
    }

    const { data: completeProperty, error: fetchError } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('id', property.id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }

    toast({
      title: "Bien immobilier créé",
      description: `"${property.title}" a été ajouté à votre portefeuille avec succès`,
    });
    
    return completeProperty as Property;
  } catch (error: any) {
    console.error('Erreur lors de la création:', error);
    toast({
      title: "Erreur lors de l'ajout du bien",
      description: error.message || "Une erreur s'est produite lors de la création du bien",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (properties || []) as Property[];
  } catch (error: any) {
    console.error('Erreur lors de la récupération:', error);
    toast({
      title: "Erreur de chargement",
      description: "Impossible de récupérer la liste des biens immobiliers",
      variant: "destructive",
    });
    return [];
  }
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    // Vérifier que l'utilisateur est le propriétaire
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('owner_id, title')
      .eq('id', id)
      .single();

    if (propertyError) {
      throw new Error("Propriété introuvable");
    }

    if (property.owner_id !== sessionData.session.user.id) {
      throw new Error("Vous n'avez pas les droits pour supprimer cette propriété");
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', sessionData.session.user.id); // Double vérification

    if (error) {
      throw error;
    }

    toast({
      title: "Bien supprimé",
      description: `"${property.title}" a été supprimé de votre portefeuille`,
    });

    return true;
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    toast({
      title: "Erreur de suppression",
      description: error.message || "Impossible de supprimer ce bien immobilier",
      variant: "destructive",
    });
    return false;
  }
};
