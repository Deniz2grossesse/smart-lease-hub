
import { Button } from "@/components/ui/button";
import PropertyImages from "@/components/property/PropertyImages";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type de bien</h3>
              <p className="mt-1">{getPropertyTypeLabel(property.property_type)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Disponibilité</h3>
              <p className="mt-1">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  property.is_available ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                }`}>
                  {property.is_available ? "Disponible" : "Loué"}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
            <address className="mt-1 not-italic">
              {property.address}<br />
              {property.city} {property.postal_code}
            </address>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pièces</h3>
              <p className="mt-1">{property.rooms}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Surface</h3>
              <p className="mt-1">{property.area} m²</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Loyer</h3>
              <p className="mt-1">{property.price} €/mois</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            {property.description && property.description.trim() ? (
              <p className="mt-1 whitespace-pre-wrap">{property.description}</p>
            ) : (
              <div className="mt-1 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-200 text-center">
                <p className="text-muted-foreground italic">Aucune description disponible</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEditClick}
                  className="mt-2"
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
