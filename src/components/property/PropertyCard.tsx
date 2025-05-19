
import { Building, MapPin, Maximize, BedDouble } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    address: string;
    price: number;
    area: number;
    rooms: number;
    type: string;
    image: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
          {property.type}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-xl font-bold mb-2 truncate">{property.title}</h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm truncate">{property.address}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <Building size={16} className="mr-1" />
              <span className="text-sm">{property.type}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <Maximize size={16} className="mr-1" />
              <span className="text-sm">{property.area} m²</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <BedDouble size={16} className="mr-1" />
              <span className="text-sm">{property.rooms} {property.rooms > 1 ? 'pièces' : 'pièce'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-xl font-bold">{property.price} €<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
        <Button size="sm">Voir détails</Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
