
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEOHead = ({ 
  title = "Gestion Immobilière - Plateforme de gestion de biens",
  description = "Plateforme complète de gestion immobilière pour propriétaires, agents et locataires. Gérez vos biens, candidatures et paiements en toute simplicité.",
  keywords = "gestion immobilière, propriétaire, agent immobilier, locataire, location, bien immobilier",
  ogImage = "/placeholder.svg",
  canonical
}: SEOHeadProps) => {
  const fullTitle = title.includes("Gestion Immobilière") ? title : `${title} | Gestion Immobilière`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Gestion Immobilière" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Accessibility */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language */}
      <html lang="fr" />
    </Helmet>
  );
};

export default SEOHead;
