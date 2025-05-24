
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PropertyDocumentsTabProps {
  documents: any[];
  onDownloadDocument: (doc: any) => void;
}

const PropertyDocumentsTab = ({ documents, onDownloadDocument }: PropertyDocumentsTabProps) => {
  if (documents.length > 0) {
    return (
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-3 text-sm">{doc.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {doc.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDownloadDocument(doc)}
                  >
                    Télécharger
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">Aucun document n'est associé à ce bien</p>
      <Button className="mt-4">
        <Upload className="h-4 w-4 mr-2" />
        Ajouter un document
      </Button>
    </div>
  );
};

export default PropertyDocumentsTab;
