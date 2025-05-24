
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, PropertyFormData } from '@/lib/services/propertyService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PropertyForm from '@/components/forms/PropertyForm';

const OwnerPropertyNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (propertyData: PropertyFormData) => {
    setIsLoading(true);

    try {
      await createProperty(propertyData);
      
      toast({
        title: "Succès",
        description: "Votre bien immobilier a été ajouté avec succès",
      });
      
      navigate('/owner/properties');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le bien",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/properties');
  };

  return (
    <PropertyForm
      title="Ajouter un nouveau bien"
      submitButtonText="Créer le bien"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      showImageUpload={true}
    />
  );
};

export default OwnerPropertyNew;
