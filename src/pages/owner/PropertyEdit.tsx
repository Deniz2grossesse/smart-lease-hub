
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const PropertyEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    postal_code: '',
    property_type: '',
    rooms: 1,
    area: 0,
    price: 0,
    description: '',
    is_available: true
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour modifier une propriété",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (id) {
      fetchProperty(id);
    }
  }, [id, user, navigate]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Propriété introuvable",
            description: "Cette propriété n'existe pas ou a été supprimée",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les données de la propriété",
            variant: "destructive"
          });
        }
        navigate('/owner/dashboard');
        return;
      }

      // Vérification critique de sécurité
      if (data.owner_id !== user?.id) {
        toast({
          title: "Accès non autorisé",
          description: "Vous n'avez pas le droit de modifier cette propriété",
          variant: "destructive"
        });
        navigate('/owner/dashboard');
        return;
      }

      if (data) {
        setFormData({
          title: data.title,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          property_type: data.property_type,
          rooms: data.rooms,
          area: data.area,
          price: data.price,
          description: data.description || '',
          is_available: data.is_available
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur système",
        description: "Une erreur technique s'est produite lors du chargement",
        variant: "destructive"
      });
      navigate('/owner/dashboard');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast({
        title: "Erreur d'authentification",
        description: "Session expirée, veuillez vous reconnecter",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', id)
        .eq('owner_id', user.id); // Double vérification côté serveur

      if (error) {
        console.error('Erreur Supabase:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder les modifications. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Propriété mise à jour",
        description: `Les modifications de "${formData.title}" ont été enregistrées avec succès`
      });
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur système",
        description: "Une erreur technique s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement des données de la propriété...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/owner/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-2xl font-bold">Modifier la Propriété</h1>
        <p className="text-gray-600">Modifiez les informations de votre propriété</p>
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
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="property_type">Type de bien *</Label>
                <Select 
                  value={formData.property_type} 
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  disabled={isLoading}
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
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Code postal *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                disabled={isLoading}
                placeholder="Décrivez votre propriété..."
              />
            </div>

            <div>
              <Label htmlFor="is_available">Disponibilité</Label>
              <Select 
                value={formData.is_available.toString()} 
                onValueChange={(value) => handleInputChange('is_available', value === "true")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Disponible à la location</SelectItem>
                  <SelectItem value="false">Loué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/owner/dashboard')}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyEdit;
