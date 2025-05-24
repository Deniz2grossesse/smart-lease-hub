
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PropertyPagination from "@/components/ui/property-pagination";
import PropertyList from "@/components/property/PropertyList";
import { usePagination } from "@/hooks/usePagination";

const OwnerProperties = () => {
  const { user } = useAuth();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['owner-properties', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          property_applications (count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les propriétés",
          variant: "destructive"
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
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
      <div className="flex justify-between items-center mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Mes biens</h1>
        <Button asChild className="hover-scale">
          <Link to="/owner/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyList
          properties={currentData}
          isLoading={isLoading}
          baseRoute="/owner/properties"
          userType="owner"
        />
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
  );
};

export default OwnerProperties;
