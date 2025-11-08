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

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    loadProperties()
  }, [])

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
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">RentSpace</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.name}
                </span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
            Encuentra tu lugar perfecto
          </h1>
          <p className="text-xl text-blue-100">
            {properties.length} propiedades disponibles para ti
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Ciudad, barrio, título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo de propiedad */}
            <div className="space-y-2">
              <Label htmlFor="property-type">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="property-type">
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
            <div className="space-y-2">
              <Label>Precio</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>
          </div>

          {/* Results and Clear */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Cargando..."
              ) : (
                `${filteredProperties.length} de ${properties.length} propiedades`
              )}
            </p>
            {(searchQuery || selectedType !== "all" || minPrice || maxPrice) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
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
            <Home className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No hay propiedades aún</h2>
            <p className="text-muted-foreground mb-6">
              Sé el primero en publicar una propiedad
            </p>
            {user?.role === "PROPIETARIO" ? (
              <Button asChild>
                <Link href="/add-property">Agregar Propiedad</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/signup">Registrarse</Link>
              </Button>
            )}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={property.imageUrls[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {property.type}
                      </span>
                    </div>
                    <button
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        // TODO: Implementar favoritos
                      }}
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                    </button>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                    </div>

                    <p className="text-2xl font-bold text-primary mb-4">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pb-4 mb-4 border-b">
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

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{property.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{property.favoriteCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}