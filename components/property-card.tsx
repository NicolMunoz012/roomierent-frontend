import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/properties-data"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"
import Image from "next/image"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const typeColors = {
    house: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    apartment: "bg-green-500/10 text-green-700 dark:text-green-400",
    room: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={property.images?.[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
          <Badge className={`absolute top-3 right-3 ${typeColors[property.type]}`}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-balance">{property.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.neighborhood}, {property.city}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              {property.area} m²
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary">
            ${property.price.toLocaleString()} COP
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
