
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  onFiltersChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    maxRooms?: number;
    propertyTypes?: string[];
    minArea?: number;
    maxArea?: number;
  }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange }) => {
  const [priceRange, setPriceRange] = useState([500, 2000]);
  const [areaRange, setAreaRange] = useState([20, 100]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const propertyTypes = [
    { id: 'apartment', label: 'Appartement' },
    { id: 'house', label: 'Maison' },
    { id: 'studio', label: 'Studio' },
    { id: 'loft', label: 'Loft' }
  ];

  const roomOptions = [
    { id: '1', label: '1 pièce' },
    { id: '2', label: '2 pièces' },
    { id: '3', label: '3 pièces' },
    { id: '4', label: '4 pièces' },
    { id: '5+', label: '5+ pièces' }
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    const newTypes = checked 
      ? [...selectedTypes, typeId]
      : selectedTypes.filter(t => t !== typeId);
    setSelectedTypes(newTypes);
    applyFilters(newTypes, selectedRooms, priceRange, areaRange);
  };

  const handleRoomChange = (roomId: string, checked: boolean) => {
    const newRooms = checked
      ? [...selectedRooms, roomId]
      : selectedRooms.filter(r => r !== roomId);
    setSelectedRooms(newRooms);
    applyFilters(selectedTypes, newRooms, priceRange, areaRange);
  };

  const applyFilters = (types: string[], rooms: string[], price: number[], area: number[]) => {
    const filters: any = {
      minPrice: price[0],
      maxPrice: price[1],
      minArea: area[0],
      maxArea: area[1]
    };

    if (types.length > 0) {
      filters.propertyTypes = types;
    }

    if (rooms.length > 0) {
      const roomNumbers = rooms.map(r => r === '5+' ? 5 : parseInt(r)).filter(Boolean);
      if (roomNumbers.length > 0) {
        filters.minRooms = Math.min(...roomNumbers);
        filters.maxRooms = Math.max(...roomNumbers);
      }
    }

    onFiltersChange(filters);
  };

  const resetFilters = () => {
    setPriceRange([500, 2000]);
    setAreaRange([20, 100]);
    setSelectedTypes([]);
    setSelectedRooms([]);
    onFiltersChange({});
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="mr-2 h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Prix (€/mois)
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={(value) => applyFilters(selectedTypes, selectedRooms, value, areaRange)}
            min={0}
            max={5000}
            step={50}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>

        <Separator />

        {/* Surface */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Surface (m²)
          </Label>
          <Slider
            value={areaRange}
            onValueChange={setAreaRange}
            onValueCommit={(value) => applyFilters(selectedTypes, selectedRooms, priceRange, value)}
            min={10}
            max={200}
            step={5}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{areaRange[0]}m²</span>
            <span>{areaRange[1]}m²</span>
          </div>
        </div>

        <Separator />

        {/* Type de bien */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Type de bien
          </Label>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                />
                <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Nombre de pièces */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Nombre de pièces
          </Label>
          <div className="space-y-2">
            {roomOptions.map((room) => (
              <div key={room.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`room-${room.id}`}
                  checked={selectedRooms.includes(room.id)}
                  onCheckedChange={(checked) => handleRoomChange(room.id, checked as boolean)}
                />
                <Label htmlFor={`room-${room.id}`} className="text-sm cursor-pointer">
                  {room.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Reset */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={resetFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
