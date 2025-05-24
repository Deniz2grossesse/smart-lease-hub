
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserType } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const validateUserType = (type: string): UserType => {
    if (type === 'tenant' || type === 'owner' || type === 'agent') {
      return type;
    }
    console.warn(`Type utilisateur invalide: ${type}, utilisation de 'tenant' par défaut`);
    return 'tenant';
  };

  const fetchProfile = async (userId: string, user: User | null, redirectCallback: (userType: UserType) => void) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data received:", data);
      
      if (!data) {
        console.log("No profile found, using default profile from user data");
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          type: 'tenant'
        };
        
        setProfile(defaultProfile);
        redirectCallback(defaultProfile.type);
        return;
      }
      
      const profileType = validateUserType(data.type);
      
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
      redirectCallback(profileType);
      
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      if (user) {
        const defaultProfile: UserProfile = {
          id: userId,
          email: user.email || '',
          type: 'tenant'
        };
        setProfile(defaultProfile);
        redirectCallback(defaultProfile.type);
      }
    }
  };

  return {
    profile,
    setProfile,
    fetchProfile
  };
};
