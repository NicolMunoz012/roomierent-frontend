// lib/auth-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null  // ← AGREGADO
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean  // ← AGREGADO (útil para guards)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)  // ← AGREGADO
  const [isLoading, setIsLoading] = useState(true)

  // ==========================================
  // CARGAR DATOS AL INICIAR
  // ==========================================

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    try {
      const storedUser = localStorage.getItem("rental_user")
      const storedToken = localStorage.getItem("rental_token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)  // ← AGREGADO
      }
    } catch (error) {
      console.error("Error loading auth data:", error)
      // Limpiar datos corruptos
      localStorage.removeItem("rental_user")
      localStorage.removeItem("rental_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ==========================================
  // LOGIN
  // ==========================================

const login = useCallback(async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Si falla el login, devolver mensaje legible
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Credenciales incorrectas",
      };
    }

    const userData: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    };

    setUser(userData);
    setToken(data.token);

    localStorage.setItem("rental_user", JSON.stringify(userData));
    localStorage.setItem("rental_token", data.token);

    return { success: true };

  } catch (error) {
    console.error("Error en login:", error);
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
    };
  }
}, []);
  // ==========================================
  // SIGNUP
  // ==========================================

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      console.log("🟢 Intentando registro con:", { email, name, role })

      // Mapear roles del UI (español) a los valores del backend (enum)
      const mappedRole = role === "PROPIETARIO" ? "LANDLORD" : "TENANT"

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role: mappedRole }),
      })

      console.log("🟢 Status del signup:", response.status)

      const data = await response.json()
      console.log("🟢 Respuesta del servidor:", data)

      if (response.status === 409 || response.status === 400) {
        console.error("❌ Email ya existe")
        return false
      }

      if (response.status === 201 && data.token) {
        console.log("✅ Signup exitoso:", data)

        const userData: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        }

        // Actualizar estado
        setUser(userData)
        setToken(data.token)  // ← AGREGADO

        // Guardar en localStorage
        localStorage.setItem("rental_user", JSON.stringify(userData))
        localStorage.setItem("rental_token", data.token)

        return true
      }

      console.error("❌ Respuesta inesperada:", response.status)
      return false

    } catch (error) {
      console.error("❌ Error en signup:", error)
      return false
    }
  }, [])

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = useCallback(() => {
    // Limpiar estado
    setUser(null)
    setToken(null)  // ← AGREGADO

    // Limpiar localStorage
    localStorage.removeItem("rental_user")
    localStorage.removeItem("rental_token")
  }, [])

  // ==========================================
  // VALOR DEL CONTEXTO
  // ==========================================

  const value: AuthContextType = {
    user,
    token,  // ← AGREGADO
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,  // ← AGREGADO
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ==========================================
// HOOK PERSONALIZADO
// ==========================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// ==========================================
// HELPER: Obtener Headers de Autorización
// ==========================================

export function getAuthHeaders(token?: string | null): HeadersInit {
  const authToken = token || localStorage.getItem("rental_token")

  if (!authToken) {
    throw new Error("No authentication token found")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  }
}