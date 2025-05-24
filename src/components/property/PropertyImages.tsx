
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Trash, RefreshCw, ImageOff } from "lucide-react";
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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setFailedImages(prev => new Set(prev).add(imageId));
  };

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
        title: "Image supprimée avec succès",
        description: "L'image a été retirée de votre propriété",
      });

    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Impossible de supprimer cette image. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div role="region" aria-label="Section photos de la propriété">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
        <div className="p-8 border rounded-md flex flex-col items-center justify-center text-center bg-gray-50">
          <ImageOff className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
          <p className="text-muted-foreground mb-4">Aucune image disponible pour cette propriété</p>
          <Button 
            variant="outline" 
            onClick={onEditClick}
            aria-label="Ajouter des photos à cette propriété"
          >
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Ajouter des photos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div role="region" aria-label="Section photos de la propriété">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Photos ({images.length})
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div key={image.id} className="aspect-square relative overflow-hidden rounded-md group">
            {failedImages.has(image.id) ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ImageOff className="h-8 w-8 text-gray-400" aria-hidden="true" />
                <span className="sr-only">Image non disponible</span>
              </div>
            ) : (
              <img 
                src={image.url} 
                alt={`Photo ${index + 1} de la propriété${image.is_primary ? ' (image principale)' : ''}`}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                onError={() => handleImageError(image.id)}
                loading="lazy"
              />
            )}
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
                    aria-label={`Supprimer la photo ${index + 1}`}
                  >
                    <Trash className="h-4 w-4" aria-hidden="true" />
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
                      {deletingImageId === image.id ? "Suppression en cours..." : "Supprimer définitivement"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
      <Button 
        variant="outline" 
        className="mt-2 w-full" 
        onClick={onEditClick}
        aria-label="Ajouter plus de photos à cette propriété"
      >
        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
        Ajouter plus de photos
      </Button>
    </div>
  );
};

export default PropertyImages;
