
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tenant Routes
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantAccount from "./pages/tenant/Account";
import TenantApplication from "./pages/tenant/Application";
import TenantAlerts from "./pages/tenant/Alerts";
import TenantApplications from "./pages/tenant/Applications";

// Owner Routes
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerTenants from "./pages/owner/Tenants";
import OwnerDocuments from "./pages/owner/Documents";
import PropertyDetail from "./pages/owner/PropertyDetail";
import TenantDetail from "./pages/owner/TenantDetail";

// Agent Routes
import AgentDashboard from "./pages/agent/Dashboard";
import AgentAlerts from "./pages/agent/Alerts";
import AgentApplications from "./pages/agent/Applications";
import AgentProperties from "./pages/agent/Properties";
import AgentPayments from "./pages/agent/Payments";
import AgentStats from "./pages/agent/Stats";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Tenant Routes */}
            <Route 
              path="/tenant/dashboard" 
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant/account" 
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantAccount />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant/application" 
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantApplication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant/alerts" 
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantAlerts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant/applications" 
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantApplications />
                </ProtectedRoute>
              } 
            />
            
            {/* Owner Routes */}
            <Route 
              path="/owner/dashboard" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/properties" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/tenants" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <OwnerTenants />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/documents" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <OwnerDocuments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/property/:id" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <PropertyDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/tenant/:id" 
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <TenantDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Agent Routes */}
            <Route 
              path="/agent/dashboard" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/alerts" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentAlerts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/applications" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/properties" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentProperties />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/payments" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentPayments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/stats" 
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentStats />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
