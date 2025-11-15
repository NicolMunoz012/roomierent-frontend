// components/recommendations/RecommendationsList.tsx
import { PropertyResponse } from "@/lib/types/recommendations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home } from "lucide-react";
import PropertyCard from "./PropertyCard";

interface RecommendationsListProps {
  properties: PropertyResponse[];
  onViewSimilar: (propertyId: number) => void;
}

export default function RecommendationsList({ 
  properties, 
  onViewSimilar 
}: RecommendationsListProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <Alert className="max-w-md">
          <Home className="h-4 w-4" />
          <AlertTitle>No hay recomendaciones disponibles</AlertTitle>
          <AlertDescription>
            Configura tus preferencias para recibir recomendaciones personalizadas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onViewSimilar={onViewSimilar}
        />
      ))}
    </div>
  );
}