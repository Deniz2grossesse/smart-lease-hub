
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateProperty } from '@/lib/services/propertyService';
import { validateAgentAccess } from '@/lib/services/ownershipValidation';
import PropertyEditForm from '@/components/property/PropertyEditForm';
import PropertyImages from '@/components/property/PropertyImages';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-messages';

const AgentPropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [hasAgentAccess, setHasAgentAccess] = useState(false);

  useEffect(() => {
    if (id && user) {
      checkAccess();
    } else if (!user) {
      setError("Authentification requise");
      setIsLoading(false);
    }
  }, [id, user]);

  const checkAccess = async () => {
    if (!user) return;
    
    try {
      // Vérifier si l'utilisateur est un agent
      const { hasAccess } = await validateAgentAccess(user.id);
      
      if (!hasAccess) {
        setError("Accès réservé aux agents immobiliers");
        setIsLoading(false);
        return;
      }
      
      setHasAgentAccess(true);
      await fetchProperty();
      
    } catch (error) {
      console.error('Erreur vérification accès:', error);
      setError("Erreur lors de la vérification des droits d'accès");
      setIsLoading(false);
    }
  };

  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          profiles!properties_owner_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
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

    // Note: Les agents peuvent voir et éditer les propriétés mais pas les supprimer
    // La fonction updateProperty vérifiera les droits de propriété
    toast({
      title: "Fonctionnalité restreinte",
      description: "En tant qu'agent, vous ne pouvez que consulter les propriétés. Seuls les propriétaires peuvent les modifier.",
      variant: "destructive"
    });
  };

  const handleImageDeleted = (imageId: string) => {
    toast({
      title: "Action non autorisée",
      description: "Seuls les propriétaires peuvent supprimer les images",
      variant: "destructive"
    });
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
          <span className="ml-3 text-lg">Vérification des droits d'accès...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
        </Button>
        <ErrorMessage
          type={error.includes("réservé") ? "permission" : error.includes("existe") ? "not-found" : "server"}
          message={error}
          onRetry={() => checkAccess()}
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
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
          onClick={() => navigate('/agent/properties')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
        </Button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground mt-1">
              Mode consultation - Propriétaire: {property.profiles?.first_name} {property.profiles?.last_name}
            </p>
          </div>
          <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
            <Lock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Lecture seule</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la propriété</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Version en lecture seule pour les agents */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Titre</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type de bien</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">
                    {formData.property_type === 'apartment' ? 'Appartement' :
                     formData.property_type === 'house' ? 'Maison' :
                     formData.property_type === 'studio' ? 'Studio' : 'Loft'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Adresse</label>
                <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.address}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ville</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Code postal</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.postal_code}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Pièces</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.rooms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Surface (m²)</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.area}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Loyer (€)</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{formData.price}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">
                  {formData.description || 'Aucune description'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Disponibilité</label>
                <p className="mt-1 p-2 bg-gray-50 rounded border">
                  {formData.is_available ? 'Disponible' : 'Loué'}
                </p>
              </div>
            </div>
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
                toast({
                  title: "Action non autorisée",
                  description: "Seuls les propriétaires peuvent ajouter des images",
                  variant: "destructive"
                });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPropertyEdit;
