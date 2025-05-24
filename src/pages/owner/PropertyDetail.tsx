import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyDetailsTab from "@/components/property/PropertyDetailsTab";
import PropertyTenantsTab from "@/components/property/PropertyTenantsTab";
import PropertyDocumentsTab from "@/components/property/PropertyDocumentsTab";
import PropertyEditForm from "@/components/property/PropertyEditForm";

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
        
        const { data, error } = await supabase
          .from("properties")
          .select(`
            *,
            property_images (*)
          `)
          .eq("id", id)
          .eq("owner_id", user?.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            throw new Error("Propriété non trouvée ou vous n'avez pas les droits d'accès");
          }
          throw error;
        }
        
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
        
        setTenants([]);
        
        const { data: docsData, error: docsError } = await supabase
          .from("documents")
          .select("*")
          .filter("file_path", "ilike", `%${id}%`);
          
        if (docsError) throw docsError;
        
        setDocuments(docsData || []);
        
      } catch (error: any) {
        console.error("Erreur lors du chargement des détails de la propriété:", error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger les détails de la propriété",
          variant: "destructive"
        });
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id, navigate, user?.id]);
  
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
      
      if (!formData.title || !formData.address || !formData.city || !formData.postal_code || !formData.property_type || formData.rooms <= 0 || formData.area <= 0 || formData.price <= 0) {
        toast({
          title: "Formulaire incomplet",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }
      
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
        .eq("id", id)
        .eq("owner_id", user?.id);
        
      if (error) throw error;
      
      if (images.length > 0) {
        const newImageUrls: string[] = [];
        
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const fileExt = image.name.split('.').pop();
          const filePath = `${id}/${i}-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, image);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
            
          newImageUrls.push(publicUrl);
        }
        
        const imageEntries = newImageUrls.map((url, index) => ({
          property_id: id,
          url: url,
          is_primary: index === 0 && (!property.property_images || property.property_images.length === 0)
        }));
        
        const { error: insertImagesError } = await supabase
          .from('property_images')
          .insert(imageEntries);
          
        if (insertImagesError) throw insertImagesError;
        
        toast({
          title: "Images ajoutées avec succès",
          description: `${images.length} image(s) ont été ajoutée(s) à votre propriété`,
        });
      }
      
      const { data: updatedPropertyData, error: fetchError } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (*)
        `)
        .eq("id", id)
        .single();
        
      if (fetchError) throw fetchError;
      
      setProperty(updatedPropertyData);
      setFormData({
        title: updatedPropertyData.title,
        address: updatedPropertyData.address,
        city: updatedPropertyData.city,
        postal_code: updatedPropertyData.postal_code,
        property_type: updatedPropertyData.property_type,
        rooms: updatedPropertyData.rooms,
        area: updatedPropertyData.area,
        price: updatedPropertyData.price,
        description: updatedPropertyData.description || '',
        is_available: updatedPropertyData.is_available
      });
      
      setEditing(false);
      setImages([]);
      
      toast({
        title: "Propriété mise à jour avec succès",
        description: "Les informations de votre propriété ont été sauvegardées"
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la propriété:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!id) return;
      
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id)
        .eq("owner_id", user?.id);
        
      if (error) throw error;
      
      toast({
        title: "Propriété supprimée avec succès",
        description: "La propriété a été définitivement supprimée de votre portefeuille"
      });
      
      navigate('/owner/dashboard');
      
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la propriété:", error);
      toast({
        title: "Erreur de suppression",
        description: error.message || "Impossible de supprimer cette propriété",
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
      
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Document téléchargé",
        description: `Le document "${doc.name}" a été téléchargé avec succès`
      });
      
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger ce document",
        variant: "destructive"
      });
    }
  };
  
  const handleImageDeleted = (deletedImageId: string) => {
    if (property && property.property_images) {
      const updatedImages = property.property_images.filter((img: any) => img.id !== deletedImageId);
      setProperty({
        ...property,
        property_images: updatedImages
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <p>Chargement des détails de la propriété...</p>
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
            <AlertTitle>Propriété introuvable</AlertTitle>
            <AlertDescription>Cette propriété n'existe pas ou vous n'avez pas les droits d'accès</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/owner/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <PropertyHeader 
          property={property}
          editing={editing}
          onBackClick={() => navigate('/owner/dashboard')}
          onEditClick={() => setEditing(true)}
          onDeleteClick={handleDelete}
        />
        
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
                  <PropertyEditForm 
                    formData={formData}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                    onImageChange={handleImageChange}
                    onSave={handleSave}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <PropertyDetailsTab 
                    property={property}
                    editing={editing}
                    onEditClick={() => setEditing(true)}
                    onImageDeleted={handleImageDeleted}
                  />
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
                <PropertyTenantsTab 
                  tenants={tenants}
                  property={property}
                />
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
                <PropertyDocumentsTab 
                  documents={documents}
                  onDownloadDocument={downloadDocument}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
