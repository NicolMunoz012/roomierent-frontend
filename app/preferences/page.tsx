"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Settings, Save, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react"

const API_URL = "http://localhost:8080/api"

const PROPERTY_TYPES = ["APARTAMENTO", "CASA", "ESTUDIO", "HABITACION"]
const AMENITIES = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parqueadero" },
  { id: "furnished", label: "Amoblado" },
  { id: "laundry", label: "Lavandería" },
  { id: "gym", label: "Gimnasio" },
  { id: "pool", label: "Piscina" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "pets", label: "Admite Mascotas" },
]

export default function PreferencesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Preferencias
  const [preferredCity, setPreferredCity] = useState("")
  const [preferredNeighborhoods, setPreferredNeighborhoods] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [preferredType, setPreferredType] = useState("")
  const [minBedrooms, setMinBedrooms] = useState("1")
  const [minBathrooms, setMinBathrooms] = useState("1")
  const [minArea, setMinArea] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadPreferences()
  }, [user])

  const loadPreferences = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/recommendations/preferences`, {
        headers: {
          "Authorization": user?.email || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        setPreferredCity(data.preferredCity || "")
        setPreferredNeighborhoods(data.preferredNeighborhoods?.join(", ") || "")
        setMinPrice(data.minPrice || "")
        setMaxPrice(data.maxPrice || "")
        setPreferredType(data.preferredType || "")
        setMinBedrooms(data.minBedrooms?.toString() || "1")
        setMinBathrooms(data.minBathrooms?.toString() || "1")
        setMinArea(data.minArea?.toString() || "")
        setSelectedAmenities(data.desiredAmenities || [])
        
        console.log("✅ Preferencias cargadas")
      } else if (response.status === 204) {
        console.log("ℹ️ Usuario sin preferencias guardadas")
      }
    } catch (error) {
      console.error("Error cargando preferencias:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess(false)

    try {
      const neighborhoods = preferredNeighborhoods
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0)

      const payload = {
        preferredCity: preferredCity || null,
        preferredNeighborhoods: neighborhoods.length > 0 ? neighborhoods : null,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        preferredType: preferredType || null,
        minBedrooms: parseInt(minBedrooms),
        minBathrooms: parseInt(minBathrooms),
        minArea: minArea ? parseFloat(minArea) : null,
        desiredAmenities: selectedAmenities.length > 0 ? selectedAmenities : null,
      }

      const response = await fetch(`${API_URL}/recommendations/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": user?.email || "",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSuccess(true)
        console.log("✅ Preferencias guardadas")
        setTimeout(() => {
          router.push("/recommendations")
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.message || "Error al guardar preferencias")
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError("Error al guardar preferencias")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">RentSpace</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold">Mis Preferencias</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Personaliza tus preferencias para obtener mejores recomendaciones
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Preferencias guardadas exitosamente. Redirigiendo...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación Preferida</CardTitle>
              <CardDescription>
                Selecciona la ciudad y barrios donde prefieres vivir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Ej: Pasto"
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhoods">Barrios (separados por comas)</Label>
                <Input
                  id="neighborhoods"
                  placeholder="Ej: Pandiaco, Centro, La Castellana"
                  value={preferredNeighborhoods}
                  onChange={(e) => setPreferredNeighborhoods(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Precio */}
          <Card>
            <CardHeader>
              <CardTitle>Rango de Precio</CardTitle>
              <CardDescription>
                Define tu presupuesto mensual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Precio Mínimo</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="300000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Precio Máximo</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="800000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Propiedad */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Propiedad</CardTitle>
              <CardDescription>
                ¿Qué tipo de propiedad buscas?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={preferredType} onValueChange={setPreferredType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características Mínimas</CardTitle>
              <CardDescription>
                Especifica los requerimientos mínimos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={minBathrooms}
                    onChange={(e) => setMinBathrooms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área mínima (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="50"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios Deseados</CardTitle>
              <CardDescription>
                Selecciona los servicios que te interesan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AMENITIES.map(amenity => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                    <Label
                      htmlFor={amenity.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
              size="lg"
            >
              {isSaving ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Preferencias
                </>
              )}
            </Button>
            <Button
              onClick={() => router.push("/recommendations")}
              variant="outline"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Ver Recomendaciones
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}