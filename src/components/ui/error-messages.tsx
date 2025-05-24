
import React from 'react';
import { AlertCircle, RefreshCw, Home, Wifi, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorMessageProps {
  type: 'network' | 'auth' | 'permission' | 'not-found' | 'server' | 'validation';
  title?: string;
  message: string;
  onRetry?: () => void;
  actionLabel?: string;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  type,
  title,
  message,
  onRetry,
  actionLabel,
  showRetry = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <Wifi className="h-12 w-12 text-red-500" />;
      case 'auth':
        return <Lock className="h-12 w-12 text-orange-500" />;
      case 'permission':
        return <Lock className="h-12 w-12 text-red-500" />;
      case 'not-found':
        return <Home className="h-12 w-12 text-gray-500" />;
      case 'server':
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      case 'validation':
        return <AlertCircle className="h-12 w-12 text-yellow-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Problème de connexion';
      case 'auth':
        return 'Authentification requise';
      case 'permission':
        return 'Accès non autorisé';
      case 'not-found':
        return 'Ressource introuvable';
      case 'server':
        return 'Erreur serveur';
      case 'validation':
        return 'Données invalides';
      default:
        return 'Une erreur est survenue';
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <CardTitle className="text-xl">
          {title || getDefaultTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {message}
        </p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {actionLabel || 'Réessayer'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
