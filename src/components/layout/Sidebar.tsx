
import { useLocation, Link } from "react-router-dom";
import { Home, User, FileText, Bell, Folder, Building, ChevronRight, LogOut, Menu } from "lucide-react";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const determineUserType = (): "tenant" | "owner" | "agent" | null => {
    if (profile?.type) {
      return profile.type;
    }
    
    const path = location.pathname;
    if (path.startsWith("/tenant")) return "tenant";
    if (path.startsWith("/owner")) return "owner";
    if (path.startsWith("/agent")) return "agent";
    return null;
  };

  const userType = determineUserType();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = {
    tenant: [
      { title: "Accueil", path: "/tenant/dashboard", icon: Home },
      { title: "Mon compte", path: "/tenant/account", icon: User },
      { title: "Mon dossier", path: "/tenant/application", icon: FileText },
      { title: "Mes alertes", path: "/tenant/alerts", icon: Bell },
      { title: "Mes candidatures", path: "/tenant/applications", icon: Folder },
    ],
    owner: [
      { title: "Tableau de bord", path: "/owner/dashboard", icon: Home },
      { title: "Mes biens", path: "/owner/properties", icon: Building },
      { title: "Mes locataires", path: "/owner/tenants", icon: User },
      { title: "Mes documents", path: "/owner/documents", icon: FileText },
    ],
    agent: [
      { title: "Tableau de bord", path: "/agent/dashboard", icon: Home },
      { title: "Alertes", path: "/agent/alerts", icon: Bell },
      { title: "Candidatures", path: "/agent/applications", icon: Folder },
      { title: "Gestion des biens", path: "/agent/properties", icon: Building },
      { title: "Suivi des paiements", path: "/agent/payments", icon: FileText },
      { title: "Statistiques", path: "/agent/stats", icon: ChevronRight },
    ]
  };

  // Ne pas afficher la sidebar si l'utilisateur n'est pas connecté ou si le type n'est pas déterminé
  if (!profile || !userType) {
    return null;
  }

  return (
    <ShadcnSidebar>
      <SidebarRail />
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo className="h-10 w-10" />
          <span className="ml-2 text-lg font-brand text-white">e-mmoLink</span>
        </div>
        <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-foreground/80">
          <Menu size={20} />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems[userType].map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.path)}
                tooltip={item.title}
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/20 pt-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground/80"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </Button>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
