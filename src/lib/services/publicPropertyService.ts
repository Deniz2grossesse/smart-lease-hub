
import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types/property';

export interface PublicPropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minRooms?: number;
  maxRooms?: number;
}

export const fetchPublicProperties = async (filters?: PublicPropertyFilters): Promise<Property[]> => {
  try {
    console.log('Récupération des propriétés publiques avec filtres:', filters);
    
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles!properties_owner_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('is_public', true)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters?.minRooms) {
      query = query.gte('rooms', filters.minRooms);
    }

    if (filters?.maxRooms) {
      query = query.lte('rooms', filters.maxRooms);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error('Erreur récupération propriétés publiques:', error);
      throw error;
    }

    return (properties || []) as Property[];
  } catch (error: any) {
    console.error('Erreur fetch public properties:', error);
    return [];
  }
};

export const fetchPublicPropertyById = async (id: string): Promise<Property | null> => {
  try {
    console.log('Récupération propriété publique par ID:', id);
    
    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles!properties_owner_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .eq('is_public', true)
      .eq('is_available', true)
      .single();

    if (error) {
      console.error('Erreur récupération propriété publique:', error);
      return null;
    }

    return property as Property;
  } catch (error: any) {
    console.error('Erreur fetch public property by id:', error);
    return null;
  }
};
