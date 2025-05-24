
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Upload, Plus, ImageIcon, Expand } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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

const PropertyImages: React.FC<PropertyImagesProps> = ({
  images,
  propertyId,
  onImageDeleted,
  onEditClick
}) => {
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImageId(imageId);
    
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      onImageDeleted(imageId);
      
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès de la propriété"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer cette image",
        variant: "destructive"
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const EmptyImagesState = () => (
    <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-gray-200 p-6 mb-4">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune image disponible
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Cette propriété n'a pas encore d'images. Ajoutez des photos pour permettre aux visiteurs de mieux la découvrir.
        </p>
        <Button onClick={onEditClick} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter des images
        </Button>
      </CardContent>
    </Card>
  );

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Photos de la propriété</h3>
          <Button variant="outline" size="sm" onClick={onEditClick}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <EmptyImagesState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Photos de la propriété ({images.length})
        </h3>
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {images.map((image, index) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative group">
              <img 
                src={image.url} 
                alt={`Photo ${index + 1} de la propriété`}
                className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                  target.alt = 'Image non disponible';
                }}
              />
              
              {/* Overlay avec actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                        aria-label={`Agrandir l'image ${index + 1}`}
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <img 
                        src={selectedImage?.url || image.url}
                        alt={`Photo ${index + 1} de la propriété en grand format`}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingImageId === image.id}
                        aria-label={`Supprimer l'image ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. L'image sera définitivement supprimée de cette propriété.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Badge image principale */}
              {image.is_primary && (
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Image principale
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;
