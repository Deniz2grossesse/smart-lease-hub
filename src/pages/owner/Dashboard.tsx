
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, User, Clock, Home, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data
const properties = [
  {
    id: 1,
    title: "Appartement T3 Centre-ville",
    address: "15 Rue de la République, Lyon",
    status: "rented",
    tenant: "Marie Dubois",
    rent: 850,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&h=300",
  },
  {
    id: 2,
    title: "Studio Quartier Latin",
    address: "8 Rue Mouffetard, Paris",
    status: "available",
    tenant: null,
    rent: 700,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&h=300",
  },
  {
    id: 3,
    title: "Maison avec jardin",
    address: "22 Avenue des Pins, Bordeaux",
    status: "rented",
    tenant: "Thomas Martin",
    rent: 1200,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=500&h=300",
  },
];

const tenants = [
  {
    id: 1,
    name: "Marie Dubois",
    property: "Appartement T3 Centre-ville",
    rentStatus: "paid",
    moveInDate: "01/03/2025",
    phoneNumber: "06 12 34 56 78",
    email: "marie.dubois@example.com"
  },
  {
    id: 2,
    name: "Thomas Martin",
    property: "Maison avec jardin",
    rentStatus: "late",
    moveInDate: "15/01/2025",
    phoneNumber: "07 23 45 67 89",
    email: "thomas.martin@example.com"
  }
];

const documents = [
  {
    id: 1,
    name: "Quittance de loyer - Mai 2025",
    property: "Appartement T3 Centre-ville",
    tenant: "Marie Dubois",
    date: "01/05/2025",
    type: "receipt"
  },
  {
    id: 2,
    name: "Contrat de bail",
    property: "Appartement T3 Centre-ville",
    tenant: "Marie Dubois",
    date: "01/03/2025",
    type: "contract"
  },
  {
    id: 3,
    name: "État des lieux d'entrée",
    property: "Appartement T3 Centre-ville",
    tenant: "Marie Dubois",
    date: "01/03/2025",
    type: "inventory"
  },
  {
    id: 4,
    name: "Contrat de bail",
    property: "Maison avec jardin",
    tenant: "Thomas Martin",
    date: "15/01/2025",
    type: "contract"
  },
  {
    id: 5,
    name: "Quittance de loyer - Mai 2025",
    property: "Maison avec jardin",
    tenant: "Thomas Martin",
    date: "01/05/2025",
    type: "receipt"
  },
];

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  
  // Count statistics
  const totalProperties = properties.length;
  const rentedProperties = properties.filter(p => p.status === "rented").length;
  const availableProperties = properties.filter(p => p.status === "available").length;
  const totalRent = properties.filter(p => p.status === "rented").reduce((sum, p) => sum + p.rent, 0);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord propriétaire</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Propriétés
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Nombre total de biens
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Biens loués
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rentedProperties}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {((rentedProperties / totalProperties) * 100).toFixed(0)}% de taux d'occupation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Biens disponibles
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableProperties}</div>
              <p className="text-xs text-muted-foreground mt-2">
                En attente de location
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Revenus locatifs
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRent} €</div>
              <p className="text-xs text-muted-foreground mt-2">
                Par mois
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestion de portefeuille</CardTitle>
                <CardDescription>
                  Gérez vos biens, locataires et documents
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un bien
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau bien</DialogTitle>
                    <DialogDescription>
                      Renseignez les informations concernant votre bien immobilier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="property-type">Type de bien</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Appartement</SelectItem>
                            <SelectItem value="house">Maison</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rooms">Nombre de pièces</Label>
                        <Input id="rooms" type="number" min="1" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Titre de l'annonce</Label>
                      <Input id="title" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="area">Surface (m²)</Label>
                        <Input id="area" type="number" min="1" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rent">Loyer (€)</Label>
                        <Input id="rent" type="number" min="1" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">Photos</Label>
                      <Input id="image" type="file" multiple />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Ajouter le bien</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Mes biens</TabsTrigger>
                <TabsTrigger value="tenants">Mes locataires</TabsTrigger>
                <TabsTrigger value="documents">Mes documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                            property.status === "rented" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {property.status === "rented" ? "Loué" : "Disponible"}
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-bold">{property.title}</h3>
                        <p className="text-muted-foreground text-sm">{property.address}</p>
                        {property.status === "rented" && (
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">Locataire:</span>
                            <span className="text-sm font-medium">{property.tenant}</span>
                          </div>
                        )}
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">Loyer:</span>
                          <span className="text-sm font-medium">{property.rent} €/mois</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Gérer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tenants" className="mt-6">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien loué</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut loyer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date d'entrée</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                          <td className="px-4 py-3 text-sm">{tenant.name}</td>
                          <td className="px-4 py-3 text-sm">{tenant.property}</td>
                          <td className="px-4 py-3 text-sm">
                            <span 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                tenant.rentStatus === "paid" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tenant.rentStatus === "paid" ? "Payé" : "En retard"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{tenant.moveInDate}</td>
                          <td className="px-4 py-3 text-sm">
                            <div>{tenant.phoneNumber}</div>
                            <div>{tenant.email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Button variant="outline" size="sm">Détails</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Document</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Locataire</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-3 text-sm">{doc.name}</td>
                          <td className="px-4 py-3 text-sm">{doc.property}</td>
                          <td className="px-4 py-3 text-sm">{doc.tenant}</td>
                          <td className="px-4 py-3 text-sm">{doc.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                doc.type === "receipt" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : doc.type === "contract"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {doc.type === "receipt" 
                                ? "Quittance" 
                                : doc.type === "contract"
                                ? "Contrat"
                                : "État des lieux"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Button variant="outline" size="sm">Télécharger</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
