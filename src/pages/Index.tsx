
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building, Users } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import SearchBar from '@/components/search/SearchBar';
import PropertyGrid from '@/components/property/PropertyGrid';
import FilterSidebar from '@/components/search/FilterSidebar';
import { fetchPublicProperties, PublicPropertyFilters } from '@/lib/services/publicPropertyService';
import { Property } from '@/lib/types/property';

const Index: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PublicPropertyFilters>({});
  const [resultsCount, setResultsCount] = useState(0);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPublicProperties(filters);
      // Limiter à 8 annonces pour la homepage
      const limitedData = data.slice(0, 8);
      setProperties(limitedData);
      setResultsCount(data.length);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchFilters: PublicPropertyFilters) => {
    setFilters(prev => ({ ...prev, ...searchFilters }));
  };

  const handleAdvancedFilters = (advancedFilters: any) => {
    setFilters(prev => ({ ...prev, ...advancedFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">e-mmoLink</span>
            </div>
            <nav className="flex space-x-6">
              <Link to="/properties" className="text-gray-600 hover:text-gray-900">
                Annonces
              </Link>
              <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
                Se connecter
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Barre de recherche principale */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trouvez votre logement idéal
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos annonces immobilières et candidatez en ligne
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Contenu principal - marketplace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filtres */}
          <aside className="w-full lg:w-80">
            <FilterSidebar onFiltersChange={handleAdvancedFilters} />
          </aside>

          {/* Grille d'annonces */}
          <div className="flex-1">
            {/* Barre de résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoading ? (
                    'Recherche en cours...'
                  ) : (
                    `${resultsCount} annonce${resultsCount > 1 ? 's' : ''} trouvée${resultsCount > 1 ? 's' : ''}`
                  )}
                </h2>
                {Object.keys(filters).length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filtres appliqués
                  </p>
                )}
              </div>

              {/* Voir toutes les annonces */}
              <Button asChild variant="outline" size="sm">
                <Link to="/properties">
                  Voir toutes les annonces
                </Link>
              </Button>
            </div>

            {/* Grille des propriétés */}
            <PropertyGrid properties={properties} isLoading={isLoading} />

            {/* Voir plus d'annonces */}
            {!isLoading && properties.length > 0 && (
              <div className="text-center mt-8">
                <Button asChild size="lg" className="px-8">
                  <Link to="/properties">
                    Voir toutes les annonces ({resultsCount})
                  </Link>
                </Button>
              </div>
            )}

            {/* Call to action si pas de résultats */}
            {!isLoading && properties.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 border">
                  <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Aucune annonce ne correspond à vos critères
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Essayez d'élargir votre recherche ou modifiez vos filtres
                  </p>
                  <Button onClick={() => {
                    setFilters({});
                  }}>
                    Voir toutes les annonces
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Logo className="h-6 w-6" />
              <span className="text-lg font-bold">e-mmoLink</span>
            </div>
            <p className="text-gray-400 mb-4">
              La plateforme moderne pour simplifier la recherche de logement
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/auth" className="hover:text-white">Se connecter</Link>
              <Link to="/properties" className="hover:text-white">Annonces</Link>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Aide</a>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              &copy; 2024 e-mmoLink. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
