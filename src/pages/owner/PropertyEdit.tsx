
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateProperty, deleteProperty } from '@/lib/services/propertyService';
import { validatePropertyOwnership } from '@/lib/services/ownershipValidation';
import PropertyEditForm from '@/components/property/PropertyEditForm';
import PropertyImages from '@/components/property/PropertyImages';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-messages';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const OwnerPropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (id && user) {
      fetchProperty();
    } else if (!user) {
      setError("Authentification requise");
      setIsLoading(false);
    }
  }, [id, user]);

  const fetchProperty = async () => {
    if (!id || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Vérification de la propriété du bien
      const { isOwner } = await validatePropertyOwnership(id, user.id);
      
      if (!isOwner) {
        setError("Vous n'êtes pas autorisé à modifier cette propriété");
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur chargement propriété:', error);
        if (error.code === 'PGRST116') {
          setError("Cette propriété n'existe pas");
        } else {
          setError("Erreur lors du chargement de la propriété");
        }
        return;
      }

      setProperty(data);
      setFormData({
        title: data.title,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        property_type: data.property_type,
        rooms: data.rooms,
        area: data.area,
        price: data.price,
        description: data.description || '',
        is_available: data.is_available
      });

    } catch (error) {
      console.error('Erreur:', error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'rooms' || name === 'area' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(files);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setIsSaving(true);
      
      const updateData = { ...formData };
      if (newImages.length > 0) {
        updateData.images = newImages;
      }

      await updateProperty(id, updateData);
      navigate('/owner/properties');
      
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      const success = await deleteProperty(id);
      
      if (success) {
        navigate('/owner/properties');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageDeleted = (imageId: string) => {
    setProperty((prev: any) => ({
      ...prev,
      property_images: prev.property_images.filter((img: any) => img.id !== imageId)
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <ErrorMessage
          type="auth"
          message="Veuillez vous connecter pour accéder à cette page"
          showRetry={false}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-lg">Chargement de la propriété...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/owner/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes biens
        </Button>
        <ErrorMessage
          type={error.includes("autorisé") ? "permission" : error.includes("existe") ? "not-found" : "server"}
          message={error}
          onRetry={() => fetchProperty()}
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/owner/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes biens
        </Button>
        <ErrorMessage
          type="not-found"
          message="Cette propriété est introuvable"
          showRetry={false}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/owner/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes biens
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Modifier {property.title}</h1>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette propriété ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. La propriété "{property.title}" sera définitivement supprimée de votre portefeuille, ainsi que toutes ses images et candidatures associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la propriété</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyEditForm
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onImageChange={handleImageChange}
              onSave={handleSave}
              onCancel={() => navigate('/owner/properties')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images de la propriété</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyImages
              images={property.property_images || []}
              propertyId={property.id}
              onImageDeleted={handleImageDeleted}
              onEditClick={() => {
                // Scroll vers le formulaire d'ajout d'images
                const imageInput = document.querySelector('input[type="file"]') as HTMLElement;
                imageInput?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerPropertyEdit;
