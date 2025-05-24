
import { supabase } from '@/lib/supabase';

export const validatePropertyOwnership = async (
  propertyId: string,
  userId: string
): Promise<{ isOwner: boolean; property?: any }> => {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('owner_id, title')
      .eq('id', propertyId)
      .single();

    if (error) {
      console.error('Erreur validation propriété:', error);
      return { isOwner: false };
    }

    if (!property) {
      return { isOwner: false };
    }

    return {
      isOwner: property.owner_id === userId,
      property
    };
  } catch (error) {
    console.error('Erreur validation ownership:', error);
    return { isOwner: false };
  }
};

export const validateAgentAccess = async (
  userId: string
): Promise<{ hasAccess: boolean; userType?: string }> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return { hasAccess: false };
    }

    return {
      hasAccess: profile.type === 'agent',
      userType: profile.type
    };
  } catch (error) {
    console.error('Erreur validation agent:', error);
    return { hasAccess: false };
  }
};
