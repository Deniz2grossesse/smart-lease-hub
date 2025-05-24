
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback";
import NoDataFallback from "@/components/ui/no-data-fallback";

const OwnerProperties = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <ErrorFallback 
          title="Accès non autorisé"
          message="Veuillez vous connecter pour accéder à cette page."
          showRetry={false}
        />
      </div>
    );
  }

  const { data: properties = [], isLoading, error, refetch } = useQuery({
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
        console.error('Erreur lors du chargement des propriétés:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger vos propriétés",
          variant: "destructive"
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors
      return failureCount < 2 && !error.message.includes('non connecté');
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

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mes biens</h1>
        </div>
        <ErrorFallback 
          title="Erreur de chargement"
          message="Une erreur est survenue lors du chargement de vos propriétés. Veuillez réessayer."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Mes biens</h1>
        <Button asChild className="hover-scale">
          <Link to="/owner/properties/new" aria-label="Ajouter un nouveau bien immobilier">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Ajouter un bien
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-lg">Chargement de vos propriétés...</span>
        </div>
      ) : properties.length === 0 ? (
        <NoDataFallback
          title="Aucun bien immobilier"
          message="Vous n'avez pas encore ajouté de bien à votre portefeuille. Commencez par en créer un !"
          actionLabel="Ajouter votre premier bien"
          onAction={() => window.location.href = '/owner/properties/new'}
          icon="plus"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyList
              properties={currentData}
              isLoading={false}
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
        </>
      )}
    </div>
  );
};

export default OwnerProperties;
