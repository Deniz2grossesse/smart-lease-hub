
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type de bien</h3>
              <p className="mt-1">{property.property_type === "apartment" ? "Appartement" : 
                                 property.property_type === "house" ? "Maison" : 
                                 property.property_type === "studio" ? "Studio" : 
                                 property.property_type === "loft" ? "Loft" : 
                                 property.property_type}</p>
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
            <p className="mt-1">{property.address}</p>
            <p>{property.city} {property.postal_code}</p>
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
              <p className="mt-1 text-muted-foreground italic">Pas de description disponible</p>
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
