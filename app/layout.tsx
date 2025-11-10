import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "RoomieRent - Encuentra tu Hogar Perfecto",
  description: "Descubre casas, apartamentos y habitaciones en arriendo con recomendaciones personalizadas por inteligencia artificial",
  keywords: ["arriendo", "apartamentos", "casas", "habitaciones", "inmuebles", "Colombia", "Pasto", "IA"],
  authors: [{ name: "RoomieRent" }],
  openGraph: {
    title: "RoomieRent - Encuentra tu Hogar Perfecto",
    description: "Descubre propiedades en arriendo con IA",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}