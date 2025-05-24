
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Home, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const OwnerTenants = () => {
  const navigate = useNavigate();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['owner-tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          property_applications!inner (
            status,
            properties (
              title,
              address,
              city
            )
          )
        `)
        .eq('type', 'tenant')
        .eq('property_applications.status', 'approved');
      
      if (error) throw error;
      return data;
    }
  });

  const handleViewTenant = (tenantId: string) => {
    navigate(`/owner/tenant/${tenantId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Mes locataires</h1>
        
        <div className="grid gap-6">
          {isLoading ? (
            <div>Chargement...</div>
          ) : tenants.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun locataire pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les locataires apparaîtront ici une fois qu'ils auront été approuvés
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <Card key={tenant.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {tenant.first_name} {tenant.last_name}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{tenant.email}</span>
                    </div>
                    
                    {tenant.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                    
                    {tenant.property_applications?.[0]?.properties && (
                      <div className="flex items-start gap-2 text-sm">
                        <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{tenant.property_applications[0].properties.title}</p>
                          <p className="text-muted-foreground">
                            {tenant.property_applications[0].properties.address}, {tenant.property_applications[0].properties.city}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Locataire depuis {new Date(tenant.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewTenant(tenant.id)}
                        className="w-full"
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerTenants;
