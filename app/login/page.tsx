"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    if (!password) {
      setError("La contraseña es obligatoria")
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Correo o contraseña incorrectos")
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity group"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RoomieRent
            </span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Tu hogar perfecto te está esperando
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
            <CardDescription>
              Ingresa a tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo Electrónico <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Contraseña <span className="text-red-500">*</span>
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Iniciando sesión..."
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Al iniciar sesión, aceptas nuestros{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Términos de Servicio
          </Link>
        </p>
      </div>
    </div>
  )
}