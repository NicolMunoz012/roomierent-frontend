"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/auth-context"
import { Home, Upload, X, MapPin, Building2, AlertCircle, CheckCircle2, ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"

const LocationMap = dynamic(
  () => import("@/components/location-map").then((mod) => mod.LocationMap),
  { ssr: false }
)

const API_URL = process.env.NEXT_PUBLIC_API_URL

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parqueadero" },
  { id: "furnished", label: "Amoblado" },
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

const PROPERTY_TYPES = [
  { value: "HOUSE", label: "Casa" },
  { value: "APARTMENT", label: "Apartamento" },
  { value: "ROOM", label: "Habitación" },
  { value: "STUDIO", label: "Estudio" },
]

export default function AddPropertyPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  
  // ✅ ARREGLADO: Array de URLs individuales
  const [urlInputs, setUrlInputs] = useState<string[]>([""])
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [locationSelected, setLocationSelected] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    type: "APARTMENT",
    city: "",
    neighborhood: "",
    address: "",
    latitude: 1.2136,
    longitude: -77.2811,
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    area: "",
    description: "",
  })

  useEffect(() => {
    if (!user || !token) {
      router.push("/login")
    }
  }, [user, token, router])

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
  }

  // ✅ Agregar más campos de URL
  const addUrlInput = () => {
    setUrlInputs([...urlInputs, ""])
  }

  // ✅ Actualizar URL individual
  const updateUrlInput = (index: number, value: string) => {
    const newInputs = [...urlInputs]
    newInputs[index] = value
    setUrlInputs(newInputs)
  }

  // ✅ Agregar URL a la lista de imágenes
  const handleAddImageUrl = (index: number) => {
    const url = urlInputs[index].trim()
    if (url && /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
      setImageUrls([...imageUrls, url])
      // Limpiar solo ese input
      const newInputs = [...urlInputs]
      newInputs[index] = ""
      setUrlInputs(newInputs)
      setError("")
    } else if (url) {
      setError("URL de imagen inválida. Debe terminar en .jpg, .png, .webp o .gif")
    }
  }

  // ✅ Remover campo de URL
  const removeUrlInput = (index: number) => {
    if (urlInputs.length > 1) {
      setUrlInputs(urlInputs.filter((_, i) => i !== index))
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

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    allowDecimals = false
  ) => {
    const value = e.target.value
    if (value === "") {
      setFormData({ ...formData, [field]: "" })
      return
    }

    if (allowDecimals) {
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [field]: value })
      }
    } else {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [field]: value })
      }
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setFormData({ ...formData, city: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validaciones
    if (!formData.title.trim() || formData.title.length < 10) {
      setError("El título debe tener al menos 10 caracteres")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.description.trim() || formData.description.length < 50) {
      setError("La descripción debe tener al menos 50 caracteres")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.city.trim()) {
      setError("La ciudad es requerida")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.neighborhood.trim()) {
      setError("El barrio/sector es requerido")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.address.trim()) {
      setError("La dirección es requerida")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!locationSelected) {
      setError("Debes seleccionar la ubicación en el mapa")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.price || parseFloat(formData.price) < 1000) {
      setError("El precio debe ser mayor a $1,000")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.area || parseFloat(formData.area) < 1) {
      setError("El área debe ser mayor a 1 m²")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (imageUrls.length === 0) {
      setError("Debes agregar al menos una imagen")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!token) {
      setError("Debes iniciar sesión para agregar una propiedad")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        type: formData.type,
        address: formData.address.trim(),
        city: formData.city.trim(),
        neighborhood: formData.neighborhood.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: parseInt(formData.bedrooms) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        area: parseFloat(formData.area),
        amenities: selectedAmenities,
        imageUrls: imageUrls,
      }

      console.log("📤 Enviando propiedad:", propertyData)

      const response = await fetch(`${API_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      })

      console.log("📥 Status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la propiedad")
      }

      const result = await response.json()
      console.log("✅ Propiedad creada:", result)

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)

    } catch (err: any) {
      console.error("❌ Error:", err)
      setError(err.message || "Error al crear la propiedad")
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
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
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Agregar Nueva Propiedad
              </h1>
              <p className="text-gray-600 mt-1">
                Completa los detalles para publicar tu propiedad
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Alertas ARRIBA */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">¡Propiedad publicada exitosamente!</p>
                  <p className="text-sm mt-1">Redirigiendo...</p>
                </div>
              </div>
            )}

            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Propiedad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Hermoso apartamento en el centro de Pasto"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 10 caracteres ({formData.title.length}/10)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Propiedad <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Mensual (COP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.price}
                    onChange={(e) => handleNumberChange(e, "price", true)}
                    placeholder="800000"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo números</p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Ej: Pasto"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo letras y espacios</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barrio/Sector <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Ej: Pandiaco"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección Completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle 18 #25-45"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Ubicación en el Mapa <span className="text-red-500">*</span>
                  {locationSelected && (
                    <span className="text-green-600 text-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Ubicación seleccionada
                    </span>
                  )}
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Haz click en el mapa para marcar la ubicación exacta
                </p>
                <LocationMap
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Características</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.bedrooms}
                    onChange={(e) => handleNumberChange(e, "bedrooms", false)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.bathrooms}
                    onChange={(e) => handleNumberChange(e, "bathrooms", false)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={formData.area}
                    onChange={(e) => handleNumberChange(e, "area", true)}
                    placeholder="80"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Servicios y Comodidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <label
                    key={amenity.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAmenities.includes(amenity.id)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Imágenes <span className="text-red-500">*</span>
              </h3>

              <div className="space-y-4">
                {/* Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click para subir imágenes
                    </p>
                  </label>
                </div>

                {/* URL de imágenes - CORREGIDO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      O agregar por URL
                    </label>
                    <button
                      type="button"
                      onClick={addUrlInput}
                      disabled={isSubmitting}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar más
                    </button>
                  </div>

                  {urlInputs.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateUrlInput(index, e.target.value)}
                        placeholder={`URL de imagen ${index + 1}`}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImageUrl(index)}
                        disabled={isSubmitting || !url.trim()}
                        className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </button>
                      {urlInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUrlInput(index)}
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Preview */}
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
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Descripción</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Detallada <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu propiedad en detalle: características, ubicación, ventajas, etc."
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 50 caracteres ({formData.description.length}/50)
                </p>
              </div>
            </div>

            {/* Alerta ABAJO también */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Publicando..."
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Publicar Propiedad
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}