
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createProperty, PropertyFormData } from '@/lib/services/propertyService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PropertyNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    city: '',
    postal_code: '',
    property_type: '',
    rooms: 1,
    area: 0,
    price: 0,
    description: '',
    images: []
  });

  if (!user) {
    return <div>Accès non autorisé</div>;
  }

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createProperty(formData);
      toast({
        title: "Succès",
        description: "La propriété a été créée avec succès.",
      });
      navigate('/agent/properties');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la propriété.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux biens
        </Button>
        <h1 className="text-2xl font-bold">Nouvelle Propriété</h1>
        <p className="text-gray-600">Ajoutez une nouvelle propriété à votre portefeuille</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la propriété</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Appartement 3 pièces centre-ville"
                  required
                />
              </div>

              <div>
                <Label htmlFor="property_type">Type de bien *</Label>
                <Select onValueChange={(value) => handleInputChange('property_type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 rue de la Paix"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  required
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Code postal *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="75001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rooms">Nombre de pièces *</Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="area">Surface (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Loyer (€/mois) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
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
                placeholder="Description détaillée de la propriété..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Vous pouvez sélectionner plusieurs images
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/agent/properties')}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Création en cours...' : 'Créer la propriété'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyNew;
