
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Building, Users, Euro } from "lucide-react";

// Données temporaires pour les graphiques
const monthlyData = [
  { month: 'Jan', loyers: 2850, candidatures: 12 },
  { month: 'Fév', loyers: 3200, candidatures: 8 },
  { month: 'Mar', loyers: 2950, candidatures: 15 },
  { month: 'Avr', loyers: 3400, candidatures: 10 },
  { month: 'Mai', loyers: 3100, candidatures: 18 },
];

const propertyTypeData = [
  { name: 'Appartements', value: 65, color: '#3b82f6' },
  { name: 'Maisons', value: 25, color: '#10b981' },
  { name: 'Studios', value: 10, color: '#f59e0b' },
];

const AgentStats = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 500€</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12% </span>
                par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Biens gérés</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2 </span>
                ce mois-ci
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Locataires actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Taux d'occupation: 75%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">63</div>
              <p className="text-xs text-muted-foreground">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="loyers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Loyers (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Candidatures par mois</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="candidatures" fill="#10b981" name="Candidatures" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type de bien</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taux d'occupation</span>
                <span className="text-lg font-bold text-green-600">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Délai moyen de location</span>
                <span className="text-lg font-bold">12 jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taux de retard de paiement</span>
                <span className="text-lg font-bold text-red-600">8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Satisfaction moyenne</span>
                <span className="text-lg font-bold text-blue-600">4.2/5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AgentStats;
