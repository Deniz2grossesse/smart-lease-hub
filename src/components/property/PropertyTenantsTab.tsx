
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PropertyTenantsTabProps {
  tenants: any[];
  property: any;
}

const PropertyTenantsTab = ({ tenants, property }: PropertyTenantsTabProps) => {
  const navigate = useNavigate();

  if (tenants.length > 0) {
    return (
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Téléphone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date d'entrée</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-4 py-3 text-sm">
                  {tenant.first_name} {tenant.last_name}
                </td>
                <td className="px-4 py-3 text-sm">{tenant.email}</td>
                <td className="px-4 py-3 text-sm">{tenant.phone || "Non renseigné"}</td>
                <td className="px-4 py-3 text-sm">Non défini</td>
                <td className="px-4 py-3 text-sm text-right">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/owner/tenant/${tenant.id}`)}>
                    Détails
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
      <p className="text-muted-foreground">Aucun locataire n'est actuellement associé à ce bien</p>
      {!property.is_available && (
        <p className="text-sm text-muted-foreground mt-2">Ce bien est marqué comme loué, mais aucun locataire n'y est associé.</p>
      )}
      <Button className="mt-4">
        Associer un locataire
      </Button>
    </div>
  );
};

export default PropertyTenantsTab;
