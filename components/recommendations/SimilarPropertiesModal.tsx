// components/recommendations/SimilarPropertiesModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyResponse } from '@/lib/types/recommendations';
import PropertyCard from './PropertyCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SimilarPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyResponse[];
  isLoading: boolean;
  error: string | null;
  onViewSimilar: (propertyId: number) => void;
}

export default function SimilarPropertiesModal({
  isOpen,
  onClose,
  properties,
  isLoading,
  error,
  onViewSimilar,
}: SimilarPropertiesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Propiedades Similares</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading && <LoadingSkeleton />}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron propiedades similares.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewSimilar={onViewSimilar}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}