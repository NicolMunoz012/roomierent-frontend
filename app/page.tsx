import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, HomeIcon, Users, Sparkles, TrendingUp, Shield } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { MOCK_PROPERTIES } from "@/lib/properties-data"

export default function HomePage() {
  const featuredProperties = MOCK_PROPERTIES.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-sm">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Disponible en toda Colombia</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Encuentra tu Hogar Perfecto en Colombia
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                Descubre casas, apartamentos y habitaciones en arriendo en ciudades de toda Colombia. 
                Conecta directamente con propietarios y encuentra tu hogar ideal hoy mismo.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link href="/properties">
                    <Search className="mr-2 h-5 w-5" />
                    Explorar Propiedades
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-sm">
                  <Link href="/signup">
                    Comenzar Gratis
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">500+</p>
                  <p className="text-sm text-muted-foreground">Propiedades</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">1,000+</p>
                  <p className="text-sm text-muted-foreground">Usuarios</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-pink-600">95%</p>
                  <p className="text-sm text-muted-foreground">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Feature Highlight */}
        <section className="py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Recomendaciones con Inteligencia Artificial</h3>
                  <p className="text-white/90">Encuentra propiedades perfectas para ti basadas en tus preferencias</p>
                </div>
              </div>
              <Button size="lg" variant="secondary" asChild className="shadow-lg">
                <Link href="/signup">
                  Probar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
                ¿Por qué elegir RoomieRent?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                La forma más fácil de encontrar y publicar propiedades en arriendo en Colombia
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Search className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Búsqueda Inteligente</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Filtra por ciudad, tipo de propiedad y precio para encontrar exactamente lo que buscas en segundos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">IA Personalizada</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Recibe recomendaciones personalizadas basadas en tus preferencias y comportamiento de búsqueda.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Contacto Directo</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Conéctate directamente con propietarios para una comunicación más rápida y mejores acuerdos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4">
                    <HomeIcon className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Publicaciones Gratuitas</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Publica tu propiedad gratis y llega a miles de potenciales arrendatarios en toda Colombia.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-indigo-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Análisis en Tiempo Real</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estadísticas de vistas, favoritos y engagement para optimizar tus publicaciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-teal-300 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Seguro y Confiable</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Verificación de usuarios y sistema de reportes para garantizar experiencias seguras.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
                Propiedades Destacadas
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                Descubre algunas de las últimas publicaciones disponibles en Colombia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild className="shadow-lg">
                <Link href="/properties">
                  Ver Todas las Propiedades
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
              ¿Listo para Encontrar tu Hogar?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-pretty">
              Únete a miles de arrendatarios felices que encontraron su espacio perfecto con RoomieRent.
            </p>
            <Button size="lg" variant="secondary" asChild className="shadow-xl">
              <Link href="/properties">
                Comenzar a Explorar
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 RoomieRent. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}