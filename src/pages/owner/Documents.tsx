
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Upload, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const OwnerDocuments = () => {
  const { user } = useAuth();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['owner-documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case 'contract':
        return <Badge className="bg-purple-100 text-purple-800">Contrat</Badge>;
      case 'receipt':
        return <Badge className="bg-blue-100 text-blue-800">Quittance</Badge>;
      case 'inventory':
        return <Badge className="bg-yellow-100 text-yellow-800">État des lieux</Badge>;
      case 'insurance':
        return <Badge className="bg-green-100 text-green-800">Assurance</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleDownload = async (document: any) => {
    // Logique de téléchargement - à implémenter avec Supabase Storage
    console.log('Téléchargement du document:', document.name);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes documents</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un document
          </Button>
        </div>
        
        <div className="grid gap-6">
          {isLoading ? (
            <div>Chargement...</div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun document pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ajoutez vos contrats, quittances et autres documents importants
                </p>
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter votre premier document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Document</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date d'ajout</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getDocumentTypeBadge(doc.type)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        {doc.verified ? (
                          <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                        ) : (
                          <Badge variant="secondary">En attente</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDocuments;
