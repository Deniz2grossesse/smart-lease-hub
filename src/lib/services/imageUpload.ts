
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadPropertyImage = async (
  file: File,
  propertyId: string,
  userId: string
): Promise<UploadResult> => {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${propertyId}/${fileName}`;

    // Upload vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        metadata: {
          user_id: userId,
          property_id: propertyId
        }
      });

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      return {
        success: false,
        error: 'Erreur lors du téléchargement de l\'image'
      };
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      success: false,
      error: 'Erreur technique lors du téléchargement'
    };
  }
};

export const deletePropertyImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const filePath = pathSegments.slice(-2).join('/'); // propertyId/fileName

    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath]);

    if (error) {
      console.error('Erreur suppression image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
};
