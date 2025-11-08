"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para los iconos de Leaflet en Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

interface LocationMapProps {
  initialLat?: number
  initialLng?: number
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({
  onLocationSelect,
  initialPosition
}: {
  onLocationSelect: (lat: number, lng: number) => void
  initialPosition?: L.LatLng
}) {
  const [position, setPosition] = useState<L.LatLng | null>(initialPosition || null)

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  )
}

export function LocationMap({ initialLat = 1.2136, initialLng = -77.2811, onLocationSelect }: LocationMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center border-2 border-border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-border">
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        key={key}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          initialPosition={undefined}
        />
      </MapContainer>
    </div>
  )
}