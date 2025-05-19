
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface ApplicationFormData {
  first_name: string;
  last_name: string;
  birthdate?: string;
  nationality?: string;
  current_address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  employment_status?: string;
  company?: string;
  position?: string;
  contract_start?: string;
  contract_end?: string;
  monthly_income?: number;
  other_income?: number;
  current_rent?: number;
  guarantor_type?: string;
  guarantor_firstname?: string;
  guarantor_lastname?: string;
  guarantor_relation?: string;
  guarantor_address?: string;
  guarantor_income?: number;
}

export const createOrUpdateApplication = async (applicationData: ApplicationFormData, applicationId?: string, status: 'draft' | 'submitted' = 'draft') => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;

    const data = {
      ...applicationData,
      status: status,
      tenant_id: userId,
    };
    
    let result;
    
    // Mise à jour ou création du dossier
    if (applicationId) {
      const { data: application, error } = await supabase
        .from('tenant_applications')
        .update(data)
        .eq('id', applicationId)
        .select()
        .single();
        
      if (error) throw error;
      result = application;
    } else {
      const { data: application, error } = await supabase
        .from('tenant_applications')
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      result = application;
    }

    toast({
      title: status === 'draft' ? "Brouillon enregistré" : "Dossier soumis avec succès",
      description: status === 'draft' 
        ? "Vos informations ont été sauvegardées." 
        : "Votre dossier a été soumis et sera examiné par nos équipes.",
    });
    
    return result;
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde du dossier:", error);
    toast({
      title: "Erreur",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchApplication = async (applicationId?: string) => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const userId = sessionData.session.user.id;
    
    let query = supabase
      .from('tenant_applications')
      .select('*')
      .eq('tenant_id', userId);
      
    if (applicationId) {
      query = query.eq('id', applicationId);
    }
    
    // Récupérer le dernier dossier créé si aucun ID n'est spécifié
    const { data, error } = await query.order('created_at', { ascending: false }).maybeSingle();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du dossier:", error);
    return null;
  }
};

export const fetchTenants = async () => {
  try {
    const { data: tenants, error } = await supabase
      .from('profiles')
      .select(`
        *,
        tenant_applications (*)
      `)
      .eq('type', 'tenant')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return tenants;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des locataires:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les locataires",
      variant: "destructive",
    });
    return [];
  }
};
