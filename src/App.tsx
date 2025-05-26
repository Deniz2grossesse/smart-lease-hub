
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Property from "./pages/public/Property"

// Tenant Routes
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantApplication from "./pages/tenant/Application";

// Owner Routes
import OwnerDashboard from "./pages/owner/Dashboard";
import PropertyDetail from "./pages/owner/PropertyDetail";
import TenantDetail from "./pages/owner/TenantDetail";

// Agent Routes
import AgentDashboard from "./pages/agent/Dashboard";

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

            <Route path="/test" element={<Property />} />

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
                  <TenantDashboard />
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
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/applications"
              element={
                <ProtectedRoute userTypes={['tenant']}>
                  <TenantDashboard />
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
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/documents"
              element={
                <ProtectedRoute userTypes={['owner']}>
                  <OwnerDashboard />
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
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/applications"
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/properties"
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/payments"
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/stats"
              element={
                <ProtectedRoute userTypes={['agent']}>
                  <AgentDashboard />
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
