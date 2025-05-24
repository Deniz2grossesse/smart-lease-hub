
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Mail, Phone, Briefcase, Euro } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { submitPublicApplication, PublicApplicationData } from '@/lib/services/publicApplicationService';

interface PublicApplicationFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess: () => void;
}

const PublicApplicationForm: React.FC<PublicApplicationFormProps> = ({
  propertyId,
  propertyTitle,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<PublicApplicationData>>({
    property_id: propertyId,
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    employment_status: '',
    monthly_income: undefined,
    current_rent: undefined,
    company: '',
    position: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidate_name || !formData.candidate_email || !formData.candidate_phone) {
      return;
    }

    setIsSubmitting(true);
    console.log('Soumission formulaire candidature publique:', formData);

    try {
      const success = await submitPublicApplication(formData as PublicApplicationData);
      
      if (success) {
        // Réinitialiser le formulaire
        setFormData({
          property_id: propertyId,
          candidate_name: '',
          candidate_email: '',
          candidate_phone: '',
          employment_status: '',
          monthly_income: undefined,
          current_rent: undefined,
          company: '',
          position: '',
          message: ''
        });
        
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur soumission candidature:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof PublicApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="h-5 w-5 mr-2" />
          Candidater pour : {propertyTitle}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Remplissez ce formulaire pour soumettre votre candidature. L'agent immobilier vous contactera rapidement.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate_name">Nom complet *</Label>
                <Input
                  id="candidate_name"
                  placeholder="Prénom Nom"
                  value={formData.candidate_name || ''}
                  onChange={(e) => updateFormData('candidate_name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="candidate_email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="candidate_email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={formData.candidate_email || ''}
                    onChange={(e) => updateFormData('candidate_email', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="candidate_phone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="candidate_phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="pl-10"
                    value={formData.candidate_phone || ''}
                    onChange={(e) => updateFormData('candidate_phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Situation professionnelle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Situation professionnelle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_status">Statut professionnel</Label>
                <Select value={formData.employment_status || ''} onValueChange={(value) => 
                  updateFormData('employment_status', value)
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Salarié(e)</SelectItem>
                    <SelectItem value="freelance">Indépendant(e)</SelectItem>
                    <SelectItem value="student">Étudiant(e)</SelectItem>
                    <SelectItem value="unemployed">Sans emploi</SelectItem>
                    <SelectItem value="retired">Retraité(e)</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="monthly_income">Revenus mensuels (€)</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="monthly_income"
                    type="number"
                    placeholder="3000"
                    className="pl-10"
                    value={formData.monthly_income || ''}
                    onChange={(e) => updateFormData('monthly_income', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Entreprise / Employeur</Label>
                <Input
                  id="company"
                  placeholder="Nom de votre entreprise"
                  value={formData.company || ''}
                  onChange={(e) => updateFormData('company', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="position">Poste occupé</Label>
                <Input
                  id="position"
                  placeholder="Votre fonction"
                  value={formData.position || ''}
                  onChange={(e) => updateFormData('position', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="current_rent">Loyer actuel (€)</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="current_rent"
                    type="number"
                    placeholder="800"
                    className="pl-10"
                    value={formData.current_rent || ''}
                    onChange={(e) => updateFormData('current_rent', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message libre */}
          <div className="space-y-2">
            <Label htmlFor="message">Message complémentaire</Label>
            <Textarea
              id="message"
              placeholder="Présentez-vous brièvement, vos motivations, votre projet de location..."
              value={formData.message || ''}
              onChange={(e) => updateFormData('message', e.target.value)}
              rows={4}
            />
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">À propos de cette candidature</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Votre candidature sera transmise directement à l'agent immobilier</li>
              <li>• Vous serez contacté(e) rapidement si votre profil correspond</li>
              <li>• Vous pouvez candidater à maximum 3 annonces par jour</li>
              <li>• Aucune inscription n'est nécessaire</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.candidate_name || !formData.candidate_email || !formData.candidate_phone}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer ma candidature
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PublicApplicationForm;
