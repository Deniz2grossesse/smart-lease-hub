
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, Eye, ImageIcon, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  property_type: string;
  rooms: number;
  area: number;
  price: number;
  is_available: boolean;
  property_images?: Array<{ url: string }>;
  property_applications?: Array<any>;
}

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  baseRoute: string;
  userType: 'agent' | 'owner';
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  isLoading,
  baseRoute,
  userType
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Chargement des propriétés...</span>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="col-span-full animate-fade-in">
        <CardContent className="p-8 text-center">
          <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {userType === 'owner' 
              ? "Vous n'avez pas encore ajouté de biens à votre portefeuille"
              : "Aucun bien disponible pour le moment"
            }
          </p>
          {userType === 'owner' && (
            <Button asChild>
              <Link to={`${baseRoute}/new`}>
                Ajouter votre premier bien
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

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
    <>
      {properties.map((property) => (
        <Card key={property.id} className="hover-scale transition-all duration-200 animate-scale-in overflow-hidden">
          {/* Image de la propriété */}
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
              <CardTitle className="text-lg line-clamp-1" title={property.title}>
                {property.title}
              </CardTitle>
              <Badge variant={property.is_available ? "default" : "secondary"}>
                {property.is_available ? "Disponible" : "Loué"}
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
                  <span className="font-bold text-lg">{formatPrice(property.price)}/mois</span>
                </div>
              </div>

              {/* Candidatures pour les owners */}
              {userType === 'owner' && (
                <div className="text-sm text-muted-foreground">
                  {property.property_applications?.length || 0} candidature{(property.property_applications?.length || 0) > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild className="hover-scale flex-1">
                <Link 
                  to={`${baseRoute}/${property.id}`}
                  aria-label={`Voir les détails de ${property.title}`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="hover-scale flex-1">
                <Link 
                  to={`${baseRoute}/${property.id}/edit`}
                  aria-label={`Modifier ${property.title}`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PropertyList;
