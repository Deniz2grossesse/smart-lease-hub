
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, User, Clock, FileText, LineChart, Search, Mail, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Dummy data
const applicants = [
  {
    id: 1,
    name: "Jean Dupont",
    property: "Studio Quartier Latin",
    score: 85,
    status: "complete",
    applied: "15/05/2025",
    income: "2500",
    professional: "CDI",
  },
  {
    id: 2,
    name: "Sophie Martin",
    property: "Appartement T3 Centre-ville",
    score: 92,
    status: "complete",
    applied: "12/05/2025",
    income: "3200",
    professional: "CDI",
  },
  {
    id: 3,
    name: "Lucas Petit",
    property: "Studio Quartier Latin",
    score: 45,
    status: "incomplete",
    applied: "16/05/2025",
    income: "1800",
    professional: "CDD",
  },
  {
    id: 4,
    name: "Emma Leroy",
    property: "Appartement T3 Centre-ville",
    score: 78,
    status: "complete",
    applied: "10/05/2025",
    income: "2800",
    professional: "Freelance",
  },
];

const properties = [
  {
    id: 1,
    title: "Appartement T3 Centre-ville",
    address: "15 Rue de la République, Lyon",
    status: "rented",
    applications: 3,
    rent: 850,
  },
  {
    id: 2,
    title: "Studio Quartier Latin",
    address: "8 Rue Mouffetard, Paris",
    status: "available",
    applications: 2,
    rent: 700,
  },
  {
    id: 3,
    title: "Maison avec jardin",
    address: "22 Avenue des Pins, Bordeaux",
    status: "rented",
    applications: 0,
    rent: 1200,
  },
  {
    id: 4,
    title: "Duplex moderne",
    address: "5 Rue des Arts, Toulouse",
    status: "available",
    applications: 1,
    rent: 950,
  },
];

