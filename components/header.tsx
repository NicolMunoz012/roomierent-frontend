"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Home, User, LogOut, Plus, LayoutDashboard, Settings } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            RoomieRent
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/properties"
            className="text-base text-foreground hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium hidden sm:block hover:shadow-sm"
          >
            Explorar Propiedades
          </Link>

          {user ? (
            <>
              {user.role === "LANDLORD" && (
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 active:from-blue-800 active:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium rounded-xl"
                >
                  <Link href="/add-property" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Publicar Propiedad</span>
                    <span className="sm:hidden">Publicar</span>
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white/80 hover:bg-blue-50 hover:border-blue-300 active:scale-95 active:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-200 text-base font-medium rounded-xl border-2"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl border-2 rounded-xl">
                  <div className="px-3 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer rounded-lg mx-1">
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span className="text-base">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer rounded-lg mx-1">
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="text-base">Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mx-1 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="text-base">Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                asChild
                className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 active:scale-95 active:bg-orange-100 shadow-sm hover:shadow-md transition-all duration-200 text-base font-medium rounded-xl border-2"
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 active:from-blue-800 active:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium rounded-xl"
              >
                <Link href="/signup">Registrarse</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}