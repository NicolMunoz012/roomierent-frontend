// components/recommendations/PropertyCard.tsx
import { PropertyResponse, PropertyType } from "@/lib/types/recommendations";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Eye } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property: PropertyResponse;
  onViewSimilar: (propertyId: number) => void;
}

const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.HOUSE]: "Casa",
  [PropertyType.APARTMENT]: "Apartamento",
  [PropertyType.ROOM]: "Habitación",
  [PropertyType.STUDIO]: "Estudio",
};

export default function PropertyCard({ property, onViewSimilar }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const mainImage = property.imageUrls?.[0] || '/placeholder-property.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
          }}
        />
        
        {/* Badge de tipo */}
        <Badge className="absolute top-3 left-3">
          {propertyTypeLabels[property.type]}
        </Badge>

        {/* View count */}
        {property.viewCount > 0 && (
          <Badge variant="secondary" className="absolute top-3 right-3 gap-1">
            <Eye className="h-3 w-3" />
            {property.viewCount}
          </Badge>
        )}
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </p>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms}
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {property.area}m²
          </div>
        </div>

        {/* Amenities (max 3) */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
            <span className="text-sm font-normal text-muted-foreground">/mes</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/properties/${property.id}`}>
            Ver detalles
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => onViewSimilar(property.id)}
          className="flex-1"
        >
          Similares
        </Button>
      </CardFooter>
    </Card>
  );
}