
import React, { useState } from 'react';
import { Search, MapPin, Euro, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = () => {
    onSearch({
      city: city || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      propertyType: propertyType || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Ville */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Où cherchez-vous ?
          </label>
          <Input
            placeholder="Ville, code postal..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>

        {/* Prix min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="inline h-4 w-4 mr-1" />
            Prix min
          </label>
          <Input
            type="number"
            placeholder="500"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Prix max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix max
          </label>
          <Input
            type="number"
            placeholder="2000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Type de bien */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="inline h-4 w-4 mr-1" />
            Type
          </label>
          <Select value={propertyType} onValueChange={setPropertyType}>
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
      </div>

      <div className="mt-4 flex justify-center">
        <Button onClick={handleSearch} size="lg" className="px-8">
          <Search className="mr-2 h-5 w-5" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
