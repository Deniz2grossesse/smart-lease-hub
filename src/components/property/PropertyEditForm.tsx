
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PropertyEditFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PropertyEditForm = ({ formData, onChange, onSelectChange, onImageChange, onSave, onCancel }: PropertyEditFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={onChange} 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="property_type">Type de bien</Label>
          <Select 
            value={formData.property_type} 
            onValueChange={(value) => onSelectChange("property_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Appartement</SelectItem>
              <SelectItem value="house">Maison</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Adresse</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={onChange} 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">Ville</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={onChange} 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input 
            id="postal_code" 
            name="postal_code" 
            value={formData.postal_code} 
            onChange={onChange} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="rooms">Nombre de pièces</Label>
          <Input 
            id="rooms" 
            name="rooms" 
            type="number" 
            min="1" 
            value={formData.rooms} 
            onChange={onChange} 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="area">Surface (m²)</Label>
          <Input 
            id="area" 
            name="area" 
            type="number" 
            min="1" 
            value={formData.area} 
            onChange={onChange} 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Loyer (€)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            min="1" 
            value={formData.price} 
            onChange={onChange} 
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={onChange} 
          placeholder="Décrivez votre bien immobilier..."
        />
      </div>
      <div className="grid gap-2">
        <Label>Disponibilité</Label>
        <Select 
          value={formData.is_available.toString()} 
          onValueChange={(value) => onSelectChange("is_available", value === "true")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Disponible</SelectItem>
            <SelectItem value="false">Loué</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="images">Ajouter des photos</Label>
        <Input 
          id="images" 
          type="file" 
          multiple 
          accept="image/*"
          onChange={onImageChange} 
        />
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default PropertyEditForm;
