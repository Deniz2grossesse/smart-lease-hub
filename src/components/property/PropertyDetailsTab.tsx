
import { Button } from "@/components/ui/button";
import PropertyImages from "@/components/property/PropertyImages";
import { MapPin, Home, Square, Euro, User, Calendar, FileText } from "lucide-react";

interface PropertyDetailsTabProps {
  property: any;
  editing: boolean;
  onEditClick: () => void;
  onImageDeleted: (imageId: string) => void;
}

const PropertyDetailsTab = ({ property, editing, onEditClick, onImageDeleted }: PropertyDetailsTabProps) => {
  if (editing) {
    return null; // Edit form will be handled separately
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: "Appartement",
      house: "Maison", 
      studio: "Studio",
      loft: "Loft"
    };
    return types[type] || type;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600" />
              Caractéristiques du bien
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{getPropertyTypeLabel(property.property_type)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Surface</p>
                  <p className="font-medium">{property.area} m²</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pièces</p>
                  <p className="font-medium">{property.rooms}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Loyer</p>
                  <p className="font-medium">{formatPrice(property.price)}/mois</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Adresse */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Localisation
            </h3>
            <address className="not-italic space-y-1">
              <p className="font-medium">{property.address}</p>
              <p className="text-muted-foreground">{property.city} {property.postal_code}</p>
            </address>
          </div>
          
          {/* Disponibilité */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Disponibilité
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                property.is_available 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {property.is_available ? "Disponible à la location" : "Actuellement loué"}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Description
            </h3>
            {property.description && property.description.trim() ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-white">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-muted-foreground mb-3">
                  Aucune description n'a été ajoutée pour cette propriété
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEditClick}
                  aria-label="Ajouter une description à cette propriété"
                >
                  Ajouter une description
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <PropertyImages 
            images={property.property_images || []}
            propertyId={property.id}
            onImageDeleted={onImageDeleted}
            onEditClick={onEditClick}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsTab;
