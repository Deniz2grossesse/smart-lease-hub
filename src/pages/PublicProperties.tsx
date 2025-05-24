import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Search, Filter, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/layout/Logo';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { fetchPublicProperties, PublicPropertyFilters } from '@/lib/services/publicPropertyService';
import { Property } from '@/lib/types/property';

const PublicProperties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // États des filtres
  const [filters, setFilters] = useState<PublicPropertyFilters>({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    propertyType: searchParams.get('type') || '',
    minRooms: searchParams.get('minRooms') ? Number(searchParams.get('minRooms')) : undefined,
  });

  const loadProperties = async () => {
    setIsLoading(true);
    console.log('Chargement des propriétés publiques avec filtres:', filters);
    
    try {
      const data = await fetchPublicProperties(filters);
      setProperties(data);
      console.log(`${data.length} propriétés chargées`);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSearch = () => {
    // Mettre à jour les paramètres URL
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.minRooms) params.set('minRooms', filters.minRooms.toString());
    
    setSearchParams(params);
    loadProperties();
  };

  const resetFilters = () => {
    setFilters({});
    setSearchParams({});
    loadProperties();
  };

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

      {/* Section recherche */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <Input
                  placeholder="Rechercher par ville..."
                  value={filters.city || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={handleSearch} className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de bien
                  </label>
                  <Select value={filters.propertyType || ''} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, propertyType: value || undefined }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="house">Maison</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix min (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix max (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pièces min
                  </label>
                  <Select value={filters.minRooms?.toString() || ''} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, minRooms: value ? Number(value) : undefined }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Réinitialiser
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">Chargement des annonces...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Annonces immobilières
              </h1>
              <div className="text-sm text-gray-600">
                {properties.length} annonce{properties.length > 1 ? 's' : ''} trouvée{properties.length > 1 ? 's' : ''}
              </div>
            </div>

            {properties.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Aucune annonce trouvée</h3>
                  <p className="text-gray-600 mb-4">
                    Aucun bien ne correspond à vos critères de recherche.
                  </p>
                  <Button onClick={resetFilters}>
                    Voir toutes les annonces
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {property.property_images?.[0] ? (
                        <img 
                          src={property.property_images[0].url} 
                          alt={`Photo de ${property.title}`}
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                                  <svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <span class="text-sm">Image non disponible</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <span className="text-sm font-medium">Aucune image</span>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2" title={property.title}>
                          {property.title}
                        </CardTitle>
                        <Badge variant="default">
                          Disponible
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Adresse */}
                        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1" title={`${property.address}, ${property.city}`}>
                            {property.address}, {property.city}
                          </span>
                        </div>

                        {/* Caractéristiques */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <br />
                            <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pièces:</span>
                            <br />
                            <span className="font-medium">{property.rooms}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Surface:</span>
                            <br />
                            <span className="font-medium">{property.area} m²</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Prix:</span>
                            <br />
                            <span className="font-bold text-lg text-blue-600">{formatPrice(property.price)}/mois</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="mt-4">
                        <Button asChild className="w-full">
                          <Link 
                            to={`/properties/${property.id}`}
                            aria-label={`Voir les détails de ${property.title}`}
                          >
                            Voir l'annonce
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicProperties;
