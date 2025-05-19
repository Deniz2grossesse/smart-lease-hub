
import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyFormData, createProperty, fetchProperties } from "@/lib/services/propertyService";
import { fetchDocuments, downloadDocument } from "@/lib/services/documentService";
import { fetchTenants } from "@/lib/services/tenantService";
import { toast } from "@/hooks/use-toast";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    address: "",
    city: "",
    postal_code: "",
    property_type: "",
    rooms: 1,
    area: 0,
    price: 0,
    description: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Charger les données lors du montage du composant
  useEffect(() => {
    const loadData = async () => {
      const propertiesData = await fetchProperties();
      setProperties(propertiesData);

      const tenantsData = await fetchTenants();
      setTenants(tenantsData);

      const documentsData = await fetchDocuments();
      setDocuments(documentsData);
    };

    loadData();
  }, []);

  // Gérer les changements de formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rooms" || name === "area" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    try {
      // Validation des champs requis
      if (!formData.title || !formData.address || !formData.city || !formData.postal_code || !formData.property_type || formData.rooms <= 0 || formData.area <= 0 || formData.price <= 0) {
        toast({
          title: "Formulaire incomplet",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }

      setIsAddingProperty(true);
      const propertyWithImages = {
        ...formData,
        images: images
      };
      
      await createProperty(propertyWithImages);
      
      // Réinitialiser le formulaire et fermer le dialog
      setFormData({
        title: "",
        address: "",
        city: "",
        postal_code: "",
        property_type: "",
        rooms: 1,
        area: 0,
        price: 0,
        description: ""
      });
      setImages([]);
      
      // Recharger les propriétés
      const updatedProperties = await fetchProperties();
      setProperties(updatedProperties);
      
      document.querySelector<HTMLButtonElement>("[data-dismiss-dialog]")?.click();
    } catch (error) {
      console.error("Erreur lors de l'ajout du bien:", error);
    } finally {
      setIsAddingProperty(false);
    }
  };

  // Handle downloading a document
  const handleDownloadDocument = async (doc: any) => {
    await downloadDocument(doc.file_path, doc.name);
  };

  // Gérer la navigation vers la page de détail du bien
  const handleViewProperty = (propertyId: string) => {
    navigate(`/owner/property/${propertyId}`);
  };
  
  // Gérer la navigation vers la page de détail du locataire
  const handleViewTenant = (tenantId: string) => {
    navigate(`/owner/tenant/${tenantId}`);
  };
  
  // Count statistics
  const totalProperties = properties.length;
  const rentedProperties = properties.filter(p => !p.is_available).length;
  const availableProperties = properties.filter(p => p.is_available).length;
  const totalRent = properties.filter(p => !p.is_available).reduce((sum, p) => sum + p.price, 0);

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
                {totalProperties > 0 ? ((rentedProperties / totalProperties) * 100).toFixed(0) : 0}% de taux d'occupation
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
                        <Label htmlFor="property_type">Type de bien</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("property_type", value)} 
                          value={formData.property_type}
                        >
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
                        <Input 
                          id="rooms" 
                          name="rooms" 
                          type="number" 
                          min="1" 
                          value={formData.rooms} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Titre de l'annonce</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input 
                          id="postal_code" 
                          name="postal_code" 
                          value={formData.postal_code} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="area">Surface (m²)</Label>
                        <Input 
                          id="area" 
                          name="area" 
                          type="number" 
                          min="1" 
                          value={formData.area} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price">Loyer (€)</Label>
                        <Input 
                          id="price" 
                          name="price" 
                          type="number" 
                          min="1" 
                          value={formData.price} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="images">Photos</Label>
                      <Input 
                        id="images" 
                        type="file" 
                        multiple 
                        onChange={handleImageChange} 
                      />
                      <p className="text-xs text-muted-foreground">Vous pouvez sélectionner plusieurs photos à la fois</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      className="hidden"
                      data-dismiss-dialog
                    ></button>
                    <Button onClick={handleSubmit} disabled={isAddingProperty}>
                      {isAddingProperty ? "Ajout en cours..." : "Ajouter le bien"}
                    </Button>
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
                  {properties.length > 0 ? (
                    properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={property.images && property.images.length > 0 
                              ? property.images[0] 
                              : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&h=300"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          <div 
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                              !property.is_available 
                                ? "bg-green-100 text-green-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {!property.is_available ? "Loué" : "Disponible"}
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="text-lg font-bold">{property.title}</h3>
                          <p className="text-muted-foreground text-sm">{property.address}</p>
                          <p className="text-muted-foreground text-sm">{property.city} {property.postal_code}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">Loyer:</span>
                            <span className="text-sm font-medium">{property.price} €/mois</span>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleViewProperty(property.id)}>
                              Gérer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-muted-foreground">Vous n'avez pas encore ajouté de biens immobiliers.</p>
                      <Button className="mt-4" onClick={() => document.querySelector<HTMLButtonElement>("[aria-haspopup='dialog']")?.click()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un bien
                      </Button>
                    </div>
                  )}
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
                      {tenants.length > 0 ? (
                        tenants.map((tenant) => (
                          <tr key={tenant.id}>
                            <td className="px-4 py-3 text-sm">
                              {tenant.first_name} {tenant.last_name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {/* À remplacer par les données réelles */}
                              Propriété à associer
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span 
                                className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                Non défini
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              Non défini
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div>{tenant.phone || "Non renseigné"}</div>
                              <div>{tenant.email}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button variant="outline" size="sm" onClick={() => handleViewTenant(tenant.id)}>
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            Aucun locataire trouvé
                          </td>
                        </tr>
                      )}
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-3 text-sm">{doc.name}</td>
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
                            <td className="px-4 py-3 text-sm">
                              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                Télécharger
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            Aucun document trouvé
                          </td>
                        </tr>
                      )}
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
