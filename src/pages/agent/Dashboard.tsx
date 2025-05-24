
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

const AgentDashboard = () => {
  const { data: properties = [] } = useQuery({
    queryKey: ['agent-dashboard-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['agent-dashboard-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_applications')
        .select(`
          *,
          properties (title, address, city),
          tenant_applications (first_name, last_name)
        `)
        .eq('status', 'pending')
        .limit(5)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['agent-dashboard-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('read', false)
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const totalProperties = properties.length;
  const pendingApplications = applications.length;
  const unreadAlerts = alerts.length;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord agent</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Biens gérés
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                Propriétés en portefeuille
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures en attente
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Alertes
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Non lues
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taux d'occupation
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +2% ce mois
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Candidatures récentes</CardTitle>
                  <CardDescription>
                    Candidatures en attente de traitement
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/agent/applications">
                    Voir tout
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune candidature en attente</p>
                ) : (
                  applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">
                          {application.tenant_applications?.first_name} {application.tenant_applications?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.properties?.title}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        En attente
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Alertes récentes</CardTitle>
                  <CardDescription>
                    Notifications importantes
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/agent/alerts">
                    Voir tout
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune alerte</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Biens récemment ajoutés</CardTitle>
                <CardDescription>
                  Dernières propriétés dans votre portefeuille
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/agent/properties">
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun bien enregistré</p>
              ) : (
                properties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{property.title}</h3>
                      <Badge variant={property.is_available ? "default" : "secondary"}>
                        {property.is_available ? "Disponible" : "Loué"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.address}, {property.city}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{property.price}€/mois</span>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AgentDashboard;
