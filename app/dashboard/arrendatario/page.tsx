"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "@/lib/role-guard"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Search, Heart, MapPin, Sparkles, MessageSquare, User } from "lucide-react"

export default function ArrendatarioDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [savedProperties, setSavedProperties] = useState<any[]>([])
  const [viewedProperties, setViewedProperties] = useState(0)

  useEffect(() => {
    if (user) {
      // Por ahora dejamos esto vacío, luego integraremos con el backend real
      setSavedProperties([])
      setViewedProperties(0)
    }
  }, [user])

  return (
    <RoleGuard allowedRoles={["ARRENDATARIO"]}>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-serif text-2xl font-bold">RentSpace</span>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Tenant
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <strong>{user?.name}</strong>
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">Find Your Perfect Home</h1>
            <p className="text-muted-foreground text-lg">
              Explore properties tailored to your preferences
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saved Properties</p>
                    <p className="text-3xl font-bold">{savedProperties.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Viewed Properties</p>
                    <p className="text-3xl font-bold">{viewedProperties}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Messages</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendation Banner */}
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <CardTitle>Get AI-Powered Recommendations</CardTitle>
              </div>
              <CardDescription>
                Complete your profile to receive personalized property suggestions based on your preferences and budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Setup My Preferences
                </Button>
                <p className="text-sm text-muted-foreground">
                  Takes less than 2 minutes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Explore Properties</CardTitle>
                <CardDescription>Browse all available listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/properties">Start Searching</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Properties matched to your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  View Suggestions
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Heart className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Favorites</CardTitle>
                <CardDescription>Your saved properties</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Saved ({savedProperties.length})
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Saved Properties Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Favorites</CardTitle>
                  <CardDescription>Properties you've saved for later</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/properties">Browse More</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Aquí irán las propiedades guardadas cuando las tengamos */}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
                  <p className="text-muted-foreground mb-6">Start exploring and save your favorites</p>
                  <Button asChild>
                    <Link href="/properties">
                      <Search className="h-4 w-4 mr-2" />
                      Explore Properties
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </RoleGuard>
  )
}