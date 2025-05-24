
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface PublicApplicationData {
  property_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  employment_status?: string;
  monthly_income?: number;
  current_rent?: number;
  message?: string;
  company?: string;
  position?: string;
}

const RATE_LIMIT = {
  MAX_APPLICATIONS_PER_DAY: 3,
  TIME_WINDOW_HOURS: 24
};

const checkRateLimit = async (): Promise<boolean> => {
  try {
    // Note: Dans un vrai environnement, il faudrait récupérer l'IP côté serveur
    // Pour cette démo, on utilise un timestamp local
    const now = new Date();
    const dayAgo = new Date(now.getTime() - (RATE_LIMIT.TIME_WINDOW_HOURS * 60 * 60 * 1000));
    
    // Simuler une vérification IP (ici on utilise localStorage pour la démo)
    const recentApplications = localStorage.getItem('recent_applications');
    const applications = recentApplications ? JSON.parse(recentApplications) : [];
    
    // Nettoyer les anciennes candidatures
    const validApplications = applications.filter((app: any) => 
      new Date(app.timestamp) > dayAgo
    );
    
    if (validApplications.length >= RATE_LIMIT.MAX_APPLICATIONS_PER_DAY) {
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${RATE_LIMIT.MAX_APPLICATIONS_PER_DAY} candidatures par jour`,
        variant: "destructive"
      });
      return false;
    }
    
    // Enregistrer cette candidature
    validApplications.push({ timestamp: now.toISOString() });
    localStorage.setItem('recent_applications', JSON.stringify(validApplications));
    
    return true;
  } catch (error) {
    console.error('Erreur vérification rate limit:', error);
    return true; // En cas d'erreur, on autorise
  }
};

export const submitPublicApplication = async (applicationData: PublicApplicationData): Promise<boolean> => {
  try {
    console.log('Soumission candidature publique:', applicationData);

    // Vérifier le rate limiting
    const canApply = await checkRateLimit();
    if (!canApply) {
      return false;
    }

    // Validation des données
    if (!applicationData.candidate_name?.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir votre nom complet",
        variant: "destructive"
      });
      return false;
    }

    if (!applicationData.candidate_email?.trim()) {
      toast({
        title: "Email requis", 
        description: "Veuillez saisir votre adresse email",
        variant: "destructive"
      });
      return false;
    }

    if (!applicationData.candidate_phone?.trim()) {
      toast({
        title: "Téléphone requis",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive"
      });
      return false;
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.candidate_email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return false;
    }

    // Préparer les données pour l'insertion
    const insertData = {
      property_id: applicationData.property_id,
      candidate_name: applicationData.candidate_name.trim(),
      candidate_email: applicationData.candidate_email.trim().toLowerCase(),
      candidate_phone: applicationData.candidate_phone.trim(),
      employment_status: applicationData.employment_status || null,
      monthly_income: applicationData.monthly_income || null,
      current_rent: applicationData.current_rent || null,
      company: applicationData.company?.trim() || null,
      position: applicationData.position?.trim() || null,
      first_name: applicationData.candidate_name.split(' ')[0] || '',
      last_name: applicationData.candidate_name.split(' ').slice(1).join(' ') || '',
      status: 'submitted',
      tenant_id: null // Candidature publique
    };

    // Insérer la candidature
    const { data, error } = await supabase
      .from('tenant_applications')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erreur insertion candidature publique:', error);
      toast({
        title: "Erreur de soumission",
        description: "Impossible d'envoyer votre candidature. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    }

    // Créer l'entrée dans property_applications pour lier à la propriété
    const { error: linkError } = await supabase
      .from('property_applications')
      .insert({
        property_id: applicationData.property_id,
        tenant_id: data.id, // Utiliser l'ID de la candidature comme référence
        application_id: data.id,
        status: 'pending',
        message: applicationData.message || null
      });

    if (linkError) {
      console.warn('Erreur liaison candidature-propriété:', linkError);
      // On continue car la candidature principale est créée
    }

    toast({
      title: "Candidature envoyée !",
      description: "Votre candidature a été transmise à l'agent immobilier. Vous serez contacté(e) rapidement.",
    });

    return true;

  } catch (error: any) {
    console.error('Erreur soumission candidature publique:', error);
    toast({
      title: "Erreur inattendue",
      description: "Une erreur technique s'est produite. Veuillez réessayer dans quelques instants.",
      variant: "destructive"
    });
    return false;
  }
};
