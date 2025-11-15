"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, MapPin, Bed, Bath, Maximize, Heart, Eye, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addFavorite, removeFavorite, getFavoriteIds } from "@/lib/favorites"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/properties`

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

export default function PropertiesPage() {
  const { user, logout } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const { toast } = useToast()

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.email) return
      try {
        const ids = await getFavoriteIds(user.email)
        setFavoriteIds(ids)
      } catch (e) {
        console.error("❌ Error cargando favoritos", e)
      }
    }
    loadFavorites()
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [properties, searchQuery, selectedType, minPrice, maxPrice])

  const loadProperties = async () => {
    try {
      const response = await fetch(API_URL)

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

  const toggleFavorite = async (propertyId: number) => {
    if (!user?.email) {
      toast({ title: "Debes iniciar sesión", description: "Inicia sesión para usar favoritos" })
      return
    }
    const isFav = favoriteIds.includes(propertyId)
    try {
      let favoriteCount: number | undefined
      if (isFav) {
        const res = await removeFavorite(propertyId, user.email)
        favoriteCount = res.favoriteCount
        setFavoriteIds((prev) => prev.filter((id) => id !== propertyId))
        toast({ title: "Eliminado de favoritos" })
      } else {
        const res = await addFavorite(propertyId, user.email)
        favoriteCount = res.favoriteCount
        setFavoriteIds((prev) => [...prev, propertyId])
        toast({ title: "¡Agregado a tus favoritos!" })
      }
      // Actualiza favoriteCount localmente
      setProperties((prev) => prev.map((p) => p.id === propertyId && favoriteCount !== undefined ? { ...p, favoriteCount } : p))
      applyFilters()
    } catch (e: any) {
      console.error(e)
      toast({ title: "Error", description: e?.message || "No se pudo actualizar favoritos" })
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.neighborhood.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
      )
    }

    // Filtrar por tipo
    if (selectedType !== "all") {
      filtered = filtered.filter(p => p.type === selectedType)
    }

    // Filtrar por precio
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice))
    }

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setMinPrice("")
    setMaxPrice("")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:scale-105 transition-transform">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RoomieRent</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all">
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all">
                  <Link href="/favorites">
                    <Heart className="h-4 w-4 mr-2 text-red-600" />
                    Favoritos
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.name}
                </span>
                <Button onClick={logout} variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-95 active:bg-red-100 transition-all">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:scale-95 active:bg-blue-100 transition-all">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 active:from-blue-800 active:to-indigo-800 transition-all">
                  <Link href="/signup">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-sm">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Disponible en toda Colombia</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Encuentra tu Lugar Perfecto
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Descubre casas, apartamentos y habitaciones en arriendo en ciudades de toda Colombia.
              Conecta directamente con propietarios y encuentra tu hogar ideal hoy mismo.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{properties.length}</p>
                <p className="text-sm text-muted-foreground">Propiedades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">1,000+</p>
                <p className="text-sm text-muted-foreground">Usuarios</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">95%</p>
                <p className="text-sm text-muted-foreground">Satisfacción</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white/80 backdrop-blur-sm border-b shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Búsqueda */}
            <div className="lg:col-span-2 space-y-3">
              <Label htmlFor="search" className="text-sm font-semibold text-foreground">Buscar</Label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="search"
                  placeholder="Ciudad, barrio, título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Tipo de propiedad */}
            <div className="space-y-3">
              <Label htmlFor="property-type" className="text-sm font-semibold text-foreground">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="property-type" className="h-12 border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CASA">Casa</SelectItem>
                  <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                  <SelectItem value="HABITACION">Habitación</SelectItem>
                  <SelectItem value="ESTUDIO">Estudio</SelectItem>
                  <SelectItem value="BODEGA">Bodega</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rango de precios */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Precio</Label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 h-12 border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 h-12 border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Results and Clear */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              {isLoading ? (
                "Cargando..."
              ) : (
                `${filteredProperties.length} de ${properties.length} propiedades`
              )}
            </p>
            {(searchQuery || selectedType !== "all" || minPrice || maxPrice) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="hover:bg-red-50 hover:text-red-600 active:scale-95 active:bg-red-100 transition-all font-medium"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">Cargando propiedades...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No hay propiedades aún</h2>
            <p className="text-muted-foreground mb-8">
              Sé el primero en publicar una propiedad
            </p>
            {user?.role === "PROPIETARIO" ? (
              <Button asChild className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 active:from-blue-800 active:to-indigo-800 transition-all">
                <Link href="/add-property">Agregar Propiedad</Link>
              </Button>
            ) : (
              <Button asChild className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 active:from-blue-800 active:to-indigo-800 transition-all">
                <Link href="/signup">Registrarse</Link>
              </Button>
            )}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer group h-full border-2 hover:border-blue-200 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={property.imageUrls[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        {property.type}
                      </span>
                    </div>
                    <button
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(property.id)
                      }}
                      aria-label={favoriteIds.includes(property.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <Heart className={`h-4 w-4 transition-all duration-200 ${favoriteIds.includes(property.id) ? "text-red-600 fill-red-600 scale-110" : "text-red-500 hover:text-red-600"}`} />
                    </button>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                    </div>

                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pb-4 mb-4 border-b border-blue-100">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                        <Bed className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg">
                        <Bath className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
                        <Maximize className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{property.area}m²</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                        <Eye className="h-3 w-3" />
                        <span className="font-medium">{property.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="font-medium">{property.favoriteCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground mb-8">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button
              onClick={clearFilters}
              className="shadow-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 active:scale-95 active:from-orange-800 active:to-red-800 transition-all"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
