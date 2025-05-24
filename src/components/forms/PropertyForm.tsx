
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowLeft, AlertCircle } from 'lucide-react';
import { PropertyFormData } from '@/lib/types/property';
import { toast } from '@/hooks/use-toast';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
  submitButtonText: string;
  showImageUpload?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  title,
  submitButtonText,
  showImageUpload = true
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData.title || '',
    address: initialData.address || '',
    city: initialData.city || '',
    postal_code: initialData.postal_code || '',
    property_type: initialData.property_type || 'apartment',
    rooms: initialData.rooms || 1,
    area: initialData.area || 0,
    price: initialData.price || 0,
    description: initialData.description || '',
    images: initialData.images || []
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.address.trim() || formData.address.length < 10) {
      newErrors.address = 'L\'adresse doit contenir au moins 10 caractères';
    }

    if (!formData.city.trim() || formData.city.length < 2) {
      newErrors.city = 'La ville doit contenir au moins 2 caractères';
    }

    if (!/^[0-9]{5}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Le code postal doit contenir exactement 5 chiffres';
    }

    if (formData.rooms < 1 || formData.rooms > 20) {
      newErrors.rooms = 'Le nombre de pièces doit être entre 1 et 20';
    }

    if (formData.area <= 0 || formData.area > 10000) {
      newErrors.area = 'La surface doit être entre 1 et 10000 m²';
    }

    if (formData.price <= 0 || formData.price > 50000) {
      newErrors.price = 'Le prix doit être entre 1 et 50000 €';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreurs de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive"
      });
      return;
    }

    const propertyDataWithImages = {
      ...formData,
      images: showImageUpload ? selectedImages : formData.images
    };

    try {
      await onSubmit(propertyDataWithImages);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        
        if (!isValidType) {
          toast({
            title: "Type de fichier invalide",
            description: `${file.name} n'est pas une image valide`,
            variant: "destructive"
          });
        }
        
        if (!isValidSize) {
          toast({
            title: "Fichier trop volumineux",
            description: `${file.name} dépasse 5MB`,
            variant: "destructive"
          });
        }
        
        return isValidType && isValidSize;
      });
      
      setSelectedImages(validFiles);
    }
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;
    
    return (
      <div className="flex items-center text-red-500 text-sm mt-1">
        <AlertCircle className="h-4 w-4 mr-1" />
        {errors[field]}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="mb-4 animate-fade-in"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold animate-fade-in">{title}</h1>
      </div>

      <Card className="max-w-2xl mx-auto animate-scale-in">
        <CardHeader>
          <CardTitle>Informations du bien</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'annonce *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Appartement T2 centre-ville"
                required
                className={`transition-all duration-200 focus:scale-[1.02] ${errors.title ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {renderError('title')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Type de bien *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rooms">Nombre de pièces *</Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value) || 1)}
                  required
                  className={errors.rooms ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {renderError('rooms')}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ex: 123 rue de la Paix"
                required
                className={errors.address ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {renderError('address')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ex: Paris"
                  required
                  className={errors.city ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {renderError('city')}
              </div>

              <div>
                <Label htmlFor="postal_code">Code postal *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="Ex: 75001"
                  required
                  pattern="[0-9]{5}"
                  className={errors.postal_code ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {renderError('postal_code')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Surface (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  max="10000"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                  required
                  className={errors.area ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {renderError('area')}
              </div>

              <div>
                <Label htmlFor="price">Loyer mensuel (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  max="50000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                  className={errors.price ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {renderError('price')}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre bien immobilier..."
                rows={4}
                maxLength={2000}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/2000 caractères
              </p>
            </div>

            {showImageUpload && (
              <div>
                <Label htmlFor="images">Photos du bien</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="images"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 hover-scale ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Cliquez pour ajouter des photos
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés: JPG, PNG, WebP (max 5MB par fichier)
                      </p>
                      {selectedImages.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {selectedImages.length} fichier(s) sélectionné(s)
                        </p>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="transition-all duration-200 hover-scale"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 transition-all duration-200 hover-scale"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {submitButtonText}...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
