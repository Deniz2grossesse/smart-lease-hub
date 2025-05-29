import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import TenantForm from '@/components/ui/tenant/TenantForm';
import LocationContainer from '@/components/ui/property/LocationContainer';
import PropertyHeader from '@/components/ui/property/PropertyHeader';
import { Paragraph, ParagraphTitle, ParagraphContent } from '@/components/ui/property/Paragraph';

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
    address: "75000 Paris",
    locationDescription: 'A côté de la tour Eiffel.',
    propertyDescription: 'Niché dans le prestigieux 15ème arrondissement de Paris, à seulement quelques pas de la majestueuse tour Eiffel, est un véritable joyau immobilier. Ce bien meublé de 78m², réparti en 4 pièces spacieuses, a été construit en 2018 et se trouve au 1er étage, offrant ainsi une accessibilité optimale. Vous serez séduit par son balcon de 12m², idéal pour profiter des vues urbaines, ainsi que par ses deux places de garage, garantissant un stationnement facile et sécurisé. Avec une performance énergétique exceptionnelle classée A, cet appartement allie confort, modernité et efficacité énergétique, faisant de lui un choix de premier ordre pour une vie parisienne de rêve.',
    stateControl: "",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg"
    ]
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

  const images = propertyData.images;

  return (
    <div className="container p-4">

      <div className="w-full mt-0 md:mt-20 mb-20">
        <PropertyHeader propertyData={propertyData} />
      </div>

      <div className="p-6 sm:p-0 max-w-[920px] m-auto">

        <Paragraph>
          <ParagraphTitle>Présentation du bien</ParagraphTitle>
          <ParagraphContent>{propertyData.propertyDescription}</ParagraphContent>
        </Paragraph>

        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Property ${index}`} className="w-full aspect-video object-cover rounded-lg" />
            ))}
          </div>
        </div>

        <Paragraph>
          <ParagraphTitle>Caractéristiques du bien</ParagraphTitle>
          <ParagraphContent>
            {propertyData.extra}
          </ParagraphContent>
        </Paragraph>

        <Paragraph>
          <ParagraphTitle>Informations sur le loueur</ParagraphTitle>
          <ParagraphContent>
            <ul>
              <li>{agencyData.socialName}</li>
              <li>Adresse: {agencyData.addressHeadquarters}</li>
              <li>RCS: {agencyData.rcsNumber}</li>
              <li>SIRET: {agencyData.siretNumber}</li>
              <li>Garantie: {agencyData.guaranteeAmount} €</li>
              <br />
              <li>Montant: {rentalData.amount} € / mois</li>
              <li>Charges: {rentalData.charges} € / mois</li>
              <li>Total: {rentalData.total} € / mois</li>
              <br />
              <li>GLI: {rentalData.gli}</li>
              <li>Frais de visite: {rentalData.fees.visit} €</li>
              <li>Frais de dossier: {rentalData.fees.application} €</li>
              <li>Frais de rédaction de bail: {rentalData.fees.leaseDrafting} €</li>
              <li>Frais d'évaluation: {rentalData.fees.assessment} €</li>
            </ul>
          </ParagraphContent>
        </Paragraph>

        <LocationContainer address={propertyData.address} description={propertyData.locationDescription} />

        <div className="mt-[15vh] md:hover:shadow-xl md:active:shadow-xl md:duration-200" id="formulaire">
          <TenantForm />
        </div>

      </div>
    </div>
  );
};

export default Property;