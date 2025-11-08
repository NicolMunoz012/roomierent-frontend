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
import { Home, User, Mail, Shield, Trash2, AlertCircle, ArrowLeft, Building2 } from "lucide-react"

const API_URL = "http://localhost:8080/api"

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
    if (user?.role === "PROPIETARIO") {
      loadPropertyCount()
    }
  }, [user])

  const loadPropertyCount = async () => {
    setIsLoadingCount(true)
    try {
      const response = await fetch(`${API_URL}/properties/my-properties`, {
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

  if (!user) {
    router.push("/login")
    return null
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINAR") {
      setError('Debes escribir "ELIMINAR" para confirmar')
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": user.email,
        },
      })

      if (response.ok) {
        console.log("✅ Cuenta eliminada exitosamente")
        // Logout y redirigir
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
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Configuración de Cuenta</h1>
          <p className="text-muted-foreground text-lg">
            Administra tu perfil y preferencias
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información de la Cuenta
              </CardTitle>
              <CardDescription>
                Detalles básicos de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input value={user.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input value={user.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.role === "PROPIETARIO" ? "Propietario" : "Arrendatario"}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Zona de Peligro
              </CardTitle>
              <CardDescription>
                Eliminar tu cuenta es permanente y no se puede deshacer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Advertencia:</strong> Esta acción eliminará permanentemente:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Tu cuenta de usuario</li>
                      {user.role === "PROPIETARIO" && (
                        <>
                          <li>
                            {isLoadingCount ? (
                              "Cargando propiedades..."
                            ) : (
                              <>
                                <strong>{propertyCount}</strong> {propertyCount === 1 ? "propiedad publicada" : "propiedades publicadas"}
                              </>
                            )}
                          </li>
                          <li>Todas las imágenes asociadas</li>
                        </>
                      )}
                      <li>Todo tu historial de actividad</li>
                    </ul>
                    <p className="mt-2 font-semibold">
                      No podrás recuperar esta información.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {user.role === "PROPIETARIO" && propertyCount > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">
                        Tienes {propertyCount} {propertyCount === 1 ? "propiedad activa" : "propiedades activas"}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Al eliminar tu cuenta, {propertyCount === 1 ? "esta propiedad se eliminará" : "todas estas propiedades se eliminarán"} automáticamente de la plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Mi Cuenta
                    {user.role === "PROPIETARIO" && propertyCount > 0 && (
                      <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">
                        y {propertyCount} {propertyCount === 1 ? "propiedad" : "propiedades"}
                      </span>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                      <p>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-left">
                        <li>Tu cuenta: <strong>{user.email}</strong></li>
                        {user.role === "PROPIETARIO" && propertyCount > 0 && (
                          <li>
                            <strong>{propertyCount}</strong> {propertyCount === 1 ? "propiedad" : "propiedades"} con todas sus imágenes
                          </li>
                        )}
                        <li>Todo tu historial de actividad</li>
                      </ul>
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="confirm-delete" className="text-left block">
                          Escribe <strong className="text-red-600">ELIMINAR</strong> para confirmar:
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                          placeholder="ELIMINAR"
                          className="font-mono"
                        />
                      </div>
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                      setConfirmText("")
                      setError("")
                    }}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || confirmText !== "ELIMINAR"}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Eliminando..." : "Sí, Eliminar Todo"}
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