const payments = [
  {
    id: 1,
    tenant: "Marie Dubois",
    property: "Appartement T3 Centre-ville",
    amount: 850,
    dueDate: "05/05/2025",
    status: "paid",
    paidDate: "03/05/2025",
  },
  {
    id: 2,
    tenant: "Thomas Martin",
    property: "Maison avec jardin",
    amount: 1200,
    dueDate: "05/05/2025",
    status: "late",
    paidDate: null,
  },
  {
    id: 3,
    tenant: "Julie Blanc",
    property: "Duplex moderne",
    amount: 950,
    dueDate: "05/06/2025",
    status: "upcoming",
    paidDate: null,
  },
];

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate statistics
  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.status === "available").length;
  const totalApplications = applicants.length;
  const pendingPayments = payments.filter(p => p.status === "late").length;
  
  const occupancyRate = ((totalProperties - availableProperties) / totalProperties) * 100;
  const applicationRate = totalApplications / availableProperties;
  const paymentRate = ((payments.length - pendingPayments) / payments.length) * 100;
  
  const totalRent = properties.reduce((sum, p) => sum + p.rent, 0);
  const collectedRent = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingRent = payments
    .filter(p => p.status === "late")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord agent</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Dernière mise à jour: 19/05/2025
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taux d'occupation
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</div>
              <Progress value={occupancyRate} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {totalProperties - availableProperties} sur {totalProperties} biens loués
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Applications par bien
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applicationRate.toFixed(1)}</div>
              <Progress value={applicationRate * 10} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {totalApplications} candidatures pour {availableProperties} biens disponibles
              </p>
            </CardContent>
          </Card>
          
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Paiements de loyer
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRate.toFixed(0)}%</div>
              <Progress value={paymentRate} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {pendingPayments} paiements en retard
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Montant des loyers
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRent} €</div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-green-600">{collectedRent} € perçus</span>
                <span className="text-red-600">{pendingRent} € en attente</span>
              </div>
            </CardContent>
          </Card> */}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestion de l'agence</CardTitle>
            <CardDescription>
              Consultez et gérez les candidatures, les biens et les paiements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-6">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="applications">Candidatures</TabsTrigger>
                <TabsTrigger value="properties">Biens</TabsTrigger>
                {/* <TabsTrigger value="payments">Paiements</TabsTrigger> */}
              </TabsList>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder={activeTab === "applications" ? "Rechercher des candidatures..." : 
                               activeTab === "properties" ? "Rechercher des biens..." : 
                               activeTab === "payments" ? "Rechercher des paiements..." : 
                               "Rechercher..."}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dernières candidatures</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applicants.slice(0, 3).map(applicant => (
                          <div key={applicant.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{applicant.name}</span>
                              <span className="text-sm text-muted-foreground">{applicant.property}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium bg-primary-foreground px-2 py-1 rounded">
                                {applicant.score} pts
                              </div>
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Voir toutes les candidatures
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Paiements en attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {payments.filter(p => p.status === "late").map(payment => (
                          <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{payment.tenant}</span>
                              <span className="text-sm text-muted-foreground">{payment.property}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{payment.amount} €</span>
                              <span className="text-xs text-red-600">Dû le {payment.dueDate}</span>
                            </div>
                          </div>
                        ))}
                        {payments.filter(p => p.status === "upcoming").slice(0, 2).map(payment => (
                          <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{payment.tenant}</span>
                              <span className="text-sm text-muted-foreground">{payment.property}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{payment.amount} €</span>
                              <span className="text-xs text-blue-600">À venir le {payment.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Voir tous les paiements
                      </Button>
                    </CardContent>
                  </Card> */}
                </div>
              </TabsContent>
              
              <TabsContent value="applications">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Candidat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Candidature</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {applicants.map(applicant => (
                        <tr key={applicant.id}>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <div className="font-medium">{applicant.name}</div>
                              <div className="text-xs text-muted-foreground">{applicant.professional} - {applicant.income}€/mois</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{applicant.property}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span 
                                className={`font-medium text-sm ${
                                  applicant.score >= 80 ? 'text-green-600' : 
                                  applicant.score >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}
                              >
                                {applicant.score}/100
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                applicant.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {applicant.status === 'complete' ? 'Complet' : 'Incomplet'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{applicant.applied}</td>
                          <td className="px-4 py-3 text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Détails</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Détails de la candidature</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="font-medium mb-2">Informations personnelles</h3>
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Nom:</span>
                                        <span>{applicant.name}</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Situation professionnelle:</span>
                                        <span>{applicant.professional}</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Revenus mensuels:</span>
                                        <span>{applicant.income}€</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Bien convoité:</span>
                                        <span>{applicant.property}</span>
                                      </div>
                                    </div>
                                    
                                    <h3 className="font-medium mb-2 mt-6">Score</h3>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span>Score global</span>
                                        <span className="font-medium">{applicant.score}/100</span>
                                      </div>
                                      <Progress value={applicant.score} className="h-2" />
                                      
                                      <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Statut professionnel</span>
                                          <span>32/40</span>
                                        </div>
                                        <Progress value={32/40*100} className="h-1" />
                                        
                                        <div className="flex justify-between text-sm">
                                          <span>Revenus</span>
                                          <span>25/30</span>
                                        </div>
                                        <Progress value={25/30*100} className="h-1" />
                                        
                                        <div className="flex justify-between text-sm">
                                          <span>Garantie</span>
                                          <span>15/20</span>
                                        </div>
                                        <Progress value={15/20*100} className="h-1" />
                                        
                                        <div className="flex justify-between text-sm">
                                          <span>Historique locatif</span>
                                          <span>10/10</span>
                                        </div>
                                        <Progress value={10/10*100} className="h-1" />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium mb-2">Documents fournis</h3>
                                    <div className="space-y-2 border rounded p-3">
                                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                        <span>Pièce d'identité</span>
                                        <Button variant="ghost" size="sm">Voir</Button>
                                      </div>
                                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                        <span>Justificatif de domicile</span>
                                        <Button variant="ghost" size="sm">Voir</Button>
                                      </div>
                                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                        <span>Bulletins de salaire (3 derniers mois)</span>
                                        <Button variant="ghost" size="sm">Voir</Button>
                                      </div>
                                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                        <span>Contrat de travail</span>
                                        <Button variant="ghost" size="sm">Voir</Button>
                                      </div>
                                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                        <span>Avis d'imposition</span>
                                        <Button variant="ghost" size="sm">Voir</Button>
                                      </div>
                                    </div>
                                    
                                    <h3 className="font-medium mb-2 mt-6">Actions</h3>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <Label htmlFor="score-override">Ajuster le score</Label>
                                        <div className="flex-1">
                                          <Input id="score-override" type="number" min="0" max="100" defaultValue={applicant.score} />
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Label htmlFor="status">Modifier le statut</Label>
                                        <div className="flex-1">
                                          <Select defaultValue={applicant.status}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Choisir un statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="complete">Complet</SelectItem>
                                              <SelectItem value="incomplete">Incomplet</SelectItem>
                                              <SelectItem value="approved">Approuvé</SelectItem>
                                              <SelectItem value="rejected">Rejeté</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-end space-x-2 pt-2">
                                        <Button variant="outline">Refuser</Button>
                                        <Button>Accepter</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="properties">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Adresse</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Candidatures</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Loyer</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {properties.map(property => (
                        <tr key={property.id}>
                          <td className="px-4 py-3 font-medium">{property.title}</td>
                          <td className="px-4 py-3 text-sm">{property.address}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                property.status === 'rented' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {property.status === 'rented' ? 'Loué' : 'Disponible'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{property.applications}</td>
                          <td className="px-4 py-3 text-sm">{property.rent}€/mois</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="outline" size="sm">Gérer</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="payments">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Locataire</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Montant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date d'échéance</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td className="px-4 py-3 font-medium">{payment.tenant}</td>
                          <td className="px-4 py-3 text-sm">{payment.property}</td>
                          <td className="px-4 py-3 text-sm">{payment.amount}€</td>
                          <td className="px-4 py-3 text-sm">{payment.dueDate}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                payment.status === 'late' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {payment.status === 'paid' ? 'Payé' : 
                              payment.status === 'late' ? 'En retard' : 
                              'À venir'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              {payment.status === 'late' && (
                                <Button variant="secondary" size="sm">Relancer</Button>
                              )}
                              <Button variant="outline" size="sm">Détails</Button>
                            </div>
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

export default AgentDashboard;
