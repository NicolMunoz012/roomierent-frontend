"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Home, Sparkles, Settings, MapPin, Bed, Bath, Maximize, Heart, Eye, ArrowLeft } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Property {
  id: number
  title: string
  description: string
  price: number
  type: string
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

export default function RecommendationsPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [recommendations, setRecommendations] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasPreferences, setHasPreferences] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      router.push("/login")
      return
    }
    loadRecommendations()
  }, [user, token])

  const loadRecommendations = async () => {
    if (!token) return

    setIsLoading(true)
    setError("")

    try {
      // Primero verificar si tiene preferencias
      const prefsResponse = await fetch(`${API_URL}/recommendations/preferences`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (prefsResponse.status === 204) {
        setHasPreferences(false)
        setIsLoading(false)
        return
      }

      setHasPreferences(true)

      // Obtener recomendaciones
      const response = await fetch(`${API_URL}/recommendations?limit=12`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      console.log("📥 Status recomendaciones:", response.status)

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
        console.log("✅ Recomendaciones cargadas:", data.length)
      } else {
        setError("Error al cargar recomendaciones")
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RoomieRent
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Panel
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recomendaciones con IA
              </h1>
              <p className="text-gray-600 mt-1">
                Propiedades personalizadas según tus preferencias
              </p>
            </div>
          </div>
        </div>

        {/* Sin preferencias */}
        {!hasPreferences && !isLoading && (
          <div className="bg-white/90 backdrop-blur-md p-12 rounded-2xl shadow-lg border border-purple-200 text-center">
            <div className="h-20 w-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Configura tus Preferencias
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Para recibir recomendaciones personalizadas con inteligencia artificial, 
              primero necesitas configurar tus preferencias.
            </p>
            <button
              onClick={() => router.push("/preferences")}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Settings className="h-5 w-5" />
              Configurar Ahora
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando recomendaciones con IA...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Recomendaciones */}
        {hasPreferences && !isLoading && recommendations.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-purple-600">{recommendations.length}</span> propiedades recomendadas para ti
              </p>
              <button
                onClick={() => router.push("/preferences")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                Ajustar Preferencias
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      IA
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        {translateType(property.type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPrice(property.price)}
                        <span className="text-sm font-normal text-gray-500">/mes</span>
                      </p>
                      <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {property.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {property.favoriteCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Sin resultados */}
        {hasPreferences && !isLoading && recommendations.length === 0 && (
          <div className="bg-white/90 backdrop-blur-md p-12 rounded-2xl shadow-lg border border-blue-100 text-center">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No hay recomendaciones disponibles
            </h2>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus preferencias para obtener mejores resultados
            </p>
            <button
              onClick={() => router.push("/preferences")}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Settings className="h-5 w-5" />
              Ajustar Preferencias
            </button>
          </div>
        )}
      </main>
    </div>
  )
}