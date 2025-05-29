import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationContainerProps {
  address: string;
  description: string;
}

const LocationContainer: React.FC<LocationContainerProps> = ({ address, description }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapContainerRef.current!).setView([48.8566, 2.3522], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch geocode for the address and update the position
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const position: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          map.setView(position, 13);
          L.marker(position).addTo(map)
            .bindPopup(address)
            .openPopup();
        }
      })
      .catch(error => console.error('Error fetching geocode:', error));

    // Store the map instance in the ref
    mapRef.current = map;

    // Cleanup function to remove the map
    return () => {
      map.remove();
    };
  }, [address]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Localisation et Environnement</h2>
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-4" ref={mapContainerRef}></div>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
    </div>
  );
};

export default LocationContainer;