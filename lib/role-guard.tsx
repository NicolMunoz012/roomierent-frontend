"use client"

import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/login" }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (!allowedRoles.includes(user.role)) {
        if (user.role === "LANDLORD") {
          router.push("/dashboard/landlord")
        } else {
          router.push("/dashboard/tenant")
        }
      }
    }
  }, [user, isLoading, allowedRoles, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            Cargando...
          </p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}