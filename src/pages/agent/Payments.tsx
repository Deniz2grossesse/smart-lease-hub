
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Données temporaires - à remplacer par une vraie API
const paymentsData = [
  {
    id: 1,
    tenant: "Marie Dubois",
    property: "Appartement T3 Centre-ville",
    amount: 850,
    dueDate: "2025-01-05",
    status: "paid",
    paidDate: "2025-01-03",
  },
  {
    id: 2,
    tenant: "Thomas Martin",
    property: "Maison avec jardin",
    amount: 1200,
    dueDate: "2025-01-05",
    status: "late",
    paidDate: null,
    daysLate: 19,
  },
  {
    id: 3,
    tenant: "Julie Blanc",
    property: "Studio moderne",
    amount: 700,
    dueDate: "2025-02-05",
    status: "upcoming",
    paidDate: null,
  },
];

const AgentPayments = () => {
  const getStatusBadge = (status: string, daysLate?: number) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Payé</Badge>;
      case 'late':
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />En retard ({daysLate}j)</Badge>;
      case 'upcoming':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />À venir</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const sendReminder = (paymentId: number) => {
    // Logique pour envoyer un rappel
    console.log(`Rappel envoyé pour le paiement ${paymentId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Suivi des paiements</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total collecté</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">850€</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En retard</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1200€</div>
              <p className="text-xs text-muted-foreground">1 paiement</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attendu</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">700€</div>
              <p className="text-xs text-muted-foreground">Février 2025</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="late">En retard</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="paid">Payés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Locataire</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bien</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Montant</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Échéance</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paymentsData.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 font-medium">{payment.tenant}</td>
                      <td className="px-4 py-3 text-sm">{payment.property}</td>
                      <td className="px-4 py-3 text-sm font-medium">{payment.amount}€</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(payment.status, payment.daysLate)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === 'late' && (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => sendReminder(payment.id)}
                            >
                              Relancer
                            </Button>
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
      </div>
    </Layout>
  );
};

export default AgentPayments;
