
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';

// Pages publiques
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Pages Agent
import AgentDashboard from '@/pages/agent/Dashboard';
import AgentProperties from '@/pages/agent/Properties';
import AgentPropertyNew from '@/pages/agent/PropertyNew';
import AgentPropertyDetail from '@/pages/agent/PropertyDetail';
import AgentPropertyEdit from '@/pages/agent/PropertyEdit';
import AgentApplications from '@/pages/agent/Applications';
import AgentPayments from '@/pages/agent/Payments';
import AgentAlerts from '@/pages/agent/Alerts';
import AgentStats from '@/pages/agent/Stats';

// Pages Owner
import OwnerDashboard from '@/pages/owner/Dashboard';
import OwnerProperties from '@/pages/owner/Properties';
import OwnerPropertyNew from '@/pages/owner/PropertyNew';
import OwnerPropertyEdit from '@/pages/owner/PropertyEdit';
import OwnerPropertyDetail from '@/pages/owner/PropertyDetail';
import OwnerTenants from '@/pages/owner/Tenants';
import OwnerTenantDetail from '@/pages/owner/TenantDetail';
import OwnerDocuments from '@/pages/owner/Documents';

// Pages Tenant
import TenantDashboard from '@/pages/tenant/Dashboard';
import TenantApplication from '@/pages/tenant/Application';
import TenantApplications from '@/pages/tenant/Applications';
import TenantAccount from '@/pages/tenant/Account';
import TenantAlerts from '@/pages/tenant/Alerts';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Page d'accueil publique */}
            <Route path="/" element={<Index />} />
            
            {/* Routes Agent */}
            <Route path="/agent/*" element={
              <ProtectedRoute userTypes={['agent']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="properties" element={<AgentProperties />} />
                    <Route path="properties/new" element={<AgentPropertyNew />} />
                    <Route path="properties/:id" element={<AgentPropertyDetail />} />
                    <Route path="properties/:id/edit" element={<AgentPropertyEdit />} />
                    <Route path="applications" element={<AgentApplications />} />
                    <Route path="payments" element={<AgentPayments />} />
                    <Route path="alerts" element={<AgentAlerts />} />
                    <Route path="stats" element={<AgentStats />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Routes Owner - URLs uniformisées avec /properties/:id */}
            <Route path="/owner/*" element={
              <ProtectedRoute userTypes={['owner']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="properties" element={<OwnerProperties />} />
                    <Route path="properties/new" element={<OwnerPropertyNew />} />
                    <Route path="properties/:id" element={<OwnerPropertyDetail />} />
                    <Route path="properties/:id/edit" element={<OwnerPropertyEdit />} />
                    <Route path="tenants" element={<OwnerTenants />} />
                    <Route path="tenants/:id" element={<OwnerTenantDetail />} />
                    <Route path="documents" element={<OwnerDocuments />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Routes Tenant */}
            <Route path="/tenant/*" element={
              <ProtectedRoute userTypes={['tenant']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<TenantDashboard />} />
                    <Route path="application" element={<TenantApplication />} />
                    <Route path="applications" element={<TenantApplications />} />
                    <Route path="account" element={<TenantAccount />} />
                    <Route path="alerts" element={<TenantAlerts />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
