"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "@/lib/role-guard"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Plus, Building2, BarChart3, MessageSquare, Settings, MapPin, Bed, Bath, Maximize } from "lucide-react"

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
  imageUrls: string[]
  viewCount: number
  favoriteCount: number
}

export default function PropietarioDashboard() {
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

  return (
    <RoleGuard allowedRoles={["PROPIETARIO"]}>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-serif text-2xl font-bold">RentSpace</span>
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Landlord
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <strong>{user?.name}</strong>
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground text-lg">Manage your properties and rental business</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Properties</p>
                    <p className="text-3xl font-bold">{properties.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                    <p className="text-3xl font-bold">
                      {properties.reduce((sum, p) => sum + p.viewCount, 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Favorites</p>
                    <p className="text-3xl font-bold">
                      {properties.reduce((sum, p) => sum + p.favoriteCount, 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Plus className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Add New Property</CardTitle>
                <CardDescription>List a new property for rent</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/add-property">Create Listing</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Building2 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>My Properties</CardTitle>
                <CardDescription>View and manage your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/properties">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings">Open Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Properties List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Properties</CardTitle>
                  <CardDescription>Properties you've listed on RentSpace</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading properties...</p>
                </div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={property.imageUrls[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {property.status}
                        </span>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-3">
                          {formatPrice(property.price)}<span className="text-sm font-normal text-muted-foreground">/mes</span>
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
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>👁️ {property.viewCount} views</span>
                          <span>•</span>
                          <span>❤️ {property.favoriteCount} favorites</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground mb-6">Start by adding your first property</p>
                  <Button asChild>
                    <Link href="/add-property">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
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