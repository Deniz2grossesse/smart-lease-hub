
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PropertyHeaderProps {
  property: any;
  editing: boolean;
  onBackClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const PropertyHeader = ({ property, editing, onBackClick, onEditClick, onDeleteClick }: PropertyHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="outline" onClick={onBackClick}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <h1 className="text-3xl font-bold">{property.title}</h1>
      {!editing && (
        <div className="ml-auto space-x-2">
          <Button variant="outline" onClick={onEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer cette propriété ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. La propriété sera définitivement supprimée de votre portefeuille.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => document.querySelector<HTMLButtonElement>("[data-dismiss-delete-dialog]")?.click()}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={onDeleteClick}>
                  Supprimer définitivement
                </Button>
                <button
                  type="button"
                  className="hidden"
                  data-dismiss-delete-dialog
                ></button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default PropertyHeader;
