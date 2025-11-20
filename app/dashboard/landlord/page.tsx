"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, getAuthHeaders } from "@/lib/auth-context"
import { Home, Plus, Building2, Eye, Heart, MapPin, Bed, Bath, Maximize, Settings, LogOut, ArrowRight, Sparkles, TrendingUp } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  imageUrls: string[]
  viewCount: number
  favoriteCount: number
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.push("/login")
      return
    }

    if (user.role === "TENANT") {
      router.push("/dashboard/tenant")
      return
    }

    if (user.role === "LANDLORD") {
      loadMyProperties()
    }
  }, [user, token, router])

  const loadMyProperties = async () => {
  if (!token) return

  setIsLoading(true)
  try {
    console.log("📤 Obteniendo mis propiedades...")
    console.log("🔑 Token:", token?.substring(0, 30) + "...")

    const response = await fetch(`${API_URL}/properties/my-properties`, {
      method: "GET",
      headers: getAuthHeaders(token), 
    })

      console.log("📥 Status:", response.status)

      if (response.ok) {
        const data = await response.json()
        setProperties(data)
        console.log("✅ Propiedades cargadas:", data.length)
      } else {
        console.error("❌ Error:", response.status)
      }
    } catch (error) {
      console.error("❌ Error:", error)
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

  const totalViews = properties.reduce((sum, p) => sum + p.viewCount, 0)
  const totalFavorites = properties.reduce((sum, p) => sum + p.favoriteCount, 0)

  if (!user || user.role !== "LANDLORD") return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RoomieRent
              </span>
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                Propietario
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-gray-600">
                Hola, <strong className="text-gray-900">{user.name}</strong>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ¡Bienvenido, {user.name}!
          </h1>
          <p className="text-gray-600 text-lg">
            Administra tus propiedades y haz crecer tu negocio inmobiliario
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tus Propiedades</p>
                <p className="text-4xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-xs text-gray-500 mt-1">Inmuebles publicados</p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Visualizaciones</p>
                <p className="text-4xl font-bold text-gray-900">{totalViews}</p>
                <p className="text-xs text-gray-500 mt-1">Vistas totales</p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <Eye className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Favoritos</p>
                <p className="text-4xl font-bold text-gray-900">{totalFavorites}</p>
                <p className="text-xs text-gray-500 mt-1">Total de favoritos</p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push("/add-property")}
              className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl hover:scale-105 transition-all text-left group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nueva Propiedad</h3>
              <p className="text-sm text-gray-600 mb-4">
                Publica un nuevo inmueble en renta
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                Crear Publicación
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => router.push("/properties")}
              className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all text-left group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ver Todas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Explora el catálogo completo
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                Ir al Catálogo
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:scale-105 transition-all text-left group"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600 mb-4">
                Administra tu perfil y preferencias
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                Abrir Ajustes
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tus Propiedades</h2>
              <p className="text-gray-600 mt-1">Inmuebles que has publicado en RoomieRent</p>
            </div>
            <button
              onClick={() => router.push("/add-property")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              Agregar Propiedad
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
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
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {property.status || 'AVAILABLE'}
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
                      <MapPin className="h-4 w-4 flex-shrink-0" />
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
                      <p className="text-2xl font-bold text-emerald-600">
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
          ) : (
            <div className="text-center py-16">
              <div className="h-20 w-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes propiedades</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Comienza publicando tu primera propiedad y llega a miles de inquilinos potenciales
              </p>
              <button
                onClick={() => router.push("/add-property")}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5" />
                Agregar Tu Primera Propiedad
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}