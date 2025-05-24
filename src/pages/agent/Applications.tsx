
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const AgentApplications = () => {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['agent-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_applications')
        .select(`
          *,
          properties (title, address, city),
          tenant_applications (first_name, last_name, monthly_income, employment_status)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    await supabase
      .from('property_applications')
      .update({ status })
      .eq('id', id);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Candidatures</h1>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Refusées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div>Chargement...</div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune candidature pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {application.tenant_applications?.first_name} {application.tenant_applications?.last_name}
                      </CardTitle>
                      {getStatusBadge(application.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{application.properties?.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {application.properties?.address}, {application.properties?.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Revenus:</span> {application.tenant_applications?.monthly_income}€/mois
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Statut:</span> {application.tenant_applications?.employment_status}
                        </p>
                      </div>
                    </div>
                    
                    {application.message && (
                      <div className="mt-4 p-3 bg-muted rounded">
                        <p className="text-sm">{application.message}</p>
                      </div>
                    )}
                    
                    {application.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Refuser
                        </Button>
                        <Button 
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          Approuver
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Répéter pour les autres onglets avec filtres appropriés */}
        </Tabs>
      </div>
    </Layout>
  );
};

export default AgentApplications;
