"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Heart, MapPin, Bed, Bath, Maximize, ArrowLeft, Building2 } from "lucide-react"
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
  const { user, token } = useAuth()  // ✅ Agregar token
  const [favorites, setFavorites] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      if (!token) return  // ✅ Verificar token
      try {
        const data = await getFavorites(token)  // ✅ Pasar token
        setFavorites(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [token])  // ✅ Dependencia en token

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(price)

  const handleRemove = async (propertyId: number) => {
    if (!token) return  // ✅ Verificar token
    try {
      await removeFavorite(propertyId, token)  // ✅ Pasar token
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId))
      toast({ title: "Eliminado de favoritos" })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo eliminar" })
    }
  }

  const translateType = (type: string) => {
    const types: Record<string, string> = {
      'APARTMENT': 'Apartamento',
      'HOUSE': 'Casa',
      'STUDIO': 'Estudio',
      'ROOM': 'Habitación',
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/properties" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              RoomieRent
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600">
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explorar
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-purple-50 hover:text-purple-600">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Tus Favoritos
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Propiedades que has guardado para revisar más tarde
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando favoritos...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-24 w-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Aún no tienes favoritos</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Explora propiedades y guarda tus favoritas haciendo clic en el corazón ❤️
            </p>
            <Button size="lg" asChild className="shadow-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              <Link href="/properties">
                <Building2 className="h-5 w-5 mr-2" />
                Explorar Propiedades
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-2xl hover:shadow-red-100/50 transition-all cursor-pointer group h-full border-2 hover:border-red-200 hover:scale-[1.02] bg-gradient-to-br from-white to-red-50/30">
                <div className="relative h-56 overflow-hidden">
                  <Link href={`/properties/${property.id}`}>
                    <img 
                      src={property.imageUrls[0] || "/placeholder.svg"} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </Link>
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      {translateType(property.type)}
                    </span>
                  </div>
                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    onClick={() => handleRemove(property.id)}
                    aria-label="Quitar de favoritos"
                  >
                    <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                  </button>
                </div>
                
                <CardContent className="p-6">
                  <Link href={`/properties/${property.id}`}>
                    <h3 className="font-semibold text-lg mb-3 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-red-500" />
                      <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                    </div>
                    
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground pb-4 mb-4 border-b border-red-100">
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg">
                        <Bed className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-lg">
                        <Bath className="h-4 w-4 text-pink-600" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg">
                        <Maximize className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{property.area}m²</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full border-red-200 hover:bg-red-50 hover:text-red-600">
                      Ver Detalles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}