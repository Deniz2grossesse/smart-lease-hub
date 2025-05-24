
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PropertyImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface PropertyImagesProps {
  images: PropertyImage[];
  propertyId: string;
  onImageDeleted: (imageId: string) => void;
  onEditClick: () => void;
}

const PropertyImages = ({ images, propertyId, onImageDeleted, onEditClick }: PropertyImagesProps) => {
  const { user } = useAuth();
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      setDeletingImageId(imageId);

      // Vérifier que l'utilisateur est propriétaire du bien
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('owner_id')
        .eq('id', propertyId)
        .single();

      if (propertyError || !property || property.owner_id !== user?.id) {
        throw new Error("Vous n'avez pas les droits pour supprimer cette image");
      }

      // Extraire le chemin du fichier depuis l'URL
      const urlParts = imageUrl.split('/');
      const storageIndex = urlParts.findIndex(part => part === 'property-images');
      if (storageIndex === -1) {
        throw new Error("URL d'image invalide");
      }
      
      const filePath = urlParts.slice(storageIndex + 1).join('/');

      // Supprimer l'image du storage
      const { error: storageError } = await supabase.storage
        .from('property-images')
        .remove([filePath]);

      if (storageError) {
        console.warn('Erreur lors de la suppression du fichier:', storageError);
      }

      // Supprimer l'entrée de la base de données
      const { error: dbError } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      onImageDeleted(imageId);
      
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée de votre propriété avec succès",
      });

    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      toast({
        title: "Erreur de suppression",
        description: error.message || "Impossible de supprimer cette image. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
        <div className="p-8 border rounded-md flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">Aucune image disponible pour cette propriété</p>
          <Button variant="outline" onClick={onEditClick}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter des photos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos ({images.length})</h3>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div key={image.id} className="aspect-square relative overflow-hidden rounded-md group">
            <img 
              src={image.url} 
              alt={`Photo ${index + 1} de la propriété`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
                target.alt = 'Image non disponible';
              }}
            />
            {image.is_primary && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Principal
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={deletingImageId === image.id}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer cette image ?</DialogTitle>
                    <DialogDescription>
                      Cette action est irréversible. L'image sera définitivement supprimée de cette propriété.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteImage(image.id, image.url)}
                      disabled={deletingImageId === image.id}
                    >
                      {deletingImageId === image.id ? "Suppression..." : "Supprimer définitivement"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-2 w-full" onClick={onEditClick}>
        <Upload className="h-4 w-4 mr-2" />
        Ajouter plus de photos
      </Button>
    </div>
  );
};

export default PropertyImages;
