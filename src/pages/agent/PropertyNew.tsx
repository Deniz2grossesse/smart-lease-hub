
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, PropertyFormData } from '@/lib/services/propertyService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PropertyForm from '@/components/forms/PropertyForm';
import AuthGuard from '@/components/auth/AuthGuard';

const PropertyNew = () => {
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

  const handleSubmit = async (formData: PropertyFormData) => {
    setIsLoading(true);

    try {
      await createProperty(formData);
      toast({
        title: "Succès",
        description: "La propriété a été créée avec succès.",
      });
      navigate('/agent/properties');
    } catch (error) {
      // Error is already handled in createProperty service
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/agent/properties');
  };

  return (
    <AuthGuard requiredUserTypes={['agent']}>
      <PropertyForm
        title="Nouvelle Propriété"
        submitButtonText="Créer la propriété"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        showImageUpload={true}
      />
    </AuthGuard>
  );
};

export default PropertyNew;
