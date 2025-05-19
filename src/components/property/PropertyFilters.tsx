
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PropertyFiltersProps extends React.HTMLAttributes<HTMLDivElement> {}

const PropertyFilters = ({ className, ...props }: PropertyFiltersProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
      <div className="space-y-2">
        <h3 className="font-medium">Prix</h3>
        <div className="space-y-4">
          <Slider defaultValue={[500, 1500]} min={0} max={3000} step={50} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0€</span>
            <span>3000€</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Surface</h3>
        <div className="space-y-4">
          <Slider defaultValue={[20, 75]} min={10} max={150} step={5} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>10m²</span>
            <span>150m²</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Type de bien</h3>
        <div className="grid grid-cols-2 gap-2">
          {["Appartement", "Maison", "Studio", "Loft"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={`type-${type}`} />
              <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Pièces</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, "5+"].map((rooms) => (
            <div key={rooms} className="flex items-center space-x-2">
              <Checkbox id={`rooms-${rooms}`} />
              <Label 
                htmlFor={`rooms-${rooms}`} 
                className="text-sm"
              >
                {typeof rooms === "number" ? `${rooms} ${rooms > 1 ? "pièces" : "pièce"}` : rooms}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lg:col-span-4 flex justify-end space-x-2">
        <Button variant="outline">Réinitialiser</Button>
        <Button>Appliquer les filtres</Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
