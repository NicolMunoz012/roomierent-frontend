"use client"

import { use, useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Check, Phone, Mail, User, Home, Heart, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites"

const API_URL = "http://localhost:8080/api/properties"

interface Property {
  id: number
  title: string
  description: string
  price: number
  type: string
  status: string
  address: string
  city: string
  neighborhood: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  imageUrls: string[]
  ownerId: number
  ownerName: string
  ownerEmail: string
  viewCount: number
  favoriteCount: number
  createdAt: string
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params con React.use()
  const { id } = use(params)

  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFav, setIsFav] = useState<boolean>(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadProperty()
  }, [id])

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!user?.email || !id) return
      try {
        const fav = await isFavorite(Number(id), user.email)
        setIsFav(fav)
      } catch (e) {
        // ignore
      }
    }
    loadFavoriteStatus()
  }, [user, id])

  const loadProperty = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}`)

      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        console.log("✅ Propiedad cargada:", data)
      } else if (response.status === 404) {
        notFound()
      } else {
        console.error("❌ Error cargando propiedad:", response.status)
      }
    } catch (error) {
      console.error("❌ Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user?.email || !property) {
      toast({ title: "Debes iniciar sesión", description: "Inicia sesión para usar favoritos" })
      return
    }
    try {
      if (isFav) {
        const res = await removeFavorite(property.id, user.email)
        setIsFav(false)
        setProperty({ ...property, favoriteCount: res.favoriteCount })
        toast({ title: "Eliminado de favoritos" })
      } else {
        const res = await addFavorite(property.id, user.email)
        setIsFav(true)
        setProperty({ ...property, favoriteCount: res.favoriteCount })
        toast({ title: "¡Agregado a tus favoritos!" })
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo actualizar favoritos" })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const typeColors: Record<string, string> = {
    CASA: "bg-blue-500/10 text-blue-700",
    APARTAMENTO: "bg-green-500/10 text-green-700",
    HABITACION: "bg-purple-500/10 text-purple-700",
    ESTUDIO: "bg-orange-500/10 text-orange-700",
    BODEGA: "bg-gray-500/10 text-gray-700",
  }

  const typeLabels: Record<string, string> = {
    CASA: "Casa",
    APARTAMENTO: "Apartamento",
    HABITACION: "Habitación",
    ESTUDIO: "Estudio",
    BODEGA: "Bodega",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/properties" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-serif text-2xl font-bold">RentSpace</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando propiedad...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/properties" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">RentSpace</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4 bg-muted">
              <img
                src={property.imageUrls[currentImageIndex] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-4 right-4 ${typeColors[property.type] || "bg-gray-500/10 text-gray-700"}`}>
                {typeLabels[property.type] || property.type}
              </Badge>
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold">
                {property.status}
              </div>
            </div>

            {/* Image Thumbnails */}
            {property.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {property.imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 rounded overflow-hidden transition-all ${
                      currentImageIndex === idx ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {property.address}, {property.neighborhood}, {property.city}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{property.viewCount} vistas</span>
                </div>
                <button className="flex items-center gap-1" onClick={toggleFavorite} aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}>
                  <Heart className={`h-4 w-4 ${isFav ? "text-red-600 fill-red-600" : ""}`} />
                  <span>{property.favoriteCount} favoritos</span>
                </button>
              </div>

              {/* Features */}
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg">
                    <strong>{property.bedrooms}</strong> Habitaciones
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg">
                    <strong>{property.bathrooms}</strong> Baños
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg">
                    <strong>{property.area}</strong> m²
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-semibold text-2xl mb-4">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="font-semibold text-2xl mb-4">Servicios y Comodidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <Card className="sticky top-24 mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(property.price)}
                    <span className="text-lg font-normal text-muted-foreground">/mes</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Button className="w-full" size="lg" asChild>
                    <a href={`mailto:${property.ownerEmail}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contactar por Email
                    </a>
                  </Button>
                  <Button className="w-full" size="lg" variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Guardar en Favoritos
                  </Button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Detalles de la Propiedad</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium">{typeLabels[property.type] || property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <span className="font-medium">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ciudad</span>
                      <span className="font-medium">{property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barrio</span>
                      <span className="font-medium">{property.neighborhood}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Habitaciones</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Baños</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Área</span>
                      <span className="font-medium">{property.area} m²</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Información del Propietario</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Propietario</p>
                      <p className="font-medium">{property.ownerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{property.ownerEmail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}