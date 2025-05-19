
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
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, firstName: string, lastName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
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
        phone: data.phone || undefined
      };
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
    } catch (error: any) {
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
      // Create user in Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            type: userType,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null
          });
        
        if (profileError) throw profileError;
      }
      
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

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut }}>
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
