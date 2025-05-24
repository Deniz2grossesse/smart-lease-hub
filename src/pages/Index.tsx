
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Search, Users, Shield, Zap, CheckCircle } from 'lucide-react';
import Logo from '@/components/layout/Logo';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">e-mmoLink</span>
            </div>
            <nav className="flex space-x-6">
              <Link to="/properties" className="text-blue-600 hover:text-blue-700 font-medium">
                Voir les annonces
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Espace Pro
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Trouvez votre logement idéal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez nos annonces immobilières et candidatez en ligne sans inscription. 
            Une plateforme moderne pour locataires, propriétaires et agents immobiliers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/properties">
                <Search className="mr-2 h-5 w-5" />
                Parcourir les annonces
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/">
                <Users className="mr-2 h-5 w-5" />
                Espace Professionnel
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir e-mmoLink ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une solution complète qui simplifie la recherche de logement et la gestion immobilière
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle>Recherche simplifiée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Trouvez rapidement le bien qui vous correspond grâce à nos filtres avancés 
                  et notre interface intuitive.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle>Candidature express</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Candidatez en quelques clics sans inscription. 
                  Votre dossier est transmis directement aux agents.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle>Sécurisé & fiable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vos données sont protégées et seuls les agents immobiliers 
                  qualifiés peuvent consulter vos candidatures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Un processus simple en 3 étapes pour trouver votre logement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Explorez les annonces</h3>
              <p className="text-gray-600">
                Parcourez notre catalogue d'annonces immobilières avec des filtres personnalisés 
                pour trouver le bien qui vous correspond.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Candidatez en ligne</h3>
              <p className="text-gray-600">
                Remplissez notre formulaire de candidature simple et complet. 
                Aucune inscription n'est nécessaire.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Soyez contacté</h3>
              <p className="text-gray-600">
                L'agent immobilier examine votre dossier et vous contacte rapidement 
                pour organiser une visite si votre profil correspond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à trouver votre prochain logement ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Découvrez dès maintenant nos annonces immobilières disponibles 
            et candidatez en quelques minutes.
          </p>
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link to="/properties">
              Voir toutes les annonces
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo className="h-6 w-6" />
                <span className="text-lg font-bold">e-mmoLink</span>
              </div>
              <p className="text-gray-400">
                La plateforme moderne pour simplifier la recherche de logement 
                et la gestion immobilière.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Locataires</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/properties" className="hover:text-white">Toutes les annonces</Link></li>
                <li><a href="#" className="hover:text-white">Conseils location</a></li>
                <li><a href="#" className="hover:text-white">Aide candidature</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Professionnels</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Espace Pro</Link></li>
                <li><a href="#" className="hover:text-white">Gestion des biens</a></li>
                <li><a href="#" className="hover:text-white">Outils agent</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 e-mmoLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
