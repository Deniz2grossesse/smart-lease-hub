
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Edit, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const OwnerProperties = () => {
  const { user } = useAuth();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (*),
            property_applications (count)
          `)
          .eq('owner_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les propriétés",
            variant: "destructive"
          });
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Error in properties query:', error);
        throw error;
      }
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p>Une erreur est survenue lors du chargement des propriétés.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes biens</h1>
        <Button asChild>
          <Link to="/owner/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des propriétés...</p>
          </div>
        ) : properties.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun bien pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          properties.map((property) => (
            <Card key={property.id}>
              {property.property_images?.[0] && (
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={property.property_images[0].url} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <Badge variant={property.is_available ? "default" : "secondary"}>
                    {property.is_available ? "Disponible" : "Loué"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {property.address}, {property.city}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>{property.rooms} pièces</span>
                    <span>{property.area} m²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{property.price}€/mois</span>
                    <span className="text-sm text-muted-foreground">
                      {property.property_applications?.length || 0} candidature(s)
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/owner/properties/${property.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/owner/properties/${property.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerProperties;
