
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload } from 'lucide-react';

const AgentPropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la propriété",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !id) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          address: property.address,
          city: property.city,
          postal_code: property.postal_code,
          property_type: property.property_type,
          rooms: property.rooms,
          area: property.area,
          price: property.price,
          description: property.description,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le bien a été modifié avec succès",
      });
      
      navigate('/agent/properties');
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le bien",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProperty((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Modifier le bien</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations du bien</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'annonce</Label>
              <Input
                id="title"
                value={property.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Type de bien</Label>
                <Select
                  value={property.property_type}
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="rooms">Nombre de pièces</Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  value={property.rooms}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={property.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={property.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  value={property.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Surface (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  value={property.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Loyer mensuel (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={property.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={property.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/agent/properties')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Modification en cours..." : "Modifier le bien"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPropertyEdit;
