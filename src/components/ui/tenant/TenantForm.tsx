import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Assurez-vous que le chemin est correct
import { PersonalPage, ProfessionalPage, GuarantorPage } from "@/components/ui/tenant/TenantFormPages"; // Assurez-vous que le chemin est correct
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const TenantForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);


  // Dummy data
  const [tenantFormDataPersonnal, setTenantFormDataPersonnal] = useState({
    name: '',
    lastname: '',
    dateOfBirth: '',
    address: '',
    idCard: null,
    rentReceipts: null,
    residenceCertificate: null,
    propertyTax: null
  });

  const [tenantFormDataProfessionnal, setTenantFormDataProfessionnal] = useState({
    situation: '',
    otherSituation: '',
    lastPaySlips: null,
    taxAssessmentNotice: null,
    employementContract: null,
    kbisCertificate: null,
    retirementCertificate: null,
  });

  const [tenantFormDataGuarantor, setTenantFormDataGuarantor] = useState({
    cardId: null,
    lastPaySlips: null,
    residenceCertificate: null,
    visaleCertificate: null,
  });

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e, setState) => {
    const { name, files } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleCheckboxChange = (checked) => {
    setIsCheckboxChecked(checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCheckboxChecked) {
      console.log('Formulaire soumis');
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return <PersonalPage formData={{ ...tenantFormDataPersonnal, setPersonal: setTenantFormDataPersonnal }} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />;
      case 2:
        return <ProfessionalPage formData={{ ...tenantFormDataProfessionnal, setProfessional: setTenantFormDataProfessionnal }} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />;
      case 3:
        return <GuarantorPage formData={{ ...tenantFormDataGuarantor, setGuarantor: setTenantFormDataGuarantor }} handleFileChange={handleFileChange} />;
      default:
        return null;
    }
  };

  return (
    <Card>

      <CardHeader>
        <CardTitle>Formulaire de candidatures</CardTitle>
        <CardDescription>Veuillez remplir les informations suivantes.</CardDescription>
      </CardHeader>

      <CardContent>
        {renderPageContent()}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevious} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 1} href="#" onClick={() => setCurrentPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 2} href="#" onClick={() => setCurrentPage(2)}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 3} href="#" onClick={() => setCurrentPage(3)}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex">
          <Checkbox id="checkbox" className="mr-3" onChange={handleCheckboxChange} />
          <Label htmlFor="checkbox">En soumettant ma candidature, j'affirme avoir lu les conditions d'utilisations et la politique des données privées</Label>
        </div>

      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={!isCheckboxChecked}>Soumettre</Button>
      </CardFooter>
    </Card>
  );
};

export default TenantForm;