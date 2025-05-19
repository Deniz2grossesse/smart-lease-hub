import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/layout/Logo';

const Index = () => {
  const { signIn, signUp, user, profile, createTestUsers, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);
  
  // États pour le formulaire de connexion
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // États pour le formulaire d'inscription
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<'tenant' | 'owner' | 'agent'>('tenant');
  
  // Effet pour rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    console.log("Index page - User:", user?.id, "Profile:", profile?.type, "Loading:", loading);
    
    // Ne rediriger que si le chargement est terminé et que l'utilisateur est connecté avec un profil
    if (!loading && user && profile) {
      console.log("Redirecting to dashboard for user type:", profile.type);
      switch(profile.type) {
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'owner':
          navigate('/owner/dashboard');
          break;
        case 'agent':
          navigate('/agent/dashboard');
          break;
      }
    }
  }, [user, profile, loading, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Login submission for:", loginEmail);
      await signIn(loginEmail, loginPassword);
      // La redirection se fera automatiquement via useEffect ou via le context Auth
    } catch (error) {
      // Gestion des erreurs déjà dans le contexte Auth
      console.error("Login submission error handled in AuthContext");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await signUp(
        signupEmail,
        signupPassword,
        userType,
        firstName,
        lastName,
        phone
      );
      // Ici, après l'inscription réussie, l'utilisateur devra vérifier son e-mail
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre e-mail pour confirmer votre compte",
      });
    } catch (error) {
      // Gestion des erreurs déjà dans le contexte Auth
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTestUsers = async () => {
    setIsCreatingTestUsers(true);
    try {
      await createTestUsers();
    } finally {
      setIsCreatingTestUsers(false);
    }
  };
  
  // Show loading state if auth is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-center">e-mmoLink</h1>
          <p className="text-center text-gray-500">
            La plateforme qui connecte propriétaires, locataires et agents immobiliers
          </p>
        </div>
        
        <Card className="w-full">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>
                    Entrez vos identifiants pour accéder à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="email@exemple.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>
                    Complétez le formulaire pour vous inscrire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="email@exemple.com" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type de compte</Label>
                    <Tabs 
                      value={userType} 
                      onValueChange={(v) => setUserType(v as 'tenant' | 'owner' | 'agent')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="tenant">Locataire</TabsTrigger>
                        <TabsTrigger value="owner">Propriétaire</TabsTrigger>
                        <TabsTrigger value="agent">Agent</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Button for creating test users */}
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            onClick={handleCreateTestUsers}
            disabled={isCreatingTestUsers}
            className="text-xs"
          >
            {isCreatingTestUsers 
              ? "Création des comptes en cours..." 
              : "Créer comptes de test (agent, proprio, locataire)"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
