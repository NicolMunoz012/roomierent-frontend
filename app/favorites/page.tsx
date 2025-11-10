"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Heart, MapPin, Bed, Bath, Maximize, ArrowLeft } from "lucide-react"
import { getFavorites, removeFavorite } from "@/lib/favorites"
import { useToast } from "@/hooks/use-toast"

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
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  imageUrls: string[]
  ownerName: string
  viewCount: number
  favoriteCount: number
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return
      try {
        const data = await getFavorites(user.email)
        setFavorites(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)

  const handleRemove = async (propertyId: number) => {
    if (!user?.email) return
    try {
      await removeFavorite(propertyId, user.email)
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId))
      toast({ title: "Eliminado de favoritos" })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo eliminar" })
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={user ? "/properties" : "/"} className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">RentSpace</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a propiedades
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-600" /> Tus favoritos
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground">Cargando favoritos...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Aún no tienes favoritos</h2>
            <p className="text-muted-foreground mb-6">Explora propiedades y agrega algunas a tu lista</p>
            <Button asChild>
              <Link href="/properties">Ver propiedades</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all h-full">
                <div className="relative h-56 overflow-hidden">
                  <img src={property.imageUrls[0] || "/placeholder.svg"} alt={property.title} className="w-full h-full object-cover" />
                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full"
                    onClick={() => handleRemove(property.id)}
                    aria-label="Quitar de favoritos"
                  >
                    <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(property.price)}<span className="text-sm font-normal text-muted-foreground">/mes</span>
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pb-4 mb-4 border-b">
                    <div className="flex items-center gap-1"><Bed className="h-4 w-4" /><span>{property.bedrooms}</span></div>
                    <div className="flex items-center gap-1"><Bath className="h-4 w-4" /><span>{property.bathrooms}</span></div>
                    <div className="flex items-center gap-1"><Maximize className="h-4 w-4" /><span>{property.area}m²</span></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{property.favoriteCount} favoritos</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/properties/${property.id}`}>Ver detalle</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}