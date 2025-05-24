
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Property, PropertyFormData } from '@/lib/types/property';
import { validatePropertyForm, sanitizeInput, ValidationError } from './propertyValidation';
import { uploadPropertyImage } from './imageUpload';
import { validatePropertyOwnership } from './ownershipValidation';

export type { PropertyFormData } from '@/lib/types/property';

const showValidationErrors = (errors: ValidationError[]) => {
  const errorsByField = errors.reduce((acc, error) => {
    if (!acc[error.field]) acc[error.field] = [];
    acc[error.field].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);

  Object.entries(errorsByField).forEach(([field, messages]) => {
    toast({
      title: `Erreur dans le champ "${field}"`,
      description: messages.join(', '),
      variant: "destructive",
    });
  });
};

export const createProperty = async (propertyData: PropertyFormData): Promise<Property> => {
  try {
    // Validation des données
    const validationErrors = validatePropertyForm(propertyData);
    if (validationErrors.length > 0) {
      showValidationErrors(validationErrors);
      throw new Error("Données invalides");
    }

    // Vérification de l'authentification
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer",
        variant: "destructive"
      });
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;
    
    // Préparation des données nettoyées
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
    
    // Création de la propriété
    const { data: property, error } = await supabase
      .from('properties')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error('Erreur création propriété:', error);
      toast({
        title: "Erreur de création",
        description: "Impossible de créer la propriété. Vérifiez vos données.",
        variant: "destructive"
      });
      throw error;
    }

    // Upload des images si présentes
    let uploadedImagesCount = 0;
    const failedUploads: string[] = [];
    
    if (propertyData.images && propertyData.images.length > 0) {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < propertyData.images.length; i++) {
        const image = propertyData.images[i];
        const uploadResult = await uploadPropertyImage(image, property.id, userId);
        
        if (uploadResult.success && uploadResult.url) {
          imageUrls.push(uploadResult.url);
          uploadedImagesCount++;
        } else {
          failedUploads.push(`Image ${i + 1}`);
          console.warn(`Échec upload image ${i + 1}:`, uploadResult.error);
        }
      }
      
      // Enregistrement des URLs d'images en base
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
          console.warn('Erreur insertion images:', imagesError);
          toast({
            title: "Attention",
            description: "La propriété a été créée mais certaines images n'ont pas pu être enregistrées",
            variant: "destructive"
          });
        }
      }
    }

    // Récupération de la propriété complète
    const { data: completeProperty, error: fetchError } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('id', property.id)
      .single();
    
    if (fetchError) {
      console.error('Erreur récupération propriété:', fetchError);
      // La propriété existe mais on ne peut pas la récupérer complètement
      toast({
        title: "Propriété créée",
        description: "La propriété a été créée mais il y a eu un problème de récupération des données",
      });
      throw fetchError;
    }

    // Message de succès personnalisé
    let successMessage = `"${property.title}" a été ajouté à votre portefeuille`;
    
    if (uploadedImagesCount > 0) {
      successMessage += ` avec ${uploadedImagesCount} image${uploadedImagesCount > 1 ? 's' : ''}`;
    }
    
    if (failedUploads.length > 0) {
      successMessage += `. Attention: ${failedUploads.join(', ')} n'ont pas pu être téléchargées`;
    }

    toast({
      title: "Propriété créée avec succès",
      description: successMessage,
    });
    
    return completeProperty as Property;
    
  } catch (error: any) {
    console.error('Erreur lors de la création:', error);
    
    // Messages d'erreur spécifiques
    if (error.message === "Données invalides") {
      // Les erreurs de validation ont déjà été affichées
      throw error;
    }
    
    if (error.message.includes('non connecté') || error.message.includes('Session expirée')) {
      throw error; // Le toast a déjà été affiché
    }

    // Erreur générique pour les autres cas
    toast({
      title: "Erreur inattendue",
      description: "Une erreur technique s'est produite. Veuillez réessayer dans quelques instants.",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateProperty = async (
  propertyId: string, 
  propertyData: Partial<PropertyFormData>
): Promise<Property> => {
  try {
    // Vérification de l'authentification
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer",
        variant: "destructive"
      });
      throw new Error("Utilisateur non connecté");
    }

    const userId = sessionData.session.user.id;

    // Validation de la propriété du bien
    const { isOwner, property: existingProperty } = await validatePropertyOwnership(propertyId, userId);
    
    if (!isOwner) {
      toast({
        title: "Accès refusé",
        description: "Vous n'êtes pas autorisé à modifier cette propriété",
        variant: "destructive"
      });
      throw new Error("Accès refusé");
    }

    // Validation des données si fournies
    if (Object.keys(propertyData).some(key => key !== 'images')) {
      const fullData = { ...existingProperty, ...propertyData } as PropertyFormData;
      const validationErrors = validatePropertyForm(fullData);
      
      if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        throw new Error("Données invalides");
      }
    }

    // Préparation des données à mettre à jour
    const updateData: any = {};
    
    if (propertyData.title) updateData.title = sanitizeInput(propertyData.title);
    if (propertyData.address) updateData.address = sanitizeInput(propertyData.address);
    if (propertyData.city) updateData.city = sanitizeInput(propertyData.city);
    if (propertyData.postal_code) updateData.postal_code = sanitizeInput(propertyData.postal_code);
    if (propertyData.property_type) updateData.property_type = propertyData.property_type;
    if (propertyData.rooms) updateData.rooms = propertyData.rooms;
    if (propertyData.area) updateData.area = propertyData.area;
    if (propertyData.price) updateData.price = propertyData.price;
    if (propertyData.description !== undefined) {
      updateData.description = propertyData.description ? sanitizeInput(propertyData.description) : null;
    }

    // Mise à jour de la propriété
    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .eq('owner_id', userId) // Double vérification de sécurité
      .select(`
        *,
        property_images (*)
      `)
      .single();

    if (error) {
      console.error('Erreur mise à jour:', error);
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour la propriété",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Propriété mise à jour",
      description: `Les modifications de "${updatedProperty.title}" ont été enregistrées`
    });

    return updatedProperty as Property;

  } catch (error: any) {
    console.error('Erreur update property:', error);
    
    if (error.message === "Données invalides" || 
        error.message === "Accès refusé" || 
        error.message === "Utilisateur non connecté") {
      throw error; // Le toast a déjà été affiché
    }

    toast({
      title: "Erreur inattendue",
      description: "Une erreur technique s'est produite lors de la mise à jour",
      variant: "destructive"
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
        property_images (*),
        profiles!properties_owner_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération propriétés:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer la liste des biens immobiliers",
        variant: "destructive",
      });
      throw error;
    }

    return (properties || []) as Property[];
  } catch (error: any) {
    console.error('Erreur fetch properties:', error);
    return [];
  }
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    // Vérification de l'authentification
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer",
        variant: "destructive"
      });
      return false;
    }

    const userId = sessionData.session.user.id;

    // Validation de la propriété du bien
    const { isOwner, property } = await validatePropertyOwnership(id, userId);
    
    if (!isOwner) {
      toast({
        title: "Accès refusé",
        description: "Vous n'êtes pas autorisé à supprimer cette propriété",
        variant: "destructive"
      });
      return false;
    }

    if (!property) {
      toast({
        title: "Propriété introuvable",
        description: "Cette propriété n'existe pas ou a déjà été supprimée",
        variant: "destructive"
      });
      return false;
    }

    // Suppression (les images seront supprimées en cascade grâce aux FK)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', userId); // Double vérification de sécurité

    if (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer la propriété",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Propriété supprimée",
      description: `"${property.title}" a été définitivement supprimé de votre portefeuille`,
    });

    return true;
  } catch (error: any) {
    console.error('Erreur delete property:', error);
    
    toast({
      title: "Erreur inattendue",
      description: "Une erreur technique s'est produite lors de la suppression",
      variant: "destructive",
    });
    return false;
  }
};
