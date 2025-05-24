
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowLeft } from 'lucide-react';
import { PropertyFormData } from '@/lib/types/property';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
  submitButtonText: string;
  showImageUpload?: boolean;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyDataWithImages = {
      ...formData,
      images: showImageUpload ? selectedImages : formData.images
    };

    await onSubmit(propertyDataWithImages);
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="mb-4 animate-fade-in"
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
                minLength={5}
                maxLength={100}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Type de bien *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  required
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
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  required
                />
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
                minLength={10}
                maxLength={200}
              />
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
                  minLength={2}
                  maxLength={50}
                />
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
                  title="Le code postal doit contenir 5 chiffres"
                />
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
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Loyer mensuel (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  max="50000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
                />
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
                  />
                  <Label
                    htmlFor="images"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 hover-scale"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Cliquez pour ajouter des photos
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
