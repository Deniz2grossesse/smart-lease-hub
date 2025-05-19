
import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/layout/Logo";

// Dummy data for property listings
const dummyProperties = [
  {
    id: 1,
    title: "Appartement lumineux au centre-ville",
    address: "123 Rue de la République, Lyon",
    price: 850,
    area: 45,
    rooms: 2,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&h=300"
  },
  {
    id: 2,
    title: "Studio moderne près de la gare",
    address: "45 Avenue Jean Jaurès, Paris",
    price: 650,
    area: 30,
    rooms: 1,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&h=300"
  },
  {
    id: 3,
    title: "Maison avec jardin",
    address: "8 Rue des Pins, Toulouse",
    price: 1200,
    area: 90,
    rooms: 4,
    type: "Maison",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=500&h=300"
  },
  {
    id: 4,
    title: "Appartement rénové quartier historique",
    address: "27 Rue Sainte-Catherine, Bordeaux",
    price: 900,
    area: 55,
    rooms: 3,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=500&h=300"
  },
  {
    id: 5,
    title: "Loft design industriel",
    address: "12 Quai des Chartrons, Bordeaux",
    price: 1100,
    area: 70,
    rooms: 2,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?auto=format&fit=crop&w=500&h=300"
  },
  {
    id: 6,
    title: "Studio étudiant près du campus",
    address: "5 Avenue des Sciences, Montpellier",
    price: 550,
    area: 25,
    rooms: 1,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&h=300"
  },
];

const Index = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [userType, setUserType] = useState<"tenant" | "owner" | "agent" | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center my-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Logo className="h-14 w-14" />
            <h1 className="text-3xl font-bold font-brand">
              <span className="text-brand-navy">e-mmo</span>
              <span className="text-brand-navy">Link</span>
              <span className="text-brand-red">.</span>
            </h1>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Connexion</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connexion</DialogTitle>
                  <DialogDescription>
                    Connectez-vous à votre compte e-mmoLink.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Tabs defaultValue="tenant" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tenant">Locataire</TabsTrigger>
                      <TabsTrigger value="owner">Propriétaire</TabsTrigger>
                      <TabsTrigger value="agent">Agent</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="exemple@email.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Se connecter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
              <DialogTrigger asChild>
                <Button>Inscription</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Inscription</DialogTitle>
                  <DialogDescription>
                    Créez votre compte e-mmoLink.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Tabs defaultValue="tenant" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tenant">Locataire</TabsTrigger>
                      <TabsTrigger value="owner">Propriétaire</TabsTrigger>
                      <TabsTrigger value="agent">Agent</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <Input id="first-name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input id="last-name" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="exemple@email.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reg-password">Mot de passe</Label>
                    <Input id="reg-password" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">S'inscrire</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une ville, un quartier, une adresse..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              </Button>
            </div>

            {showFilters && <PropertyFilters className="mt-4" />}
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Annonces récentes</h2>
          <p className="text-muted-foreground">Trouvez votre futur logement parmi nos annonces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
