import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { HomeIcon } from 'lucide-react';

const PropertyHeader = ({ propertyData }) => {
    const handleClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <img
                        src={propertyData.backgroundImage}
                        alt="Property"
                        className="w-full object-cover rounded-lg min-h-[40vh]"
                    />
                </div>

                <div className="md:w-1/2 pl-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-4 mt-5 md:mt-4">{propertyData.codeName}</h1>

                        <p className="text-gray-600 mb-4">{propertyData.type} - {propertyData.nature}</p>
                        <p className="text-gray-600 mb-4">{propertyData.rooms} pièces - {propertyData.size} m²</p>
                        <p className="text-gray-600 mb-4">{propertyData.floor}er étage</p>
                        <p className="text-gray-600 mb-4">{propertyData.extra}</p>
                        <p className="text-gray-600 mb-4">Année de construction: {propertyData.buildYear}</p>
                    </div>

                    <div className="mt-5">
                        <Button variant="default" size="default" className="mr-2" onClick={() => handleClick('agence')}>
                            Voir l'agence
                        </Button>
                        <Button variant="secondary" size="default" onClick={() => handleClick('formulaire')}>
                            Candidater
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PropertyHeader;