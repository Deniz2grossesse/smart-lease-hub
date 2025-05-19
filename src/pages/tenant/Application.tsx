
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Upload, AlertTriangle } from "lucide-react";

const TenantApplication = () => {
  const [activeTab, setActiveTab] = useState("identity");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [fileUploaded, setFileUploaded] = useState({
    identity: false,
    residence: false,
    income: false,
    employment: false,
    tax: false,
  });

  const handleUpload = (document: keyof typeof fileUploaded) => {
    setFileUploaded(prev => ({
      ...prev,
      [document]: true
    }));
  };

  const calculateScore = () => {
    // Professional status score (40 points max)
    let professionalScore = 0;
    switch (employmentStatus) {
      case "cdi":
        professionalScore = 40;
        break;
      case "cdi_trial":
        professionalScore = 30;
        break;
      case "cdd_long":
        professionalScore = 25;
        break;
      case "cdd_short":
        professionalScore = 15;
        break;
      case "freelance_long":
        professionalScore = 25;
        break;
      case "freelance_short":
        professionalScore = 15;
        break;
      case "student_guarantor":
        professionalScore = 20;
        break;
      case "student_no_guarantor":
        professionalScore = 5;
        break;
      case "unemployed_guarantor":
        professionalScore = 10;
        break;
      case "unemployed_no_guarantor":
        professionalScore = 0;
        break;
    }

    // Income score based on rent ratio (30 points max)
    // For demo purposes, we'll assume income is 3x rent
    const incomeScore = 30;

    // Guarantor score (20 points max)
    const guarantorScore = employmentStatus.includes("guarantor") ? 15 : 0;

    // Rental history (10 points max)
    const rentalHistoryScore = 10;

    return {
      professional: professionalScore,
      income: incomeScore,
      guarantor: guarantorScore,
      rentalHistory: rentalHistoryScore,
      total: professionalScore + incomeScore + guarantorScore + rentalHistoryScore
    };
  };

  const score = calculateScore();
  const completionPercentage = Object.values(fileUploaded).filter(Boolean).length / Object.values(fileUploaded).length * 100;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Mon dossier locatif</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Progression du dossier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-brand-red h-2.5 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Score locataire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{score.total}/100</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${score.total}%` }}
                ></div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-xs mt-1">Voir le détail du score</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Détail du score locataire</DialogTitle>
                    <DialogDescription>
                      Votre score total est de {score.total}/100 points.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span>Statut professionnel</span>
                        <span>{score.professional}/40 pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-brand-red h-2 rounded-full" 
                          style={{ width: `${(score.professional / 40) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Revenus</span>
                        <span>{score.income}/30 pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-brand-red h-2 rounded-full" 
                          style={{ width: `${(score.income / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Garantie</span>
                        <span>{score.guarantor}/20 pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-brand-red h-2 rounded-full" 
                          style={{ width: `${(score.guarantor / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Historique locatif</span>
                        <span>{score.rentalHistory}/10 pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-brand-red h-2 rounded-full" 
                          style={{ width: `${(score.rentalHistory / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                État du dossier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold flex items-center">
                {completionPercentage === 100 ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-green-700">Dossier complet</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-700">Dossier incomplet</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Complétez votre dossier locatif en renseignant les informations ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="identity">Identité</TabsTrigger>
                <TabsTrigger value="professional">Situation professionnelle</TabsTrigger>
                <TabsTrigger value="financial">Situation financière</TabsTrigger>
                <TabsTrigger value="guarantor">Garantie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="identity" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">Prénom</Label>
                    <Input id="firstname" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Nom</Label>
                    <Input id="lastname" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date de naissance</Label>
                    <Input id="birthdate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Input id="nationality" placeholder="Votre nationalité" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse actuelle</Label>
                  <Input id="address" placeholder="Votre adresse" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="postal">Code postal</Label>
                    <Input id="postal" placeholder="Code postal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" placeholder="Ville" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" placeholder="Pays" defaultValue="France" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Documents à fournir</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">Pièce d'identité</p>
                        <p className="text-xs text-muted-foreground">Carte d'identité, passeport</p>
                      </div>
                      {fileUploaded.identity ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUpload("identity")}>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">Justificatif de domicile</p>
                        <p className="text-xs text-muted-foreground">Moins de 3 mois</p>
                      </div>
                      {fileUploaded.residence ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUpload("residence")}>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="employment-status">Situation professionnelle</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cdi">CDI (hors période d'essai)</SelectItem>
                      <SelectItem value="cdi_trial">CDI (en période d'essai)</SelectItem>
                      <SelectItem value="cdd_long">CDD (plus de 12 mois restants)</SelectItem>
                      <SelectItem value="cdd_short">CDD (moins de 12 mois restants)</SelectItem>
                      <SelectItem value="freelance_long">Indépendant/Freelance (plus de 3 ans d'activité)</SelectItem>
                      <SelectItem value="freelance_short">Indépendant/Freelance (moins de 3 ans d'activité)</SelectItem>
                      <SelectItem value="student_guarantor">Étudiant (avec garant)</SelectItem>
                      <SelectItem value="student_no_guarantor">Étudiant (sans garant)</SelectItem>
                      <SelectItem value="unemployed_guarantor">Sans emploi (avec garant)</SelectItem>
                      <SelectItem value="unemployed_no_guarantor">Sans emploi (sans garant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" placeholder="Nom de l'entreprise" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste occupé</Label>
                    <Input id="position" placeholder="Votre poste" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-start">Date de début de contrat</Label>
                    <Input id="contract-start" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-end">Date de fin de contrat (si applicable)</Label>
                    <Input id="contract-end" type="date" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Documents à fournir</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">Justificatif de situation professionnelle</p>
                        <p className="text-xs text-muted-foreground">Contrat de travail, attestation employeur</p>
                      </div>
                      {fileUploaded.employment ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUpload("employment")}>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="income">Revenus mensuels nets (€)</Label>
                    <Input id="income" type="number" placeholder="Montant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other-income">Autres revenus mensuels (€)</Label>
                    <Input id="other-income" type="number" placeholder="Montant" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-rent">Loyer actuel (€)</Label>
                  <Input id="current-rent" type="number" placeholder="Montant" />
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Documents à fournir</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">Justificatifs de revenus</p>
                        <p className="text-xs text-muted-foreground">3 derniers bulletins de salaire</p>
                      </div>
                      {fileUploaded.income ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUpload("income")}>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">Avis d'imposition</p>
                        <p className="text-xs text-muted-foreground">Dernier avis</p>
                      </div>
                      {fileUploaded.tax ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUpload("tax")}>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="guarantor" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="guarantor-type">Type de garantie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de garantie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Personne physique (garant)</SelectItem>
                      <SelectItem value="visale">Garantie Visale</SelectItem>
                      <SelectItem value="gli">Garantie Loyers Impayés (GLI)</SelectItem>
                      <SelectItem value="action-logement">Action Logement</SelectItem>
                      <SelectItem value="none">Pas de garantie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <h3 className="font-medium">Informations sur le garant</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guarantor-firstname">Prénom</Label>
                    <Input id="guarantor-firstname" placeholder="Prénom du garant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guarantor-lastname">Nom</Label>
                    <Input id="guarantor-lastname" placeholder="Nom du garant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guarantor-relation">Lien de parenté</Label>
                    <Input id="guarantor-relation" placeholder="Ex: Parent, Ami, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guarantor-income">Revenus mensuels nets (€)</Label>
                    <Input id="guarantor-income" type="number" placeholder="Montant" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guarantor-address">Adresse du garant</Label>
                  <Input id="guarantor-address" placeholder="Adresse complète" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Enregistrer le brouillon
            </Button>
            <Button>
              Valider et soumettre le dossier
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default TenantApplication;
