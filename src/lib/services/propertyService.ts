
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Property, PropertyFormData } from '@/lib/types/property';
import { validatePropertyForm, sanitizeInput } from '@/lib/utils/validation';

// Export PropertyFormData from types
export type { PropertyFormData } from '@/lib/types/property';

export const createProperty = async (propertyData: PropertyFormData): Promise<Property> => {
  try {
    // Validate form data
    const errors = validatePropertyForm(propertyData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;
    
    // Sanitize input data
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
    
    // 1. Création de la propriété dans la base de données
    const { data: property, error } = await supabase
      .from('properties')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 2. Upload des images si présentes
    if (propertyData.images && propertyData.images.length > 0) {
      const imageUrls: string[] = [];
      
      for (const image of propertyData.images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${property.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, image);
            
          if (uploadError) {
            continue; // Continue avec les autres images même si une échoue
          }
          
          // Récupérer l'URL publique
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
            
          imageUrls.push(publicUrl);
        } catch (uploadError) {
          continue;
        }
      }
      
      // 3. Créer les entrées dans la table property_images
      if (imageUrls.length > 0) {
        const imageEntries = imageUrls.map((url, index) => ({
          property_id: property.id,
          url: url,
          is_primary: index === 0 // La première image est principale
        }));
        
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageEntries);
          
        if (imagesError) {
          // Continue même si l'insertion des images échoue
        }
      }
    }

    // 4. Récupérer la propriété avec les images associées
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
      title: "Bien immobilier ajouté avec succès",
      description: "Votre bien a été ajouté à votre portefeuille.",
    });
    
    return completeProperty as Property;
  } catch (error: any) {
    toast({
      title: "Erreur lors de l'ajout du bien",
      description: error.message,
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
    toast({
      title: "Erreur",
      description: "Impossible de récupérer vos biens immobiliers",
      variant: "destructive",
    });
    return [];
  }
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast({
      title: "Bien supprimé",
      description: "Le bien immobilier a été supprimé avec succès",
    });

    return true;
  } catch (error: any) {
    toast({
      title: "Erreur",
      description: "Impossible de supprimer ce bien immobilier",
      variant: "destructive",
    });
    return false;
  }
};
