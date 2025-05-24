
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthGuardProps {
  children: ReactNode;
  requiredUserTypes?: string[];
}

const AuthGuard = ({ children, requiredUserTypes }: AuthGuardProps) => {
  const { user, userProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Veuillez vous connecter pour accéder à cette page.</p>
            <Button onClick={() => window.location.href = '/'}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredUserTypes && userProfile && !requiredUserTypes.includes(userProfile.type)) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <Button onClick={() => window.location.href = '/'}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
