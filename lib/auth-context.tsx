"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = "http://localhost:8080/api/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("rental_user")
    const storedToken = localStorage.getItem("rental_token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      }

      setUser(userData)
      localStorage.setItem("rental_user", JSON.stringify(userData))
      localStorage.setItem("rental_token", data.token)

      return true
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  const signup = async (
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

        const userData = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        }

        setUser(userData)
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
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("rental_user")
    localStorage.removeItem("rental_token")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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