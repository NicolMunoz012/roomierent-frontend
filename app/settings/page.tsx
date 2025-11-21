"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, User, Mail, Shield, Trash2, AlertCircle, ArrowLeft, Building2, Settings as SettingsIcon } from "lucide-react"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/settings`

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [propertyCount, setPropertyCount] = useState(0)
  const [isLoadingCount, setIsLoadingCount] = useState(false)

  useEffect(() => {
    if (user?.role === "LANDLORD") {
      loadPropertyCount()
    }
  }, [user])

  const loadPropertyCount = async () => {
    setIsLoadingCount(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/my-properties`, {
        headers: {
          "Authorization": user?.email || "",
        },
      })

      if (response.ok) {
        const properties = await response.json()
        setPropertyCount(properties.length)
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error)
    } finally {
      setIsLoadingCount(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user])

  if (!user) return null

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINAR") {
      setError('Debes escribir "ELIMINAR" para confirmar')
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": user.email,
        },
      })

      if (response.ok) {
        console.log("✅ Cuenta eliminada exitosamente")
        logout()
        router.push("/")
      } else {
        const data = await response.json()
        setError(data.message || "Error al eliminar la cuenta")
      }
    } catch (err: any) {
      console.error("❌ Error:", err)
      setError("Error al eliminar la cuenta")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RoomieRent
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={logout} variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-95 transition-all">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Configuración
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Administra tu cuenta y preferencias
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-blue-600" />
                Información de la Cuenta
              </CardTitle>
              <CardDescription className="text-base">
                Detalles básicos de tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Nombre completo</Label>
                <Input 
                  value={user.name} 
                  disabled 
                  className="bg-gray-50/50 border-2 text-base h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <Input 
                    value={user.email} 
                    disabled 
                    className="pl-11 bg-gray-50/50 border-2 text-base h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Tipo de cuenta</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <Input
                    value={user.role === "LANDLORD" ? "Propietario" : "Arrendatario"}
                    disabled
                    className="pl-11 bg-gray-50/50 border-2 text-base h-12 font-semibold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
              <CardTitle className="text-red-600 flex items-center gap-2 text-xl">
                <Trash2 className="h-5 w-5" />
                Zona de Peligro
              </CardTitle>
              <CardDescription className="text-base">
                Eliminar tu cuenta es permanente y no se puede deshacer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold text-base">
                      Esta acción eliminará permanentemente:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Tu cuenta de usuario</li>
                      {user.role === "LANDLORD" && (
                        <>
                          <li>
                            {isLoadingCount ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="animate-pulse">Cargando propiedades...</span>
                              </span>
                            ) : (
                              <>
                                <strong className="text-red-700">{propertyCount}</strong> {propertyCount === 1 ? "propiedad publicada" : "propiedades publicadas"}
                              </>
                            )}
                          </li>
                          <li>Todas las imágenes asociadas</li>
                        </>
                      )}
                      <li>Todo tu historial de actividad</li>
                    </ul>
                    <p className="mt-3 font-bold text-red-700">
                      ⚠️ No podrás recuperar esta información.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {user.role === "LANDLORD" && propertyCount > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-900 text-base">
                        Tienes {propertyCount} {propertyCount === 1 ? "propiedad activa" : "propiedades activas"}
                      </p>
                      <p className="text-sm text-orange-700 mt-1.5 leading-relaxed">
                        Al eliminar tu cuenta, {propertyCount === 1 ? "esta propiedad se eliminará" : "todas estas propiedades se eliminarán"} automáticamente de la plataforma junto con todas sus imágenes y datos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Eliminar Mi Cuenta
                    {user.role === "LANDLORD" && propertyCount > 0 && (
                      <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        y {propertyCount} {propertyCount === 1 ? "propiedad" : "propiedades"}
                      </span>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-6 w-6" />
                      ¿Estás absolutamente seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4 text-base">
                      <p className="text-gray-700 font-semibold">
                        Esta acción NO se puede deshacer. Esto eliminará permanentemente:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-left bg-red-50 p-4 rounded-lg border-2 border-red-200">
                        <li className="text-gray-800">
                          Tu cuenta: <strong className="text-red-700">{user.email}</strong>
                        </li>
                        {user.role === "LANDLORD" && propertyCount > 0 && (
                          <li className="text-gray-800">
                            <strong className="text-red-700">{propertyCount}</strong> {propertyCount === 1 ? "propiedad" : "propiedades"} con todas sus imágenes
                          </li>
                        )}
                        <li className="text-gray-800">Todo tu historial de actividad</li>
                      </ul>
                      <div className="space-y-3 mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                        <Label htmlFor="confirm-delete" className="text-base font-bold text-gray-800 block">
                          Para confirmar, escribe <span className="text-red-600 font-mono bg-red-100 px-2 py-1 rounded">ELIMINAR</span> en el campo:
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                          placeholder="ELIMINAR"
                          className="font-mono text-lg h-12 border-2 focus:border-red-400"
                        />
                      </div>
                      {error && (
                        <Alert variant="destructive" className="border-2">
                          <AlertCircle className="h-5 w-5" />
                          <AlertDescription className="font-semibold">{error}</AlertDescription>
                        </Alert>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      onClick={() => {
                        setConfirmText("")
                        setError("")
                      }}
                      className="h-11 font-semibold"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || confirmText !== "ELIMINAR"}
                      className="bg-red-600 hover:bg-red-700 h-11 font-semibold disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Eliminando...
                        </span>
                      ) : (
                        "Sí, Eliminar Todo"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}