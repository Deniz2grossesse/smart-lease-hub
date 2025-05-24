
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  postal_code: string;
  property_type: 'apartment' | 'house' | 'studio' | 'loft';
  rooms: number;
  area: number;
  price: number;
  description?: string;
  is_available: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface PropertyFormData {
  title: string;
  address: string;
  city: string;
  postal_code: string;
  property_type: 'apartment' | 'house' | 'studio' | 'loft';
  rooms: number;
  area: number;
  price: number;
  description?: string;
  images?: File[];
}
