"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, Upload, X, MapPin, Building2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Importar el mapa de forma dinámica (solo en el cliente)
const LocationMap = dynamic(
  () => import("@/components/location-map").then((mod) => mod.LocationMap),
  { ssr: false }
)

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/`

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parqueadero" },
  { id: "furnished", label: "Amueblado" },
  { id: "gym", label: "Gimnasio" },
  { id: "pool", label: "Piscina" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "laundry", label: "Lavandería" },
  { id: "elevator", label: "Ascensor" },
  { id: "balcony", label: "Balcón" },
  { id: "pets", label: "Acepta mascotas" },
  { id: "gas", label: "Gas incluido" },
  { id: "water", label: "Agua incluida" },
]

export default function AddPropertyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [locationSelected, setLocationSelected] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    type: "APARTAMENTO",
    city: "",
    neighborhood: "",
    address: "",
    latitude: 1.2136, // Centro de Pasto por defecto
    longitude: -77.2811,
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    area: "",
    description: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    })
    setLocationSelected(true)
    console.log("📍 Ubicación seleccionada:", { lat, lng })
  }

  const handleAddImageUrl = () => {
    if (currentImageUrl.trim()) {
      setImageUrls([...imageUrls, currentImageUrl.trim()])
      setCurrentImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrls((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Solo números
    setFormData({ ...formData, price: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validaciones
      if (!formData.title.trim() || formData.title.length < 10) {
        setError("El título debe tener al menos 10 caracteres")
        setIsSubmitting(false)
        return
      }

      if (!formData.description.trim() || formData.description.length < 50) {
        setError("La descripción debe tener al menos 50 caracteres")
        setIsSubmitting(false)
        return
      }

      if (!formData.city.trim()) {
        setError("La ciudad es requerida")
        setIsSubmitting(false)
        return
      }

      if (!locationSelected) {
        setError("Debes seleccionar la ubicación en el mapa")
        setIsSubmitting(false)
        return
      }

      if (imageUrls.length === 0) {
        setError("Debes agregar al menos una imagen")
        setIsSubmitting(false)
        return
      }

      // Preparar datos para enviar
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        address: formData.address,
        city: formData.city,
        neighborhood: formData.neighborhood,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        amenities: selectedAmenities,
        imageUrls: imageUrls,
      }

      console.log("📤 Enviando propiedad:", propertyData)

      // Obtener token
      const token = localStorage.getItem("rental_token")
      const userEmail = user?.email

      if (!token || !userEmail) {
        setError("Debes iniciar sesión para agregar una propiedad")
        setIsSubmitting(false)
        return
      }

      // Enviar al backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userEmail,
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la propiedad")
      }

      const result = await response.json()
      console.log("✅ Propiedad creada:", result)

      // Redirigir al dashboard
      router.push("/dashboard/propietario")

    } catch (err: any) {
      console.error("❌ Error:", err)
      setError(err.message || "Error al crear la propiedad")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard/propietario" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">RentSpace</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            {user.name}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Agregar Nueva Propiedad</CardTitle>
                <CardDescription>
                  Completa los detalles para publicar tu propiedad en RentSpace
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título de la Propiedad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Hermoso apartamento en el centro de Pasto"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 10 caracteres ({formData.title.length}/10)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Tipo de Propiedad <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASA">Casa</SelectItem>
                        <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                        <SelectItem value="HABITACION">Habitación</SelectItem>
                        <SelectItem value="ESTUDIO">Estudio</SelectItem>
                        <SelectItem value="BODEGA">Bodega</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Precio Mensual (COP) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.price}
                      onChange={handlePriceChange}
                      placeholder="800000"
                      disabled={isSubmitting}
                      className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Ciudad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ej: Pasto, Bogotá, Medellín..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">
                      Barrio/Sector <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="neighborhood"
                      required
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Ej: Pandiaco, Centro, La Carolina"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Dirección Completa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej: Calle 18 #25-45"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Mapa Interactivo */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Ubicación en el Mapa <span className="text-red-500">*</span>
                    {locationSelected && (
                      <span className="text-green-600 text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Ubicación seleccionada
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Haz click en el mapa para marcar la ubicación exacta de tu propiedad
                  </p>
                  <LocationMap
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                  {locationSelected && (
                    <p className="text-xs text-muted-foreground">
                      📍 Coordenadas: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Características */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Características</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">
                      Habitaciones <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      required
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">
                      Baños <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      required
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">
                      Área (m²) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      min="1"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="80"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Servicios/Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Servicios y Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        disabled={isSubmitting}
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
              </div>

              {/* Imágenes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Imágenes <span className="text-red-500">*</span>
                </h3>

                <div className="space-y-4">
                  {/* Upload de archivos */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click para subir imágenes o arrastra y suelta
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP
                      </p>
                    </Label>
                  </div>

                  {/* O agregar por URL */}
                  <div className="flex gap-2">
                    <Input
                      value={currentImageUrl}
                      onChange={(e) => setCurrentImageUrl(e.target.value)}
                      placeholder="O pega una URL de imagen"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      onClick={handleAddImageUrl}
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Agregar
                    </Button>
                  </div>

                  {/* Preview de imágenes */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Descripción</h3>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción Detallada <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe tu propiedad en detalle: características, ubicación, ventajas, etc."
                    rows={6}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 50 caracteres ({formData.description.length}/50)
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Publicando..." : "Publicar Propiedad"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}