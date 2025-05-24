
import { useAuth } from '@/contexts/AuthContext';
import { Building, Users, FileText, BarChart3, Bell, Home, UserCheck, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ConditionalSidebar = () => {
  const { userProfile } = useAuth();
  const location = useLocation();

  if (!userProfile) return null;

  const getMenuItems = () => {
    switch (userProfile.type) {
      case 'agent':
        return [
          { icon: Home, label: 'Dashboard', href: '/agent/dashboard' },
          { icon: Building, label: 'Biens', href: '/agent/properties' },
          { icon: UserCheck, label: 'Candidatures', href: '/agent/applications' },
          { icon: CreditCard, label: 'Paiements', href: '/agent/payments' },
          { icon: BarChart3, label: 'Statistiques', href: '/agent/stats' },
          { icon: Bell, label: 'Alertes', href: '/agent/alerts' },
        ];
      case 'owner':
        return [
          { icon: Home, label: 'Dashboard', href: '/owner/dashboard' },
          { icon: Building, label: 'Mes biens', href: '/owner/properties' },
          { icon: Users, label: 'Locataires', href: '/owner/tenants' },
          { icon: FileText, label: 'Documents', href: '/owner/documents' },
        ];
      case 'tenant':
        return [
          { icon: Home, label: 'Dashboard', href: '/tenant/dashboard' },
          { icon: UserCheck, label: 'Candidature', href: '/tenant/application' },
          { icon: FileText, label: 'Mes candidatures', href: '/tenant/applications' },
          { icon: Users, label: 'Mon compte', href: '/tenant/account' },
          { icon: Bell, label: 'Alertes', href: '/tenant/alerts' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ConditionalSidebar;
