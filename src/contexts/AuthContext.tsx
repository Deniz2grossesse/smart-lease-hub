import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

type UserType = 'tenant' | 'owner' | 'agent';

interface UserProfile {
  id: string;
  email: string;
  type: UserType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, firstName: string, lastName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  createTestUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile with setTimeout to avoid Supabase deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Utiliser maybeSingle au lieu de single pour éviter les erreurs quand aucun profil n'est trouvé

      if (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        return; // Ne pas arrêter l'exécution avec throw
      }

      console.log("Profile data received:", data);
      
      // Si aucun profil n'est trouvé, on utilise les informations de l'utilisateur pour construire un profil par défaut
      if (!data) {
        console.log("No profile found, using default profile from user data");
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          type: 'tenant' // Valeur par défaut
        };
        
        setProfile(defaultProfile);
        redirectBasedOnUserType(defaultProfile.type);
        setLoading(false);
        return;
      }
      
      // Valider et convertir le type reçu en UserType
      const profileType = validateUserType(data.type);
      
      // Créer un objet UserProfile avec le type validé
      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        type: profileType,
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        phone: data.phone || undefined,
        created_at: data.created_at || undefined
      };
      
      setProfile(userProfile);
      
      // Redirect based on user type after profile is loaded
      redirectBasedOnUserType(profileType);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // En cas d'erreur, définir un profil par défaut pour permettre la navigation
      if (user) {
        const defaultProfile: UserProfile = {
          id: userId,
          email: user.email || '',
          type: 'tenant' // Valeur par défaut
        };
        setProfile(defaultProfile);
        redirectBasedOnUserType(defaultProfile.type);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new function to redirect based on user type
  const redirectBasedOnUserType = (userType: UserType) => {
    console.log("Redirecting based on user type:", userType);
    // Ne pas rediriger si l'utilisateur est déjà sur une page correspondant à son type
    const currentPath = window.location.pathname;
    const isOnCorrectPath = (
      (userType === 'tenant' && currentPath.startsWith('/tenant')) ||
      (userType === 'owner' && currentPath.startsWith('/owner')) ||
      (userType === 'agent' && currentPath.startsWith('/agent'))
    );
    
    if (isOnCorrectPath) {
      console.log("User already on correct path:", currentPath);
      return;
    }
    
    switch(userType) {
      case 'tenant':
        navigate('/tenant/dashboard');
        break;
      case 'owner':
        navigate('/owner/dashboard');
        break;
      case 'agent':
        navigate('/agent/dashboard');
        break;
      default:
        navigate('/');
    }
  };
  
  // Fonction pour valider que le type est bien un UserType
  const validateUserType = (type: string): UserType => {
    if (type === 'tenant' || type === 'owner' || type === 'agent') {
      return type;
    }
    // Valeur par défaut si le type n'est pas valide
    console.warn(`Type utilisateur invalide: ${type}, utilisation de 'tenant' par défaut`);
    return 'tenant';
  };

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
      
      // If we have user data and profile data, redirect immediately
      // This helps with faster navigation
      if (data.user && profile) {
        redirectBasedOnUserType(profile.type);
      }
      // Otherwise, profile fetch and redirect will happen via the auth state change listener
      
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
      // Create user in Auth with metadata
      // The trigger will automatically create the profile
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

  // Fonction pour créer des utilisateurs de test
  const createTestUsers = async () => {
    try {
      // Créer l'utilisateur agent
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
      
      // Créer l'utilisateur propriétaire
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
      
      // Créer l'utilisateur locataire
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

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut, createTestUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
