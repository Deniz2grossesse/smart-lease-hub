import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const PersonalPage = ({ formData, handleInputChange, handleFileChange }) => (
  <div>
    <div>
      <Label htmlFor="name">Nom:</Label>
      <Input type="text" id="name" name="name" value={formData.name} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div>
      <Label htmlFor="lastname">Prénom:</Label>
      <Input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div>
      <Label htmlFor="dateOfBirth">Date de Naissance:</Label>
      <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div>
      <Label htmlFor="address">Complément d'adresse:</Label>
      <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div>
      <Label htmlFor="address">Code Postal:</Label>
      <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div>
      <Label htmlFor="address">Ville:</Label>
      <Input type="text" id="address" name="address" value={formData.address} onChange={(e) => handleInputChange(e, formData.setPersonal)} />
    </div>
    <div className="grid w-full grid-cols-4">
      <div className="m-2">
        <Label htmlFor="idCard">Carte d'Identité:</Label>
        <Input type="file" id="idCard" name="idCard" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      </div>
      <div className="m-2">
        <Label htmlFor="rentReceipts">Quittances de Loyer:</Label>
        <Input type="file" id="rentReceipts" name="rentReceipts" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      </div>
      <div className="m-2">
        <Label htmlFor="residenceCertificate">Certificat de Résidence:</Label>
        <Input type="file" id="residenceCertificate" name="residenceCertificate" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      </div>
      <div className="m-2">
        <Label htmlFor="propertyTax">Taxe Foncière:</Label>
        <Input type="file" id="propertyTax" name="propertyTax" onChange={(e) => handleFileChange(e, formData.setPersonal)} />
      </div>
    </div>
  </div>
);

const ProfessionalPage = ({ formData, handleInputChange, handleFileChange }) => (
  <div>
    <div>
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
    </div>
    {formData.situation === 'autre' && (
      <>
        <div>
          <Label htmlFor="otherSituation">Décrivez votre situation:</Label>
          <Input type="text" id="otherSituation" name="otherSituation" value={formData.otherSituation} onChange={(e) => handleInputChange(e, formData.setProfessional)} />
        </div>
        <div> 
          <Label htmlFor="otherFile">Autres documents à transmettre:</Label>
          <Input type="file" id="otherFile" name="otherFile" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
      </>
    )}
    {(formData.situation === 'CDD' || formData.situation === 'CDI') && (
      <>
        <div>
          <Label htmlFor="lastPaySlips">3 Derniers Bulletins de Salaire:</Label>
          <Input type="file" id="lastPaySlips" name="lastPaySlips" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
        <div>
          <Label htmlFor="employementContract">Contrat de Travail:</Label>
          <Input type="file" id="employementContract" name="employementContract" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
      </>
    )}
    {formData.situation === 'retraité' && (
      <div>
        <Label htmlFor="retirementCertificate">Justificatif de Pension Retraite:</Label>
        <Input type="file" id="retirementCertificate" name="retirementCertificate" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
      </div>
    )}
    {formData.situation === 'indépendant' && (
      <>
        <div>
          <Label htmlFor="kbisCertificate">Kbis:</Label>
          <Input type="file" id="kbisCertificate" name="kbisCertificate" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
        <div>
          <Label htmlFor="lastPaySlips">3 Derniers Bulletins de Salaire:</Label>
          <Input type="file" id="lastPaySlips" name="lastPaySlips" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
        </div>
      </>
    )}
    {formData.situation === 'étudiant' && (
      <div>
        <Label htmlFor="schoolCertificate">Certificat de Scolarité:</Label>
        <Input type="file" id="schoolCertificate" name="schoolCertificate" onChange={(e) => handleFileChange(e, formData.setProfessional)} />
      </div>
    )}
  </div>
);

const GuarantorPage = ({ formData, handleFileChange }) => (
  <div>
    <div>
      <Label htmlFor="cardId">Carte d'Identité:</Label>
      <Input type="file" id="cardId" name="cardId" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
    </div>
    <div>
      <Label htmlFor="lastPaySlipsGuarantor">3 Derniers Bulletins de Salaire:</Label>
      <Input type="file" id="lastPaySlipsGuarantor" name="lastPaySlips" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
    </div>
    <div>
      <Label htmlFor="residenceCertificateGuarantor">Certificat de Résidence:</Label>
      <Input type="file" id="residenceCertificateGuarantor" name="residenceCertificate" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
    </div>
    <div>
      <Label htmlFor="visaleCertificate">Attestation Visale:</Label>
      <Input type="file" id="visaleCertificate" name="visaleCertificate" onChange={(e) => handleFileChange(e, formData.setGuarantor)} />
    </div>
  </div>
);

export { PersonalPage, ProfessionalPage, GuarantorPage };