
export const validatePropertyForm = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Le titre est requis');
  } else if (data.title.trim().length < 5) {
    errors.push('Le titre doit contenir au moins 5 caractères');
  }

  if (!data.address?.trim()) {
    errors.push('L\'adresse est requise');
  } else if (data.address.trim().length < 10) {
    errors.push('L\'adresse doit contenir au moins 10 caractères');
  }

  if (!data.city?.trim()) {
    errors.push('La ville est requise');
  }

  if (!data.postal_code?.trim()) {
    errors.push('Le code postal est requis');
  } else if (!/^\d{5}$/.test(data.postal_code.trim())) {
    errors.push('Le code postal doit contenir exactement 5 chiffres');
  }

  if (!data.property_type) {
    errors.push('Le type de bien est requis');
  }

  if (!data.rooms || data.rooms < 1 || data.rooms > 20) {
    errors.push('Le nombre de pièces doit être entre 1 et 20');
  }

  if (!data.area || data.area < 1 || data.area > 10000) {
    errors.push('La surface doit être entre 1 et 10000 m²');
  }

  if (!data.price || data.price < 1 || data.price > 50000) {
    errors.push('Le loyer doit être entre 1 et 50000 €');
  }

  if (data.description && data.description.length > 2000) {
    errors.push('La description ne peut pas dépasser 2000 caractères');
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  return input?.trim().replace(/\s+/g, ' ') || '';
};
