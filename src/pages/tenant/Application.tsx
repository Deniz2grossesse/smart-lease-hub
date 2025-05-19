
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { createOrUpdateApplication, fetchApplication, ApplicationFormData } from "@/lib/services/tenantService";
import { uploadDocument, fetchDocuments } from "@/lib/services/documentService";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, ArrowRight, Check, Upload } from "lucide-react";

const requiredDocuments = [
  { id: "identity", name: "Pièce d'identité", type: "identity" },
  { id: "proof_of_income", name: "Justificatif de revenus", type: "income" },
  { id: "proof_of_address", name: "Justificatif de domicile", type: "address" },
  { id: "tax_notice", name: "Avis d'imposition", type: "tax" },
];

const TenantApplication = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [formData, setFormData] = useState<ApplicationFormData>({
    first_name: "",
    last_name: "",
    birthdate: "",
    nationality: "",
    current_address: "",
    postal_code: "",
    city: "",
    country: "France",
    employment_status: "",
    company: "",
    position: "",
    contract_start: "",
    contract_end: "",
    monthly_income: 0,
    other_income: 0,
    current_rent: 0,
    guarantor_type: "",
    guarantor_firstname: "",
    guarantor_lastname: "",
    guarantor_relation: "",
    guarantor_address: "",
    guarantor_income: 0,
  });
  
  useEffect(() => {
    const loadApplication = async () => {
      setLoading(true);
      try {
        const applicationData = await fetchApplication();
        if (applicationData) {
          setApplication(applicationData);
          // Mettre à jour le formulaire avec les données existantes
          setFormData({
            first_name: applicationData.first_name || "",
            last_name: applicationData.last_name || "",
            birthdate: applicationData.birthdate || "",
            nationality: applicationData.nationality || "",
            current_address: applicationData.current_address || "",
            postal_code: applicationData.postal_code || "",
            city: applicationData.city || "",
            country: applicationData.country || "France",
            employment_status: applicationData.employment_status || "",
            company: applicationData.company || "",
            position: applicationData.position || "",
            contract_start: applicationData.contract_start || "",
            contract_end: applicationData.contract_end || "",
            monthly_income: applicationData.monthly_income || 0,
            other_income: applicationData.other_income || 0,
            current_rent: applicationData.current_rent || 0,
            guarantor_type: applicationData.guarantor_type || "",
            guarantor_firstname: applicationData.guarantor_firstname || "",
            guarantor_lastname: applicationData.guarantor_lastname || "",
            guarantor_relation: applicationData.guarantor_relation || "",
            guarantor_address: applicationData.guarantor_address || "",
            guarantor_income: applicationData.guarantor_income || 0,
          });
        } else if (profile) {
          // Si pas d'application mais un profil, pré-remplir les champs de base
          setFormData(prev => ({
            ...prev,
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
          }));
        }
        
        // Charger les documents
        if (applicationData) {
          const docsData = await fetchDocuments(applicationData.id);
          setDocuments(docsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du dossier:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadApplication();
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDocumentChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedDocuments(prev => ({
        ...prev,
        [id]: e.target.files![0],
      }));
    }
  };
  
  const handleSaveDraft = async () => {
    if (!validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs marqués d'un astérisque",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const savedApplication = await createOrUpdateApplication(formData, application?.id);
      setApplication(savedApplication);
      
      // Upload des documents
      await uploadDocuments(savedApplication.id);
      
      // Recharger les documents
      const docsData = await fetchDocuments(savedApplication.id);
      setDocuments(docsData);
      
      toast({
        title: "Brouillon enregistré",
        description: "Votre dossier a été sauvegardé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du brouillon:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmitApplication = async () => {
    if (!validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs marqués d'un astérisque",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateDocuments()) {
      toast({
        title: "Documents manquants",
        description: "Veuillez télécharger tous les documents requis",
        variant: "destructive"
      });
      setActiveTab("documents");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const submittedApplication = await createOrUpdateApplication(formData, application?.id, "submitted");
      setApplication(submittedApplication);
      
      // Upload des documents restants
      await uploadDocuments(submittedApplication.id);
      
      toast({
        title: "Dossier soumis avec succès",
        description: "Votre dossier a été transmis et sera examiné par nos équipes"
      });
      
      navigate("/tenant/dashboard");
    } catch (error) {
      console.error("Erreur lors de la soumission du dossier:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const uploadDocuments = async (applicationId: string) => {
    const documentPromises = Object.entries(uploadedDocuments).map(([id, file]) => {
      const docType = requiredDocuments.find(doc => doc.id === id)?.type || "other";
      const docName = requiredDocuments.find(doc => doc.id === id)?.name || file.name;
      
      return uploadDocument({
        name: docName,
        type: docType,
        file,
        application_id: applicationId,
      });
    });
    
    if (documentPromises.length > 0) {
      await Promise.all(documentPromises);
      setUploadedDocuments({});
    }
  };
  
  const validateRequiredFields = () => {
    // Vérifier les champs obligatoires pour chaque onglet
    if (!formData.first_name || !formData.last_name) {
      setActiveTab("personal");
      return false;
    }
    
    if (!formData.employment_status) {
      setActiveTab("financial");
      return false;
    }
    
    return true;
  };
  
  const validateDocuments = () => {
    // Vérifier si tous les documents obligatoires sont présents
    const requiredDocIds = requiredDocuments.map(doc => doc.id);
    const existingDocTypes = documents.map(doc => doc.type);
    
    for (const id of requiredDocIds) {
      const docType = requiredDocuments.find(doc => doc.id === id)?.type;
      if (!existingDocTypes.includes(docType) && !uploadedDocuments[id]) {
        return false;
      }
    }
    
    return true;
  };
  
  const isDocumentUploaded = (id: string) => {
    const docType = requiredDocuments.find(doc => doc.id === id)?.type;
    return documents.some(doc => doc.type === docType) || !!uploadedDocuments[id];
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <p>Chargement de votre dossier...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const isSubmitted = application?.status === "submitted";
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Mon dossier de location</h1>
        
        {isSubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Dossier soumis</CardTitle>
              <CardDescription className="text-center">
                Votre dossier a été transmis avec succès et est en cours d'examen
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-center max-w-md">
                  Nous étudions actuellement votre dossier. Vous serez notifié lorsqu'une décision aura été prise ou si des informations supplémentaires sont nécessaires.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/tenant/dashboard")}>
                Retour au tableau de bord
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
                <TabsTrigger value="financial">Situation financière</TabsTrigger>
                <TabsTrigger value="documents">Documents justificatifs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Renseignez vos informations de base pour constituer votre dossier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">Prénom <span className="text-red-500">*</span></Label>
                        <Input 
                          id="first_name" 
                          name="first_name" 
                          value={formData.first_name} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Nom <span className="text-red-500">*</span></Label>
                        <Input 
                          id="last_name" 
                          name="last_name" 
                          value={formData.last_name} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthdate">Date de naissance</Label>
                        <Input 
                          id="birthdate" 
                          name="birthdate" 
                          type="date" 
                          value={formData.birthdate} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationalité</Label>
                        <Input 
                          id="nationality" 
                          name="nationality" 
                          value={formData.nationality} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current_address">Adresse actuelle</Label>
                      <Input 
                        id="current_address" 
                        name="current_address" 
                        value={formData.current_address} 
                        onChange={handleChange} 
                        disabled={isSubmitted}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input 
                          id="postal_code" 
                          name="postal_code" 
                          value={formData.postal_code} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          value={formData.country} 
                          onChange={handleChange} 
                          disabled={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitted}>
                      {isSaving ? "Enregistrement..." : "Enregistrer le brouillon"}
                    </Button>
                    <Button onClick={() => setActiveTab("financial")} disabled={isSubmitted}>
                      Étape suivante <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Situation financière</CardTitle>
                    <CardDescription>
                      Les informations financières sont essentielles pour évaluer votre dossier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Situation professionnelle</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="employment_status">Statut professionnel <span className="text-red-500">*</span></Label>
                          <Select 
                            value={formData.employment_status} 
                            onValueChange={(value) => handleSelectChange("employment_status", value)}
                            disabled={isSubmitted}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cdi">CDI</SelectItem>
                              <SelectItem value="cdd">CDD</SelectItem>
                              <SelectItem value="freelance">Indépendant / Freelance</SelectItem>
                              <SelectItem value="student">Étudiant</SelectItem>
                              <SelectItem value="retired">Retraité</SelectItem>
                              <SelectItem value="unemployed">Sans emploi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {formData.employment_status && formData.employment_status !== "unemployed" && formData.employment_status !== "retired" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="company">Entreprise</Label>
                                <Input 
                                  id="company" 
                                  name="company" 
                                  value={formData.company} 
                                  onChange={handleChange} 
                                  disabled={isSubmitted}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="position">Poste</Label>
                                <Input 
                                  id="position" 
                                  name="position" 
                                  value={formData.position} 
                                  onChange={handleChange} 
                                  disabled={isSubmitted}
                                />
                              </div>
                            </div>
                            
                            {(formData.employment_status === "cdi" || formData.employment_status === "cdd") && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="contract_start">Début du contrat</Label>
                                  <Input 
                                    id="contract_start" 
                                    name="contract_start" 
                                    type="date" 
                                    value={formData.contract_start} 
                                    onChange={handleChange} 
                                    disabled={isSubmitted}
                                  />
                                </div>
                                {formData.employment_status === "cdd" && (
                                  <div className="space-y-2">
                                    <Label htmlFor="contract_end">Fin du contrat</Label>
                                    <Input 
                                      id="contract_end" 
                                      name="contract_end" 
                                      type="date" 
                                      value={formData.contract_end} 
                                      onChange={handleChange} 
                                      disabled={isSubmitted}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Revenus et dépenses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="monthly_income">Revenu mensuel net (€)</Label>
                          <Input 
                            id="monthly_income" 
                            name="monthly_income" 
                            type="number" 
                            value={formData.monthly_income || ""} 
                            onChange={handleChange} 
                            disabled={isSubmitted}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="other_income">Autres revenus (€)</Label>
                          <Input 
                            id="other_income" 
                            name="other_income" 
                            type="number" 
                            value={formData.other_income || ""} 
                            onChange={handleChange} 
                            disabled={isSubmitted}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current_rent">Loyer actuel (€)</Label>
                          <Input 
                            id="current_rent" 
                            name="current_rent" 
                            type="number" 
                            value={formData.current_rent || ""} 
                            onChange={handleChange} 
                            disabled={isSubmitted}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Garant</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="guarantor_type">Type de garant</Label>
                          <Select 
                            value={formData.guarantor_type} 
                            onValueChange={(value) => handleSelectChange("guarantor_type", value)}
                            disabled={isSubmitted}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type de garant" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="person">Personne physique</SelectItem>
                              <SelectItem value="company">Entreprise</SelectItem>
                              <SelectItem value="visale">Visale</SelectItem>
                              <SelectItem value="none">Pas de garant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {formData.guarantor_type && formData.guarantor_type !== "none" && (
                          <>
                            {formData.guarantor_type === "person" && (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="guarantor_firstname">Prénom du garant</Label>
                                    <Input 
                                      id="guarantor_firstname" 
                                      name="guarantor_firstname" 
                                      value={formData.guarantor_firstname} 
                                      onChange={handleChange} 
                                      disabled={isSubmitted}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="guarantor_lastname">Nom du garant</Label>
                                    <Input 
                                      id="guarantor_lastname" 
                                      name="guarantor_lastname" 
                                      value={formData.guarantor_lastname} 
                                      onChange={handleChange} 
                                      disabled={isSubmitted}
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="guarantor_relation">Lien avec le garant</Label>
                                  <Select 
                                    value={formData.guarantor_relation} 
                                    onValueChange={(value) => handleSelectChange("guarantor_relation", value)}
                                    disabled={isSubmitted}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner un lien" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="parent">Parent</SelectItem>
                                      <SelectItem value="family">Autre membre de la famille</SelectItem>
                                      <SelectItem value="friend">Ami(e)</SelectItem>
                                      <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="guarantor_address">Adresse du garant</Label>
                              <Input 
                                id="guarantor_address" 
                                name="guarantor_address" 
                                value={formData.guarantor_address} 
                                onChange={handleChange} 
                                disabled={isSubmitted}
                              />
                            </div>
                            
                            {formData.guarantor_type !== "visale" && (
                              <div className="space-y-2">
                                <Label htmlFor="guarantor_income">Revenu du garant (€)</Label>
                                <Input 
                                  id="guarantor_income" 
                                  name="guarantor_income" 
                                  type="number" 
                                  value={formData.guarantor_income || ""} 
                                  onChange={handleChange} 
                                  disabled={isSubmitted}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setActiveTab("personal")} disabled={isSubmitted}>
                        Retour
                      </Button>
                      <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitted}>
                        {isSaving ? "Enregistrement..." : "Enregistrer le brouillon"}
                      </Button>
                    </div>
                    <Button onClick={() => setActiveTab("documents")} disabled={isSubmitted}>
                      Étape suivante <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents justificatifs</CardTitle>
                    <CardDescription>
                      Téléchargez les documents nécessaires pour compléter votre dossier de location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-800">
                            Formats acceptés: PDF, JPG, PNG (max 5 MB par fichier)
                          </h5>
                          <p className="text-sm text-amber-700 mt-1">
                            Assurez-vous que vos documents sont lisibles et non expirés
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="flex flex-col space-y-2">
                          <Label htmlFor={doc.id}>
                            {doc.name} <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id={doc.id}
                              type="file"
                              onChange={(e) => handleDocumentChange(doc.id, e)}
                              disabled={isDocumentUploaded(doc.id) && !uploadedDocuments[doc.id]}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className={isDocumentUploaded(doc.id) ? "opacity-50" : ""}
                            />
                            {isDocumentUploaded(doc.id) && !uploadedDocuments[doc.id] && (
                              <div className="flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">Déjà téléchargé</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setActiveTab("financial")} disabled={isSubmitted}>
                        Retour
                      </Button>
                      <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitted}>
                        {isSaving ? "Enregistrement..." : "Enregistrer le brouillon"}
                      </Button>
                    </div>
                    <Button onClick={handleSubmitApplication} disabled={isSubmitting || isSubmitted}>
                      {isSubmitting ? "Soumission en cours..." : "Valider et soumettre le dossier"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TenantApplication;
