
import { User, Session } from '@supabase/supabase-js';

export type UserType = 'tenant' | 'owner' | 'agent';

export interface UserProfile {
  id: string;
  email: string;
  type: UserType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Add alias for backward compatibility
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Add alias for backward compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, firstName: string, lastName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  createTestUsers: () => Promise<void>;
}
