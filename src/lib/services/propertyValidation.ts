
import { PropertyFormData } from '@/lib/types/property';

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePropertyForm = (data: PropertyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validation du titre
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Le titre est requis' });
  } else if (data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Le titre doit contenir au moins 3 caractères' });
  } else if (data.title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Le titre ne peut pas dépasser 100 caractères' });
  }

  // Validation de l'adresse
  if (!data.address?.trim()) {
    errors.push({ field: 'address', message: 'L\'adresse est requise' });
  } else if (data.address.trim().length < 5) {
    errors.push({ field: 'address', message: 'L\'adresse doit contenir au moins 5 caractères' });
  }

  // Validation de la ville
  if (!data.city?.trim()) {
    errors.push({ field: 'city', message: 'La ville est requise' });
  } else if (data.city.trim().length < 2) {
    errors.push({ field: 'city', message: 'La ville doit contenir au moins 2 caractères' });
  }

  // Validation du code postal
  if (!data.postal_code?.trim()) {
    errors.push({ field: 'postal_code', message: 'Le code postal est requis' });
  } else if (!/^\d{5}$/.test(data.postal_code.trim())) {
    errors.push({ field: 'postal_code', message: 'Le code postal doit contenir exactement 5 chiffres' });
  }

  // Validation du type de propriété
  const validTypes = ['apartment', 'house', 'studio', 'loft'];
  if (!data.property_type || !validTypes.includes(data.property_type)) {
    errors.push({ field: 'property_type', message: 'Type de propriété invalide' });
  }

  // Validation du nombre de pièces
  if (!data.rooms || data.rooms < 1 || data.rooms > 20) {
    errors.push({ field: 'rooms', message: 'Le nombre de pièces doit être entre 1 et 20' });
  }

  // Validation de la surface
  if (!data.area || data.area < 1 || data.area > 10000) {
    errors.push({ field: 'area', message: 'La surface doit être entre 1 et 10000 m²' });
  }

  // Validation du prix
  if (!data.price || data.price < 1 || data.price > 50000) {
    errors.push({ field: 'price', message: 'Le prix doit être entre 1€ et 50 000€ par mois' });
  }

  // Validation de la description (optionnelle mais limitée)
  if (data.description && data.description.length > 2000) {
    errors.push({ field: 'description', message: 'La description ne peut pas dépasser 2000 caractères' });
  }

  // Validation des images
  if (data.images && data.images.length > 10) {
    errors.push({ field: 'images', message: 'Vous ne pouvez pas télécharger plus de 10 images' });
  }

  if (data.images) {
    data.images.forEach((image, index) => {
      if (image.size > 10 * 1024 * 1024) { // 10MB
        errors.push({ field: 'images', message: `L'image ${index + 1} est trop volumineuse (max 10MB)` });
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(image.type)) {
        errors.push({ field: 'images', message: `L'image ${index + 1} n'est pas dans un format supporté (JPEG, PNG, WebP, GIF)` });
      }
    });
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  return input?.trim().replace(/[<>]/g, '') || '';
};
