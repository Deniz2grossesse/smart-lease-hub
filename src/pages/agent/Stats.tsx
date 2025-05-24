
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Building, Users, TrendingUp, Euro } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const AgentStats = () => {
  const { data: properties = [] } = useQuery({
    queryKey: ['agent-stats-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['agent-stats-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_applications')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Données pour les graphiques
  const propertyTypeData = [
    { name: 'Appartements', value: properties.filter(p => p.property_type === 'apartment').length },
    { name: 'Maisons', value: properties.filter(p => p.property_type === 'house').length },
    { name: 'Studios', value: properties.filter(p => p.property_type === 'studio').length },
    { name: 'Lofts', value: properties.filter(p => p.property_type === 'loft').length },
  ];

  const monthlyApplications = [
    { month: 'Jan', candidatures: 12 },
    { month: 'Fév', candidatures: 19 },
    { month: 'Mar', candidatures: 15 },
    { month: 'Avr', candidatures: 25 },
    { month: 'Mai', candidatures: 22 },
    { month: 'Juin', candidatures: 30 },
  ];

  const rentData = [
    { range: '0-500€', count: properties.filter(p => p.price <= 500).length },
    { range: '500-800€', count: properties.filter(p => p.price > 500 && p.price <= 800).length },
    { range: '800-1200€', count: properties.filter(p => p.price > 800 && p.price <= 1200).length },
    { range: '1200€+', count: properties.filter(p => p.price > 1200).length },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.is_available).length;
  const occupancyRate = totalProperties > 0 ? ((totalProperties - availableProperties) / totalProperties * 100).toFixed(1) : 0;
  const totalApplications = applications.length;
  const averageRent = totalProperties > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalProperties) : 0;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total biens</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {availableProperties} disponibles
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% ce mois
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                +15% ce mois
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Loyer moyen</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRent}€</div>
              <p className="text-xs text-muted-foreground">
                Par mois
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type de bien</CardTitle>
              <CardDescription>Distribution des propriétés par type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Candidatures par mois</CardTitle>
              <CardDescription>Évolution des candidatures reçues</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="candidatures" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition des loyers</CardTitle>
            <CardDescription>Nombre de biens par tranche de loyer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AgentStats;
