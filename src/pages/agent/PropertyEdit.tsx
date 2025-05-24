
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
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

const AgentPropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté comme agent pour modifier une propriété",
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
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          profiles!properties_owner_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
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
            description: "Impossible de charger les détails de la propriété",
            variant: "destructive"
          });
        }
        navigate('/agent/properties');
        return;
      }

      setProperty(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur système",
        description: "Une erreur technique s'est produite lors du chargement",
        variant: "destructive"
      });
      navigate('/agent/properties');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !id || !user) {
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
        .update({
          title: property.title?.trim(),
          address: property.address?.trim(),
          city: property.city?.trim(),
          postal_code: property.postal_code?.trim(),
          property_type: property.property_type,
          rooms: property.rooms,
          area: property.area,
          price: property.price,
          description: property.description?.trim(),
        })
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        toast({
          title: "Erreur de modification",
          description: "Impossible de sauvegarder les modifications. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Bien modifié avec succès",
        description: `Les modifications de "${property.title}" ont été enregistrées`
      });
      
      navigate('/agent/properties');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur système",
        description: "Une erreur technique s'est produite lors de la sauvegarde",
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

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Propriété non trouvée</h2>
          <p className="text-muted-foreground mb-6">
            Cette propriété n'existe pas ou vous n'avez pas les droits pour y accéder.
          </p>
          <Button onClick={() => navigate('/agent/properties')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux propriétés
          </Button>
        </div>
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
        {property.profiles && (
          <p className="text-muted-foreground">
            Propriétaire: {property.profiles.first_name} {property.profiles.last_name}
          </p>
        )}
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations du bien</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'annonce *</Label>
              <Input
                id="title"
                value={property.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                minLength={5}
                maxLength={100}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Type de bien *</Label>
                <Select
                  value={property.property_type || ''}
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

              <div>
                <Label htmlFor="rooms">Nombre de pièces *</Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  max="20"
                  value={property.rooms || 1}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={property.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                minLength={10}
                maxLength={200}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={property.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Code postal *</Label>
                <Input
                  id="postal_code"
                  value={property.postal_code || ''}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  required
                  pattern="[0-9]{5}"
                  title="Le code postal doit contenir 5 chiffres"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Surface (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  max="10000"
                  step="0.1"
                  value={property.area || 0}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="price">Loyer mensuel (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  max="50000"
                  value={property.price || 0}
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
                value={property.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                maxLength={2000}
                disabled={isLoading}
                placeholder="Décrivez les caractéristiques du bien..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {(property.description || '').length}/2000 caractères
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/agent/properties')}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Modification en cours...
                  </>
                ) : (
                  "Modifier le bien"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPropertyEdit;
