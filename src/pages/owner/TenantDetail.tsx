
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!id) return;

    const fetchTenantDetails = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations du profil du locataire
        const { data: tenantData, error: tenantError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .eq("type", "tenant")
          .single();
          
        if (tenantError) throw tenantError;
        
        setTenant(tenantData);
        
        // Récupérer le dossier de candidature
        const { data: applicationData, error: applicationError } = await supabase
          .from("tenant_applications")
          .select("*")
          .eq("tenant_id", id)
          .order("created_at", { ascending: false })
          .maybeSingle();
        
        if (!applicationError) {
          setApplication(applicationData);
        }
        
        // Récupérer les documents
        const { data: documentsData, error: documentsError } = await supabase
          .from("documents")
          .select("*")
          .eq("owner_id", id)
          .order("created_at", { ascending: false });
          
        if (!documentsError) {
          setDocuments(documentsData || []);
        }
        
      } catch (error: any) {
        console.error("Erreur lors du chargement des détails du locataire:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du locataire",
          variant: "destructive"
        });
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenantDetails();
  }, [id, navigate]);
  
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
  
  if (!tenant) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de trouver ce locataire</AlertDescription>
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
          <h1 className="text-3xl font-bold">
            {tenant.first_name} {tenant.last_name || ""}
          </h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{tenant.email}</span>
                        </div>
                        {tenant.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{tenant.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {application && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Dossier de candidature</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Date de naissance</p>
                              <p>{application.birthdate ? new Date(application.birthdate).toLocaleDateString('fr-FR') : "Non renseigné"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Nationalité</p>
                              <p>{application.nationality || "Non renseigné"}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Adresse actuelle</p>
                            <p>{application.current_address || "Non renseignée"}</p>
                            {application.postal_code && application.city && (
                              <p>{application.postal_code} {application.city}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Situation professionnelle</p>
                              <p>{application.employment_status || "Non renseignée"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Entreprise</p>
                              <p>{application.company || "Non renseignée"}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Revenu mensuel</p>
                              <p>{application.monthly_income ? `${application.monthly_income} €` : "Non renseigné"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Autres revenus</p>
                              <p>{application.other_income ? `${application.other_income} €` : "Non renseigné"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Loyer actuel</p>
                              <p>{application.current_rent ? `${application.current_rent} €` : "Non renseigné"}</p>
                            </div>
                          </div>
                          
                          {application.guarantor_type && (
                            <>
                              <h3 className="text-sm font-medium mt-4 mb-2">Garant</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Type de garant</p>
                                  <p>{application.guarantor_type}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Relation</p>
                                  <p>{application.guarantor_relation || "Non renseignée"}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs text-muted-foreground">Nom complet</p>
                                <p>
                                  {application.guarantor_firstname} {application.guarantor_lastname}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-muted-foreground">Adresse</p>
                                <p>{application.guarantor_address || "Non renseignée"}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-muted-foreground">Revenu</p>
                                <p>{application.guarantor_income ? `${application.guarantor_income} €` : "Non renseigné"}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
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
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Vérifié</th>
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
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${doc.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                {doc.verified ? "Vérifié" : "En attente"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => downloadDocument(doc)}
                              >
                                <Download className="h-4 w-4 mr-2" />
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
                    <p className="text-muted-foreground">Aucun document n'a été fourni par ce locataire</p>
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

export default TenantDetail;
