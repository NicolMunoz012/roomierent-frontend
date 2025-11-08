import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, HomeIcon, Users } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { MOCK_PROPERTIES } from "@/lib/properties-data"

export default function HomePage() {
  const featuredProperties = MOCK_PROPERTIES.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Serving all of Colombia</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">
                Find Your Perfect Home in Colombia
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                Discover houses, apartments, and rooms for rent in cities across Colombia. Connect directly with
                property owners and find your dream home today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="shadow-lg">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Why Choose SmartRent?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                The easiest way to find and list rental properties across Colombia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Easy Search</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Filter by city, property type, and price to find exactly what you're looking for in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Direct Contact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect directly with property owners for faster communication and better deals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <HomeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Free Listings</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    List your property for free and reach thousands of potential renters across Colombia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Featured Properties</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                Check out some of the latest listings available across Colombia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Find Your Home?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-pretty">
              Join thousands of happy renters who found their perfect space with SmartRent.
            </p>
            <Button size="lg" variant="secondary" asChild className="shadow-lg">
              <Link href="/properties">Start Browsing Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 RoomieRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
