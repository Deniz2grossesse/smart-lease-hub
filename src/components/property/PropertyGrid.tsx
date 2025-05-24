
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize, BedDouble, ImageIcon } from 'lucide-react';
import { Property } from '@/lib/types/property';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ImageIcon className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Aucune annonce trouvée
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
          <Link to={`/properties/${property.id}`}>
            {/* Image */}
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              {property.property_images?.[0] ? (
                <img
                  src={property.property_images[0].url}
                  alt={property.title}
                  className="w-full h-full object-cover"
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
                          <span class="text-sm">Photo indisponible</span>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm">Photo indisponible</span>
                </div>
              )}
              
              {/* Badge type */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {getPropertyTypeLabel(property.property_type)}
                </Badge>
              </div>

              {/* Badge prix */}
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-600 text-white font-bold">
                  {formatPrice(property.price)}/mois
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Titre */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {property.title}
              </h3>

              {/* Adresse */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm line-clamp-1">
                  {property.city}
                </span>
              </div>

              {/* Caractéristiques */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Maximize className="h-4 w-4 mr-1" />
                  <span>{property.area} m²</span>
                </div>
                <div className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-1" />
                  <span>{property.rooms} pièce{property.rooms > 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm">
                Voir l'annonce
              </Button>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default PropertyGrid;
