"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "@/lib/role-guard"
import { useAuth, getAuthHeaders } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Search, Heart, MapPin, Sparkles, MessageSquare, User, TrendingUp, Settings } from "lucide-react"

export default function TenantDashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [savedProperties, setSavedProperties] = useState<any[]>([])
  const [viewedProperties, setViewedProperties] = useState(0)
  const [favoritesError, setFavoritesError] = useState<string | null>(null)

 useEffect(() => {
   if (!token) return;

  const fetchFavorites = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/ids`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        }
      );

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        setFavoritesError("No pudimos obtener tus favoritos. Intenta nuevamente.");
        return;
      }

      const ids = await res.json();
      setSavedProperties(ids || []);
      setFavoritesError(null);
    } catch (error) {
      setFavoritesError("Ocurrió un error al conectar con el servidor.");
    }
  };

  fetchFavorites();
}, [token]);

  return (
    <RoleGuard allowedRoles={["TENANT"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-serif text-2xl font-bold">RoomieRent</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Arrendatario
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
          {favoritesError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{favoritesError}</p>
            </div>
          )}
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Encuentra tu Hogar Perfecto
            </h1>
            <p className="text-muted-foreground text-lg">
              Explora propiedades personalizadas según tus preferencias
            </p>
          </div>

          {/* AI Recommendation Banner - DESTACADO */}
          <Card className="mb-8 border-2 border-purple-300 shadow-lg bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Recomendaciones con IA</CardTitle>
                  <CardDescription className="text-base">
                    Obtén recomendaciones basadas en inteligencia artificial. 
                    Completa tu perfil para recibir sugerencias de propiedades personalizadas según tus preferencias y presupuesto.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                  size="lg"
                  asChild
                >
                  <Link href="/preferences">
                    <Settings className="h-5 w-5 mr-2" />
                    Configurar Preferencias
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  asChild
                >
                  <Link href="/recommendations">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Ver Recomendaciones
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  ⚡ Toma menos de 2 minutos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Propiedades Guardadas</p>
                    <p className="text-3xl font-bold">{savedProperties.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Favoritos activos</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-7 w-7 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Propiedades Vistas</p>
                    <p className="text-3xl font-bold">{viewedProperties}</p>
                    <p className="text-xs text-muted-foreground mt-1">Últimos 30 días</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mensajes</p>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Sin mensajes nuevos</p>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Explorar Propiedades</CardTitle>
                  <CardDescription>Navega por todos los inmuebles disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/properties">
                      Comenzar Búsqueda
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-purple-900">Recomendaciones IA</CardTitle>
                  <CardDescription>Propiedades perfectas para ti</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100" 
                    size="lg"
                    asChild
                  >
                    <Link href="/recommendations">
                      Ver Sugerencias
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-red-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Mis Favoritos</CardTitle>
                  <CardDescription>Propiedades que has guardado</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    asChild
                  >
                    <Link href="/properties?filter=favorites">
                      Ver Guardados ({savedProperties.length})
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Saved Properties Section */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Tus Favoritos</CardTitle>
                  <CardDescription>Propiedades que has guardado para revisar más tarde</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/properties">
                    Explorar Más
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Aquí irán las propiedades guardadas cuando las tengamos */}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="h-20 w-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aún no tienes favoritos</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Comienza a explorar propiedades y guarda tus favoritas para revisarlas después
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/properties">
                      <Search className="h-5 w-5 mr-2" />
                      Explorar Propiedades
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