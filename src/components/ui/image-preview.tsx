
import React, { useState } from 'react';
import { X, Eye, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface ImagePreviewProps {
  images: File[];
  onRemove: (index: number) => void;
  maxImages?: number;
  onAddMore?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  maxImages = 10,
  onAddMore
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (images.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-gray-200 p-6 mb-4">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune image sélectionnée
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Ajoutez des photos pour permettre aux visiteurs de mieux découvrir votre propriété.
          </p>
          {onAddMore && (
            <Button onClick={onAddMore} className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Ajouter des images
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Images sélectionnées ({images.length}/{maxImages})
        </h3>
        {images.length < maxImages && onAddMore && (
          <Button variant="outline" size="sm" onClick={onAddMore}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const imageUrl = createImageUrl(image);
          return (
            <div key={index} className="relative group">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedImage(imageUrl)}
                            aria-label={`Agrandir l'image ${index + 1}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img 
                            src={selectedImage || imageUrl}
                            alt={`Preview ${index + 1} en grand format`}
                            className="w-full h-auto max-h-[80vh] object-contain"
                          />
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemove(index)}
                        aria-label={`Supprimer l'image ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badge image principale */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Image principale
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Informations sur le fichier */}
                <CardContent className="p-2">
                  <p className="text-xs text-gray-600 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagePreview;
