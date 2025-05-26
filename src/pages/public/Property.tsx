import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from '@/components/layout/Logo';
import { Layout } from 'lucide-react';
import EnergyDiagnostic from '@/components/ui/property/EnergyDiagnostic';
import TenantForm from '@/components/ui/tenant/TenantForm';

const Property = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dummy Data
  const propertyData = {
    backgroundImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    codeName: "T4-75-0006",
    type: "Meublé",
    nature: "Appartement",
    rooms: "4",
    size: "78",
    floor: "1",
    extra: "Balcon de 12m², 2 places de garage",
    buildYear: "2018",
    propertyState: "",
    dpeLetter: "A",
    gesLetter: "d",
    address: "10 Charming Avenue, 75000 Paris",
    stateControl: ""
  }

  const rentalData = {
    amount: "1200",
    charges: "150",
    total: "1350",
    gli: "Oui",
    fees: {
      visit: "30",
      application: "50",
      leaseDrafting: "70",
      assessment: "150"
    },
  }

  const agencyData = {
    logoImage: "https://fr.foncia.com/assets/images/logo_foncia.svg",
    socialName: "Foncia Occitanie",
    addressHeadquarters: "50 Avenue Pompidou, 31200 Toulouse",
    rcsNumber: "123456789123",
    guaranteeAmount: "3050",
    siretNumber: "123456789123"
  }

  const images = [
    "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg"
  ];

  const tenantFormDataPersonnal = {
    name: '',
    lastname: '',
    dateOfBirth: '',
    address: '',
    idCard: 'path/to/file',
    rentReceipts: 'path/to/files',
    residenceCertificate: 'path/to/files',
    propertyTax: 'path/to/files'
  }

  const tenantFormDataProfessionnal = {
    situation: '',
    otherSituation: '',
    otherFile: 'path/to/file',
    lastPaySlips: 'path/to/file',
    taxAssessmentNotice: 'path/to/file',
    employementContract: 'path/to/file',
    kbisCertificate: 'path/to/file',
    retirementCertificate: 'path/to/file',
  }

  const tenantFormDataGuarantor = {
    cardId: 'path/to/file',
    lastPaySlips: 'path/to/file',
    residenceCertificate: 'path/to/files',
    visaleCertificate: 'path/to/file',
  }

  return (
    <div className="container mx-auto p-4">

      <div className="bg-white p-6">

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={propertyData.backgroundImage}
              alt="Property"
              className="w-full h-64 object-cover rounded-lg min-h-[40vh]"
            />
          </div>

          <div className="md:w-1/2 pl-8">
            <h1 className="text-2xl font-bold mb-2">{propertyData.codeName}</h1>
            <p className="text-gray-600 mb-4">{propertyData.type} - {propertyData.nature}</p>
            <p className="text-gray-600 mb-4">{propertyData.rooms} pièces - {propertyData.size} m²</p>
            <p className="text-gray-600 mb-4">{propertyData.floor}ème étage</p>
            <p className="text-gray-600 mb-4">{propertyData.extra}</p>
            <p className="text-gray-600 mb-4">Année de construction: {propertyData.buildYear}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Property ${index}`} className="w-full h-64 object-cover rounded-lg" />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Description de l'Appartement</h2>
          <p className="text-gray-600 mb-4">
            Cet appartement moderne de {propertyData.size} m² se situe au cœur de Paris, dans le 8ème arrondissement. Il comprend un salon lumineux, une cuisine équipée, deux chambres spacieuses, et une salle de bain. L'appartement est situé au {propertyData.floor}ème étage d'un immeuble sécurisé avec ascenseur. Il bénéficie d'une vue imprenable sur la ville et est proche de toutes les commodités (transports, commerces, écoles).
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Caractéristiques du Bien</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>{propertyData.extra}</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Informations sur le Loueur</h2>
          <p className="text-gray-600 mb-4">
            {agencyData.socialName}<br />
            Adresse: {agencyData.addressHeadquarters}<br />
            RCS: {agencyData.rcsNumber}<br />
            SIRET: {agencyData.siretNumber}<br />
            Garantie: {agencyData.guaranteeAmount} €
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Localisation et Environnement</h2>
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-4">
            {/* Carte interactive ici */}
          </div>
          <p className="text-gray-600 mb-4">
            Le quartier est très bien desservi par les transports en commun (métro, bus) et dispose de nombreux commerces de proximité, restaurants, et écoles. Le parc Monceau est à quelques minutes à pied.
          </p>
        </div>

        <div id="formulaire">
          <TenantForm />
        </div>

      </div>
    </div>
  );
};

export default Property;