import React from "react";
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import FileInput from '@/components/ui/input-file';
import FileInputGroup from '@/components/ui/input-file-group';
import LabelInputGroup from '@/components/ui/label-input-group';

const PersonalPage = ({ formData, handleInputChange, handleFileChange }) => (
  <div className="mb-20 mt-10">

    <h3 className="text-2xl font-semibold text-stone-600 mb-5">État civil</h3>

    <div className="p-1 w-[100%] min-w-[240px] m-auto">

      <LabelInputGroup>
        <Label htmlFor="lastname">Prénom:</Label>
        <Input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>
      <LabelInputGroup>
        <Label htmlFor="name" className="mb-2">Nom:</Label>
        <Input type="text" id="name" name="name" value={formData.name} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>
      <LabelInputGroup>
        <Label htmlFor="dateOfBirth">Date de Naissance:</Label>
        <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>

      <LabelInputGroup>
        <Label htmlFor="address">Code Postal:</Label>
        <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>
      <LabelInputGroup>
        <Label htmlFor="address">Ville:</Label>
        <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>
      <LabelInputGroup>
        <Label htmlFor="address">Complément d'adresse:</Label>
        <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
      </LabelInputGroup>

    </div>

    <FileInputGroup>
      <FileInput name="idCard" label="Carte d'Identité" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      <FileInput name="rentReceipts" label="Quittances de Loyer" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      <FileInput name="residenceCertificate" label="Certificat de Résidence" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      <FileInput name="propertyTax" label="Taxe Foncière" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
    </FileInputGroup>
  </div>
);

const ProfessionalPage = ({ formData, handleInputChange, handleFileChange }) => {
  const isSituation = (targetSituation) => formData.situation === targetSituation;

  return (
    <div className="mb-20">

      <h3 className="text-2xl font-semibold text-stone-600 mb-5">Situation Professionnelle</h3>

      <LabelInputGroup>
        <Label htmlFor="situation">Situation Professionnelle:</Label>
        <Select value={formData.situation} onValueChange={(value) => handleInputChange({ target: { name: "situation", value } }, formData.setProfessional)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une situation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CDD">CDD</SelectItem>
            <SelectItem value="CDI">CDI</SelectItem>
            <SelectItem value="étudiant">Étudiant</SelectItem>
            <SelectItem value="indépendant">Indépendant</SelectItem>
            <SelectItem value="retraité">Retraité</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </LabelInputGroup>
      {isSituation('autre') && (
        <>
          <div className="mt-5 mb-2">
            <Label htmlFor="otherSituation">Décrivez votre situation:</Label>
            <Input type="text" id="otherSituation" name="otherSituation" value={formData.otherSituation} onChange={(e) => handleInputChange(e, formData.setProfessional)} />
          </div>
          <div className="mt-5 mb-2">
            <FileInput name="otherFile" label="Autres documents à transmettre" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
          </div>
        </>
      )}

      {(isSituation('CDD') || isSituation('CDI')) && (
        <FileInputGroup>
          <FileInput name="lastPaySlips" label="3 Derniers Bulletins de Salaire" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
          <FileInput name="employementContract" label="Contrat de Travail" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </FileInputGroup>
      )}

      {isSituation('retraité') && (
        <FileInputGroup>
          <FileInput name="retirementCertificate" label="Justificatif de Pension Retraite" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </FileInputGroup>
      )}

      {isSituation('indépendant') && (
        <FileInputGroup>
          <FileInput name="kbisCertificate" label="Kbis" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
          <FileInput name="lastPaySlips" label="3 Derniers Bulletins de Salaire" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </FileInputGroup>
      )}

      {isSituation('étudiant') && (
        <div className="mt-5 mb-2">
          <FileInput name="schoolCertificate" label="Certificat de Scolarité" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
      )}
      
    </div>
  );
};

const GuarantorPage = ({ formData, handleFileChange }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const isOptionSelected = (targetOption) => selectedOption === targetOption;

  return (
    <div className="mb-20">

      <h3 className="text-2xl font-semibold text-stone-600 mb-5">Garant</h3>

      <LabelInputGroup>
        <Label htmlFor="guarantorType">Type de Garant:</Label>
        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visale">Visale</SelectItem>
            <SelectItem value="personnePhysique">Personne Physique</SelectItem>
          </SelectContent>
        </Select>
      </LabelInputGroup>

      {isOptionSelected("visale") ? (
        <LabelInputGroup>
          <FileInput name="visaleCertificate" label="Attestation Visale" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
        </LabelInputGroup>
      ) : isOptionSelected("personnePhysique") ? (
        <FileInputGroup>
          <FileInput name="cardId" label="Carte d'Identité" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
          <FileInput name="lastPaySlipsGuarantor" label="3 Derniers Bulletins de Salaire" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
          <FileInput name="residenceCertificateGuarantor" label="Certificat de Résidence" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
        </FileInputGroup>
      ) : null}
    </div>
  );
};

export { PersonalPage, ProfessionalPage, GuarantorPage };