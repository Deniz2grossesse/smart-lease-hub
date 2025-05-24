
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, ArrowLeft, User, Mail, Phone } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-messages';
import PublicApplicationForm from '@/components/property/PublicApplicationForm';
import { fetchPublicPropertyById } from '@/lib/services/publicPropertyService';
import { Property } from '@/lib/types/property';

const PublicPropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      console.log('Chargement propriété publique ID:', id);
      
      try {
        const data = await fetchPublicPropertyById(id);
        setProperty(data);
        
        if (!data) {
          console.log('Propriété non trouvée ou non publique');
        }
      } catch (error) {
        console.error('Erreur chargement propriété:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Chargement de l'annonce...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header simplifié */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <Logo className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">e-mmoLink</span>
              </Link>
              <nav className="flex space-x-4">
                <Link to="/properties" className="text-blue-600 font-medium">
                  Annonces
                </Link>
                <Link to="/auth" className="text-gray-600 hover:text-gray-900">
                  Se connecter
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage
            type="not-found"
            title="Annonce non trouvée"
            message="Cette annonce n'existe pas ou n'est plus disponible à la consultation publique."
            showRetry={false}
          />
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux annonces
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">e-mmoLink</span>
            </Link>
            <nav className="flex space-x-4">
              <Link to="/properties" className="text-blue-600 font-medium">
                Annonces
              </Link>
              <Link to="/auth" className="text-gray-600 hover:text-gray-900">
                Se connecter
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux annonces
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {property.property_images && property.property_images.length > 0 ? (
              <div className="space-y-4">
                <img
                  src={property.property_images[0].url}
                  alt={`Photo principale de ${property.title}`}
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {property.property_images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {property.property_images.slice(1, 4).map((image, index) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={`Photo ${index + 2} de ${property.title}`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Building className="h-16 w-16 mx-auto mb-2" />
                  <p>Aucune image disponible</p>
                </div>
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {property.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {property.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Aucune description fournie pour ce bien.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <Badge variant="default">Disponible</Badge>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}, {property.city} {property.postal_code}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <br />
                    <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pièces:</span>
                    <br />
                    <span className="font-medium">{property.rooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Surface:</span>
                    <br />
                    <span className="font-medium">{property.area} m²</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prix:</span>
                    <br />
                    <span className="font-bold text-xl text-blue-600">{formatPrice(property.price)}/mois</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  {!showApplicationForm ? (
                    <Button 
                      onClick={() => setShowApplicationForm(true)} 
                      className="w-full"
                      size="lg"
                    >
                      Candidater pour ce bien
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setShowApplicationForm(false)} 
                      variant="outline" 
                      className="w-full"
                    >
                      Masquer le formulaire
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            {property.profiles && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">
                      {property.profiles.first_name} {property.profiles.last_name}
                    </p>
                    <p className="text-sm text-gray-600">Agent immobilier</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{property.profiles.email}</span>
                  </div>
                  {property.profiles.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{property.profiles.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Formulaire de candidature */}
        {showApplicationForm && (
          <div className="mt-8">
            <PublicApplicationForm 
              propertyId={property.id}
              propertyTitle={property.title}
              onSuccess={() => setShowApplicationForm(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicPropertyDetail;
