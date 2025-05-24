
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, PropertyFormData } from '@/lib/services/propertyService';
import { toast } from '@/hooks/use-toast';
import PropertyForm from '@/components/forms/PropertyForm';

const OwnerPropertyNew = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
      // Error is already handled in createProperty service
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
