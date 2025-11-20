"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Home, Settings, Save, Sparkles, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "STUDIO", label: "Estudio" },
  { value: "ROOM", label: "Habitación" },
]

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
  const { user, token } = useAuth()
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
    if (!user || !token) {
      router.push("/login")
      return
    }
    loadPreferences()
  }, [user, token])

  const loadPreferences = async () => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      console.log("📤 Cargando preferencias...")
      
      const response = await fetch(`${API_URL}/recommendations/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      console.log("📥 Status:", response.status)

      if (response.status === 204) {
      console.log("ℹ️ Usuario sin preferencias guardadas")
      setIsLoading(false)
      return
    }

      if (response.ok) {
        const data = await response.json()
        
        setPreferredCity(data.preferredCity || "")
        setPreferredNeighborhoods(data.preferredNeighborhoods?.join(", ") || "")
        setMinPrice(data.minPrice?.toString() || "")
        setMaxPrice(data.maxPrice?.toString() || "")
        setPreferredType(data.preferredType || "")
        setMinBedrooms(data.minBedrooms?.toString() || "1")
        setMinBathrooms(data.minBathrooms?.toString() || "1")
        setMinArea(data.minArea?.toString() || "")
        setSelectedAmenities(data.desiredAmenities || [])
        
        console.log("✅ Preferencias cargadas")
      } else if (response.status === 204) {
        console.log("ℹ️ Usuario sin preferencias guardadas")
      } else {
        console.error(`Error cargando preferencias:${response.status}`)
      }
    } catch (error) {
      console.error("Error cargando preferencias:", error)
      setError("Error al cargar preferencias")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión nuevamente.")
      return
    }

    setIsSaving(true)
    setError("")
    setSuccess(false)

    // Validaciones
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      setError("El precio mínimo no puede ser mayor al máximo")
      setIsSaving(false)
      return
    }

    if (minPrice && parseFloat(minPrice) < 0) {
      setError("El precio mínimo no puede ser negativo")
      setIsSaving(false)
      return
    }

    if (maxPrice && parseFloat(maxPrice) < 0) {
      setError("El precio máximo no puede ser negativo")
      setIsSaving(false)
      return
    }

    if (minArea && parseFloat(minArea) < 0) {
      setError("El área no puede ser negativa")
      setIsSaving(false)
      return
    }

    try {
      const neighborhoods = preferredNeighborhoods
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0)

      const payload = {
        preferredCity: preferredCity.trim() || null,
        preferredNeighborhoods: neighborhoods.length > 0 ? neighborhoods : null,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        preferredType: preferredType || null,
        minBedrooms: parseInt(minBedrooms) || 1,
        minBathrooms: parseInt(minBathrooms) || 1,
        minArea: minArea ? parseFloat(minArea) : null,
        desiredAmenities: selectedAmenities.length > 0 ? selectedAmenities : null,
      }

      console.log("📤 Enviando preferencias:", payload)

      const response = await fetch(`${API_URL}/recommendations/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("📥 Status:", response.status)

      if (response.ok) {
        setSuccess(true)
        console.log("✅ Preferencias guardadas")
        setTimeout(() => {
          router.push("/recommendations")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Error al guardar preferencias")
        console.error("❌ Error:", response.status, data)
      }
    } catch (err: any) {
      console.error("❌ Error:", err)
      setError("Error de conexión. Verifica que el servidor esté activo.")
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

  // Validación de solo letras y espacios
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setPreferredCity(value)
    }
  }

  // Validación de solo números positivos
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    allowDecimals = false
  ) => {
    const value = e.target.value
    
    if (value === "") {
      setter("")
      return
    }

    if (allowDecimals) {
      if (/^\d*\.?\d*$/.test(value)) {
        setter(value)
      }
    } else {
      if (/^\d*$/.test(value)) {
        setter(value)
      }
    }
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
              Volver
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header de página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mis Preferencias
              </h1>
              <p className="text-gray-600 mt-1">
                Configura tus preferencias para recibir recomendaciones personalizadas con IA
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">¡Preferencias guardadas exitosamente!</p>
              <p className="text-sm mt-1">Redirigiendo a tus recomendaciones...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
            <p className="text-sm">Cargando preferencias...</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Ubicación */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">📍 Ubicación Preferida</h2>
              <p className="text-sm text-gray-600">
                ¿Dónde te gustaría vivir?
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Ej: Pasto"
                  value={preferredCity}
                  onChange={handleCityChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios</p>
              </div>
              <div>
                <label htmlFor="neighborhoods" className="block text-sm font-medium text-gray-700 mb-2">
                  Barrios Preferidos <span className="text-gray-400 font-normal">(separados por comas)</span>
                </label>
                <input
                  id="neighborhoods"
                  type="text"
                  placeholder="Ej: Pandiaco, Centro, La Castellana"
                  value={preferredNeighborhoods}
                  onChange={(e) => setPreferredNeighborhoods(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">💰 Presupuesto</h2>
              <p className="text-sm text-gray-600">
                Define tu rango de precio mensual
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Mínimo (COP)
                </label>
                <input
                  id="minPrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="300000"
                  value={minPrice}
                  onChange={(e) => handleNumberChange(e, setMinPrice, true)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Solo números positivos</p>
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Máximo (COP)
                </label>
                <input
                  id="maxPrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="800000"
                  value={maxPrice}
                  onChange={(e) => handleNumberChange(e, setMaxPrice, true)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Solo números positivos</p>
              </div>
            </div>
          </div>

          {/* Tipo de Propiedad */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">🏠 Tipo de Propiedad</h2>
              <p className="text-sm text-gray-600">
                ¿Qué tipo de inmueble buscas?
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROPERTY_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPreferredType(type.value)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    preferredType === type.value
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-purple-300 text-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Características */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">📐 Características Mínimas</h2>
              <p className="text-sm text-gray-600">
                Especifica los requisitos mínimos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <input
                  id="bedrooms"
                  type="text"
                  inputMode="numeric"
                  value={minBedrooms}
                  onChange={(e) => handleNumberChange(e, setMinBedrooms, false)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Solo números enteros</p>
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Baños
                </label>
                <input
                  id="bathrooms"
                  type="text"
                  inputMode="numeric"
                  value={minBathrooms}
                  onChange={(e) => handleNumberChange(e, setMinBathrooms, false)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Solo números enteros</p>
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Área mínima (m²)
                </label>
                <input
                  id="area"
                  type="text"
                  inputMode="decimal"
                  placeholder="50"
                  value={minArea}
                  onChange={(e) => handleNumberChange(e, setMinArea, true)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Números con decimales permitidos</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">✨ Servicios Deseados</h2>
              <p className="text-sm text-gray-600">
                Selecciona los servicios que te interesan
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES.map(amenity => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity.id)
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-base text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSaving ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Guardar Preferencias
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/recommendations")}
              disabled={isSaving}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-base font-medium border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5" />
              Ver Recomendaciones
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}