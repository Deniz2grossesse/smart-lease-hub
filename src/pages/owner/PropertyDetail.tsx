import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<File[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!id) return;

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de la propriété
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        setProperty(data);
        setFormData({
          title: data.title,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          property_type: data.property_type,
          rooms: data.rooms,
          area: data.area,
          price: data.price,
          description: data.description || '',
          is_available: data.is_available
        });
        
        // Récupérer les locataires associés à cette propriété (à implémenter)
        // Pour l'instant, utilisons des données fictives
        setTenants([]);
        
        // Récupérer les documents associés à cette propriété
        const { data: docsData, error: docsError } = await supabase
          .from("documents")
          .select("*")
          .filter("file_path", "ilike", `%${id}%`);
          
        if (docsError) throw docsError;
        
        setDocuments(docsData || []);
        
      } catch (error: any) {
        console.error("Erreur lors du chargement des détails de la propriété:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la propriété",
          variant: "destructive"
        });
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "rooms" || name === "area" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev: any) => ({
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
  
  const handleSave = async () => {
    try {
      if (!id) return;
      
      // Validation des champs obligatoires
      if (!formData.title || !formData.address || !formData.city || !formData.postal_code || !formData.property_type || formData.rooms <= 0 || formData.area <= 0 || formData.price <= 0) {
        toast({
          title: "Formulaire incomplet",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }
      
      // Mise à jour des informations de la propriété
      const { error } = await supabase
        .from("properties")
        .update({
          title: formData.title,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          property_type: formData.property_type,
          rooms: formData.rooms,
          area: formData.area,
          price: formData.price,
          description: formData.description,
          is_available: formData.is_available
        })
        .eq("id", id);
        
      if (error) throw error;
      
      // Upload des nouvelles images si présentes
      if (images.length > 0) {
        const currentImages = property.images || [];
        const newImageUrls: string[] = [];
        
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const fileExt = image.name.split('.').pop();
          const filePath = `${id}/${i}-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property_images')
            .upload(filePath, image);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
            
          newImageUrls.push(publicUrl);
        }
        
        // Mettre à jour le tableau d'images dans la propriété
        const updatedImages = [...currentImages, ...newImageUrls];
        
        // Utilisation d'une requête séparée pour mettre à jour les images
        const { error: updateImagesError } = await supabase
          .from("properties")
          .update({ images: updatedImages })
          .eq("id", id);
          
        if (updateImagesError) throw updateImagesError;
        
        // Mettre à jour l'objet propriété localement
        const updatedProperty = {
          ...property,
          ...formData
        };
        updatedProperty.images = updatedImages;
        setProperty(updatedProperty);
      } else {
        // Mettre à jour l'objet propriété dans le state sans modifier les images
        setProperty({
          ...property,
          ...formData
        });
      }
      
      setEditing(false);
      setImages([]);
      
      toast({
        title: "Succès",
        description: "La propriété a été mise à jour avec succès"
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la propriété:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!id) return;
      
      // Supprimer la propriété
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "La propriété a été supprimée avec succès"
      });
      
      navigate('/owner/dashboard');
      
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la propriété:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const downloadDocument = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('tenant_documents')
        .download(doc.file_path);
        
      if (error) throw error;
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger ce document",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de trouver cette propriété</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/owner/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/owner/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          {!editing && (
            <div className="ml-auto space-x-2">
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer cette propriété ?</DialogTitle>
                    <DialogDescription>
                      Cette action est irréversible. La propriété sera définitivement supprimée de votre portefeuille.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => document.querySelector<HTMLButtonElement>("[data-dismiss-delete-dialog]")?.click()}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Supprimer définitivement
                    </Button>
                    <button
                      type="button"
                      className="hidden"
                      data-dismiss-delete-dialog
                    ></button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations sur le bien</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          value={formData.title} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="property_type">Type de bien</Label>
                        <Select 
                          value={formData.property_type} 
                          onValueChange={(value) => handleSelectChange("property_type", value)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Label>Disponibilité</Label>
                      <Select 
                        value={formData.is_available.toString()} 
                        onValueChange={(value) => handleSelectChange("is_available", value === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Disponible</SelectItem>
                          <SelectItem value="false">Loué</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="images">Ajouter des photos</Label>
                      <Input 
                        id="images" 
                        type="file" 
                        multiple 
                        onChange={handleImageChange} 
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleSave}>
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Type de bien</h3>
                            <p className="mt-1">{property.property_type === "apartment" ? "Appartement" : 
                                               property.property_type === "house" ? "Maison" : 
                                               property.property_type === "studio" ? "Studio" : 
                                               property.property_type === "loft" ? "Loft" : 
                                               property.property_type}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Disponibilité</h3>
                            <p className="mt-1">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                property.is_available ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }`}>
                                {property.is_available ? "Disponible" : "Loué"}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                          <p className="mt-1">{property.address}</p>
                          <p>{property.city} {property.postal_code}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Pièces</h3>
                            <p className="mt-1">{property.rooms}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Surface</h3>
                            <p className="mt-1">{property.area} m²</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Loyer</h3>
                            <p className="mt-1">{property.price} €/mois</p>
                          </div>
                        </div>
                        
                        {property.description && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <p className="mt-1 whitespace-pre-wrap">{property.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {property.images && property.images.length > 0 ? (
                            property.images.map((image: string, index: number) => (
                              <div key={index} className="aspect-square relative overflow-hidden rounded-md">
                                <img 
                                  src={image} 
                                  alt={`Photo ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 p-8 border rounded-md flex flex-col items-center justify-center text-center">
                              <p className="text-muted-foreground">Aucune photo disponible</p>
                              <Button variant="outline" className="mt-2" onClick={() => setEditing(true)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Ajouter des photos
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tenants">
            <Card>
              <CardHeader>
                <CardTitle>Locataires</CardTitle>
              </CardHeader>
              <CardContent>
                {tenants.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Téléphone</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date d'entrée</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tenants.map((tenant) => (
                          <tr key={tenant.id}>
                            <td className="px-4 py-3 text-sm">
                              {tenant.first_name} {tenant.last_name}
                            </td>
                            <td className="px-4 py-3 text-sm">{tenant.email}</td>
                            <td className="px-4 py-3 text-sm">{tenant.phone || "Non renseigné"}</td>
                            <td className="px-4 py-3 text-sm">Non défini</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button variant="outline" size="sm" onClick={() => navigate(`/owner/tenant/${tenant.id}`)}>
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucun locataire n'est actuellement associé à ce bien</p>
                    {!property.is_available && (
                      <p className="text-sm text-muted-foreground mt-2">Ce bien est marqué comme loué, mais aucun locataire n'y est associé.</p>
                    )}
                    <Button className="mt-4">
                      Associer un locataire
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Documents</CardTitle>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-3 text-sm">{doc.name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => downloadDocument(doc)}
                              >
                                Télécharger
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucun document n'est associé à ce bien</p>
                    <Button className="mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
