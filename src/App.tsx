
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tenant Routes
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantApplication from "./pages/tenant/Application";

// Owner Routes
import OwnerDashboard from "./pages/owner/Dashboard";

// Agent Routes
import AgentDashboard from "./pages/agent/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Tenant Routes */}
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/tenant/account" element={<TenantDashboard />} />
          <Route path="/tenant/application" element={<TenantApplication />} />
          <Route path="/tenant/alerts" element={<TenantDashboard />} />
          <Route path="/tenant/applications" element={<TenantDashboard />} />
          
          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/properties" element={<OwnerDashboard />} />
          <Route path="/owner/tenants" element={<OwnerDashboard />} />
          <Route path="/owner/documents" element={<OwnerDashboard />} />
          
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/alerts" element={<AgentDashboard />} />
          <Route path="/agent/applications" element={<AgentDashboard />} />
          <Route path="/agent/properties" element={<AgentDashboard />} />
          <Route path="/agent/payments" element={<AgentDashboard />} />
          <Route path="/agent/stats" element={<AgentDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
