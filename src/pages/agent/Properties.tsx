
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Edit, Eye, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AuthGuard from "@/components/auth/AuthGuard";
import PropertyPagination from "@/components/ui/property-pagination";
import { usePagination } from "@/hooks/usePagination";
import { Property } from "@/lib/types/property";

const AgentProperties = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['agent-properties'],
    queryFn: async (): Promise<Property[]> => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (*),
            property_applications (count)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les propriétés",
            variant: "destructive"
          });
          throw error;
        }
        return (data || []) as Property[];
      } catch (error) {
        throw error;
      }
    }
  });

  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    canGoNext,
    canGoPrevious
  } = usePagination({
    data: properties,
    itemsPerPage: 6
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      toast({
        title: "Succès",
        description: "Le bien a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bien",
        variant: "destructive"
      });
    }
  });

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  if (error) {
    return (
      <AuthGuard requiredUserTypes={['agent']}>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erreur</h2>
            <p>Une erreur est survenue lors du chargement des propriétés.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredUserTypes={['agent']}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold">Gestion des biens</h1>
          <Button asChild className="hover-scale">
            <Link to="/agent/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un bien
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <LoadingSpinner className="mx-auto mb-4" />
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
            currentData.map((property, index) => (
              <Card key={property.id} className="hover-scale transition-all duration-200">
                {property.property_images?.[0] && (
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={property.property_images[0].url} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
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
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild className="hover-scale">
                      <Link to={`/agent/properties/${property.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="hover-scale">
                      <Link to={`/agent/properties/${property.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deletePropertyMutation.isPending}
                      className="hover-scale"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {properties.length > 6 && (
          <PropertyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default AgentProperties;
