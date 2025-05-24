
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

interface NoDataFallbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: "plus" | "search";
}

const NoDataFallback = ({ 
  title = "Aucune donnée trouvée", 
  message = "Il n'y a rien à afficher pour le moment",
  actionLabel,
  onAction,
  icon = "search"
}: NoDataFallbackProps) => {
  const IconComponent = icon === "plus" ? Plus : Search;
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <IconComponent className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="w-full">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NoDataFallback;
