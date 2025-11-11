"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "@/lib/role-guard"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Plus, Building2, BarChart3, MessageSquare, Settings, MapPin, Bed, Bath, Maximize, TrendingUp, Eye } from "lucide-react"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/properties`

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

export default function LandlordDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/my-properties`, {
        headers: {
          "Authorization": user?.email || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data)
        console.log("✅ Propiedades cargadas:", data.length)
      } else {
        console.error("❌ Error cargando propiedades:", response.status)
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

  const totalViews = properties.reduce((sum, p) => sum + p.viewCount, 0)
  const totalFavorites = properties.reduce((sum, p) => sum + p.favoriteCount, 0)

  return (
    <RoleGuard allowedRoles={["LANDLORD"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-serif text-2xl font-bold">RentSpace</span>
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                  Propietario
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </Button>
                <div className="hidden md:block text-sm text-muted-foreground">
                  Hola, <strong className="text-foreground">{user?.name}</strong>
                </div>
                <Button onClick={logout} variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Administra tus propiedades y haz crecer tu negocio
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tus Propiedades</p>
                    <p className="text-3xl font-bold">{properties.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Inmuebles publicados</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Visualizaciones</p>
                    <p className="text-3xl font-bold">{totalViews}</p>
                    <p className="text-xs text-muted-foreground mt-1">Vistas totales</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Eye className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Favoritos</p>
                    <p className="text-3xl font-bold">{totalFavorites}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total de favoritos</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-emerald-300">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Nueva Propiedad</CardTitle>
                  <CardDescription>Publica un nuevo inmueble en renta</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/add-property">Crear Publicación</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Mis Propiedades</CardTitle>
                  <CardDescription>Ver y gestionar tus publicaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/properties">Ver Todas</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-purple-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Administra tu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/settings">Abrir Ajustes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Properties List */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Tus Propiedades</CardTitle>
                  <CardDescription>Inmuebles que has publicado en RentSpace</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Propiedad
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando propiedades...</p>
                </div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg hover:scale-105 transition-all">
                      <div className="relative h-48">
                        <img
                          src={property.imageUrls[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                          {property.status}
                        </span>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-3">
                          {formatPrice(property.price)}
                          <span className="text-sm font-normal text-muted-foreground">/mes</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{property.viewCount} vistas</span>
                          </div>
                          <span>•</span>
                          <span>❤️ {property.favoriteCount} favoritos</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="h-20 w-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aún no tienes propiedades</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Comienza publicando tu primera propiedad
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/add-property">
                      <Plus className="h-5 w-5 mr-2" />
                      Agregar Tu Primera Propiedad
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </RoleGuard>
  )
}