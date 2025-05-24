
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Building, Eye, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const TenantApplications = () => {
  const { user } = useAuth();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['tenant-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('property_applications')
        .select(`
          *,
          properties (
            title,
            address,
            city,
            price,
            property_images (url)
          )
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Mes candidatures</h1>
        
        <div className="grid gap-6">
          {isLoading ? (
            <div>Chargement...</div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune candidature pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Recherchez des biens et postulez pour commencer
                </p>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {application.properties?.title}
                    </CardTitle>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Adresse:</span> {application.properties?.address}, {application.properties?.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Loyer:</span> {application.properties?.price}€/mois
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Candidature:</span> {new Date(application.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {application.properties?.property_images?.[0] && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={application.properties.property_images[0].url} 
                          alt={application.properties?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  {application.message && (
                    <div className="mt-4 p-3 bg-muted rounded">
                      <p className="text-sm font-medium mb-1">Message de candidature:</p>
                      <p className="text-sm">{application.message}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir le bien
                    </Button>
                    {application.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TenantApplications;
