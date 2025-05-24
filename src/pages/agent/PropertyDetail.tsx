
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Home, Users, Square, Euro, Calendar } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          property_images (*),
          profiles!properties_owner_id_fkey (first_name, last_name, email, phone)
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Propriété non trouvée</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
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
          Retour aux propriétés
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}, {property.city} {property.postal_code}
            </div>
          </div>
          <Badge variant={property.is_available ? "default" : "secondary"}>
            {property.is_available ? "Disponible" : "Indisponible"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {property.property_images && property.property_images.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {property.property_images.slice(0, 4).map((image: any, index: number) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {property.description || "Aucune description disponible."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-gray-500" />
                  Type
                </div>
                <span className="capitalize">{property.property_type}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  Pièces
                </div>
                <span>{property.rooms}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-2 text-gray-500" />
                  Surface
                </div>
                <span>{property.area} m²</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-2 text-gray-500" />
                  Loyer
                </div>
                <span className="font-semibold">{formatPrice(property.price)}/mois</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Créé le
                </div>
                <span>{formatDate(property.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Propriétaire */}
          {property.profiles && (
            <Card>
              <CardHeader>
                <CardTitle>Propriétaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">
                  {property.profiles.first_name} {property.profiles.last_name}
                </p>
                <p className="text-sm text-gray-600">{property.profiles.email}</p>
                {property.profiles.phone && (
                  <p className="text-sm text-gray-600">{property.profiles.phone}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <Button className="w-full mb-2">
                Contacter le propriétaire
              </Button>
              <Button variant="outline" className="w-full">
                Programmer une visite
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
