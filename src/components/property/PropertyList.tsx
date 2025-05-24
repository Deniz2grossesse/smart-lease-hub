
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, Eye } from "lucide-react";
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

  return (
    <>
      {properties.map((property) => (
        <Card key={property.id} className="hover-scale transition-all duration-200 animate-scale-in">
          {property.property_images?.[0] && (
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={property.property_images[0].url} 
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{property.title}</CardTitle>
              <Badge variant={property.is_available ? "default" : "secondary"}>
                {property.is_available ? "Disponible" : "Loué"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                {property.address}, {property.city}
              </p>
              <div className="flex justify-between text-sm">
                <span>{property.rooms} pièce{property.rooms > 1 ? 's' : ''}</span>
                <span>{property.area} m²</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{property.price}€/mois</span>
                {userType === 'owner' && (
                  <span className="text-sm text-muted-foreground">
                    {property.property_applications?.length || 0} candidature{(property.property_applications?.length || 0) > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild className="hover-scale">
                <Link to={`${baseRoute}/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="hover-scale">
                <Link to={`${baseRoute}/${property.id}/edit`}>
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
