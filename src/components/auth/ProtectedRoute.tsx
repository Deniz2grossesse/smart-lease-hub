
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  userTypes: Array<'tenant' | 'owner' | 'agent'>;
}

const ProtectedRoute = ({ children, userTypes }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // If auth is still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // If user is not logged in, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but with wrong type, redirect to appropriate dashboard
  if (profile && !userTypes.includes(profile.type)) {
    switch(profile.type) {
      case 'tenant':
        return <Navigate to="/tenant/dashboard" replace />;
      case 'owner':
        return <Navigate to="/owner/dashboard" replace />;
      case 'agent':
        return <Navigate to="/agent/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If user is authorized, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
