
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Home, Users, Square, Euro, Calendar, Phone, Mail, MessageSquare, CalendarDays } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorFallback from '@/components/ui/error-fallback';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    } else {
      setError("ID de propriété manquant");
      setIsLoading(false);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          profiles!properties_owner_id_fkey (first_name, last_name, email, phone)
        `)
        .eq('id', propertyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError("Cette propriété n'existe pas ou n'est plus disponible");
        } else {
          console.error('Erreur lors du chargement:', error);
          setError("Impossible de charger les détails de la propriété");
        }
        return;
      }

      setProperty(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError("Une erreur technique s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactOwner = () => {
    if (property?.profiles?.email) {
      window.location.href = `mailto:${property.profiles.email}?subject=Demande d'information - ${property.title}`;
    } else {
      toast({
        title: "Contact indisponible",
        description: "Les informations de contact du propriétaire ne sont pas disponibles",
        variant: "destructive"
      });
    }
  };

  const handleScheduleVisit = () => {
    toast({
      title: "Fonctionnalité en cours de développement",
      description: "La planification de visites sera bientôt disponible"
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-lg">Chargement des détails de la propriété...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
        </Button>
        <ErrorFallback 
          title="Propriété introuvable"
          message={error}
          onRetry={() => id && fetchProperty(id)}
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
        </Button>
        <ErrorFallback 
          title="Propriété non trouvée"
          message="Cette propriété n'existe pas dans notre base de données"
          showRetry={false}
        />
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

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: "Appartement",
      house: "Maison", 
      studio: "Studio",
      loft: "Loft"
    };
    return types[type] || type;
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
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.address}, {property.city} {property.postal_code}</span>
            </div>
          </div>
          <Badge variant={property.is_available ? "default" : "secondary"} className="text-lg px-4 py-2">
            {property.is_available ? "Disponible" : "Indisponible"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {property.property_images && property.property_images.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {property.property_images.slice(0, 4).map((image: any, index: number) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={`Photo ${index + 1} de ${property.title}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      {index === 3 && property.property_images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white font-semibold">
                            +{property.property_images.length - 4} photos
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucune photo disponible</h3>
                <p className="text-gray-500">Cette propriété n'a pas encore d'images</p>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {property.description && property.description.trim() ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune description n'a été fournie pour cette propriété.</p>
                </div>
              )}
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
                <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  Pièces
                </div>
                <span className="font-medium">{property.rooms}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-2 text-gray-500" />
                  Surface
                </div>
                <span className="font-medium">{property.area} m²</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-2 text-gray-500" />
                  Loyer
                </div>
                <span className="font-semibold text-lg">{formatPrice(property.price)}/mois</span>
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
              <CardContent className="space-y-3">
                <p className="font-medium text-lg">
                  {property.profiles.first_name} {property.profiles.last_name}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {property.profiles.email}
                </div>
                {property.profiles.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.profiles.phone}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button 
                className="w-full" 
                onClick={handleContactOwner}
                disabled={!property.profiles?.email}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contacter le propriétaire
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleScheduleVisit}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
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
