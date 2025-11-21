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
  token: string | null
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth` 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    try {
      const storedUser = localStorage.getItem("rental_user")
      const storedToken = localStorage.getItem("rental_token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error("Error loading auth data:", error)
      localStorage.removeItem("rental_user")
      localStorage.removeItem("rental_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<any> => {
    try {
      console.log("📤 Intentando login a:", `${API_URL}/login`) // ← DEBUG

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Credenciales incorrectas",
        }
      }

      console.log("✅ Login exitoso, token recibido:", data.token?.substring(0, 20) + "...") // ← DEBUG

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      }

      setUser(userData)
      setToken(data.token)

      localStorage.setItem("rental_user", JSON.stringify(userData))
      localStorage.setItem("rental_token", data.token)

      return { success: true }

    } catch (error) {
      console.error("Error en login:", error)
      return {
        success: false,
        message: "No se pudo conectar con el servidor",
      }
    }
  }, [])

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      console.log("🟢 Intentando registro con:", { email, name, role })


      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  email, password, name, role }),
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

        setUser(userData)
        setToken(data.token)

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

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("rental_user")
    localStorage.removeItem("rental_token")
  }, [])

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

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