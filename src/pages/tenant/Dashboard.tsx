
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, FileCheck, FilePenLine } from "lucide-react";

const TenantDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Status du dossier
              </CardTitle>
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">70%</div>
              <Progress value={70} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complétez votre dossier pour augmenter vos chances
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures actives
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-2">
                Dossiers déposés en attente de réponse
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Alertes
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-2">
                Nouvelles alertes selon vos critères
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Mon dossier locatif</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compléter mon dossier</CardTitle>
            <CardDescription>
              Un dossier complet augmente vos chances de trouver un logement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Identité</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Complet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Justificatifs de revenu</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Incomplet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Situation professionnelle</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Complet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Garanties</span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">Non renseigné</span>
              </div>
              <div className="pt-2">
                <Button>Compléter mon dossier</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-bold mb-4">Candidatures récentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&h=300" 
                alt="Appartement lumineux"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-bold">Appartement lumineux au centre-ville</h3>
              <p className="text-muted-foreground text-sm">Candidature envoyée le 15/05/2025</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">En cours d'examen</span>
                <Button variant="outline" size="sm">Voir détails</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&h=300" 
                alt="Studio étudiant"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-bold">Studio étudiant près du campus</h3>
              <p className="text-muted-foreground text-sm">Candidature envoyée le 10/05/2025</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Dossier incomplet</span>
                <Button variant="outline" size="sm">Voir détails</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&h=300" 
                alt="Studio moderne"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-bold">Studio moderne près de la gare</h3>
              <p className="text-muted-foreground text-sm">Candidature envoyée le 05/05/2025</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Acceptée</span>
                <Button variant="outline" size="sm">Voir détails</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TenantDashboard;
