
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface DocumentFormData {
  name: string;
  type: string;
  file: File;
  application_id?: string;
}

export const uploadDocument = async (documentData: DocumentFormData) => {
  try {
    const { user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Utilisateur non connecté");
    }
    
    // 1. Upload du fichier
    const fileExt = documentData.file.name.split('.').pop();
    const filePath = `${user.id}/${documentData.type}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('tenant_documents')
      .upload(filePath, documentData.file);
      
    if (uploadError) throw uploadError;
    
    // 2. Création de l'entrée de document dans la base de données
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        name: documentData.name,
        type: documentData.type,
        file_path: filePath,
        owner_id: user.id,
        application_id: documentData.application_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Document téléchargé avec succès",
      description: "Votre document a été ajouté à votre dossier.",
    });
    
    return document;
  } catch (error: any) {
    console.error("Erreur lors du téléchargement du document:", error);
    toast({
      title: "Erreur lors du téléchargement",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchDocuments = async (applicationId?: string) => {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (applicationId) {
      query = query.eq('application_id', applicationId);
    }

    const { data: documents, error } = await query;

    if (error) throw error;

    return documents;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des documents:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer vos documents",
      variant: "destructive",
    });
    return [];
  }
};

export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('tenant_documents')
      .download(filePath);

    if (error) throw error;

    // Création d'un objet URL pour le téléchargement du fichier
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error: any) {
    console.error("Erreur lors du téléchargement du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger ce document",
      variant: "destructive",
    });
    return false;
  }
};
