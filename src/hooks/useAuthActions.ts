
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { UserType, UserProfile } from '@/types/auth';

export const useAuthActions = (
  profile: UserProfile | null,
  redirectCallback: (userType: UserType) => void
) => {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      console.log("Sign in successful, user data:", data.user?.id);
      
      if (data.user && profile) {
        redirectCallback(profile.type);
      }
      
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userType: UserType, 
    firstName: string, 
    lastName: string,
    phone?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            type: userType,
            phone: phone || null
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté"
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createTestUsers = async () => {
    try {
      const { data: agentData, error: agentError } = await supabase.auth.signUp({
        email: 'agent_test1@example.com',
        password: 'agent_test1',
        options: {
          data: {
            first_name: 'Agent',
            last_name: 'Test',
            type: 'agent',
            phone: '+33612345678'
          }
        }
      });
      
      if (agentError) throw agentError;
      
      const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
        email: 'proprio_test1@example.com',
        password: 'proprio_test1',
        options: {
          data: {
            first_name: 'Proprio',
            last_name: 'Test',
            type: 'owner',
            phone: '+33623456789'
          }
        }
      });
      
      if (ownerError) throw ownerError;
      
      const { data: tenantData, error: tenantError } = await supabase.auth.signUp({
        email: 'locataire_test1@example.com',
        password: 'locataire_test1',
        options: {
          data: {
            first_name: 'Locataire',
            last_name: 'Test',
            type: 'tenant',
            phone: '+33634567890'
          }
        }
      });
      
      if (tenantError) throw tenantError;
      
      toast({
        title: "Comptes de test créés",
        description: "Les comptes agent, propriétaire et locataire ont été créés avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création des comptes de test",
        description: error.message,
        variant: "destructive"
      });
      console.error("Erreur lors de la création des utilisateurs de test:", error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    createTestUsers
  };
};
