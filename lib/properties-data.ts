export interface Property {
  id: string
  title: string
  type: "house" | "apartment" | "room"
  city: string
  neighborhood: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  description: string
  amenities: string[]
  contactInfo: {
    name: string
    phone: string
    email: string
  }
  ownerId: string
  createdAt: string
}

export const COLOMBIAN_CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Cúcuta",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
  "Ibagué",
  "Manizales",
  "Villavicencio",
  "Armenia",
  "Pasto",
  "Neiva",
]

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-001",
    title: "Modern Apartment in El Poblado",
    type: "apartment",
    city: "Medellín",
    neighborhood: "El Poblado",
    address: "Carrera 43A #10-50",
    price: 2500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    images: ["/modern-apartment-medellin-el-poblado.jpg"],
    description:
      "Beautiful modern apartment in the heart of El Poblado. Close to restaurants, shopping centers, and nightlife. Perfect for young professionals or couples.",
    amenities: ["WiFi", "Parking", "Gym", "Pool", "Security 24/7"],
    contactInfo: {
      name: "Carlos Rodríguez",
      phone: "+57 300 123 4567",
      email: "carlos.rodriguez@example.com",
    },
    ownerId: "owner-001",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prop-002",
    title: "Spacious House in Chapinero",
    type: "house",
    city: "Bogotá",
    neighborhood: "Chapinero",
    address: "Calle 63 #7-45",
    price: 4200000,
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images: ["/spacious-house-bogota-chapinero.jpg"],
    description:
      "Large family house in traditional Chapinero neighborhood. Includes backyard, garage for 2 cars, and modern kitchen. Great for families.",
    amenities: ["WiFi", "Parking", "Backyard", "Laundry Room", "Storage"],
    contactInfo: {
      name: "María González",
      phone: "+57 310 987 6543",
      email: "maria.gonzalez@example.com",
    },
    ownerId: "owner-002",
    createdAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "prop-003",
    title: "Cozy Room in Bocagrande",
    type: "room",
    city: "Cartagena",
    neighborhood: "Bocagrande",
    address: "Avenida San Martín #8-120",
    price: 800000,
    bedrooms: 1,
    bathrooms: 1,
    area: 25,
    images: ["/cozy-room-cartagena-bocagrande-beach.jpg"],
    description:
      "Private room with ocean view in shared apartment. Perfect for students or digital nomads. Walking distance to the beach and restaurants.",
    amenities: ["WiFi", "Air Conditioning", "Shared Kitchen", "Beach Access"],
    contactInfo: {
      name: "Ana Martínez",
      phone: "+57 315 456 7890",
      email: "ana.martinez@example.com",
    },
    ownerId: "owner-003",
    createdAt: "2025-01-25T09:15:00Z",
  },
  {
    id: "prop-004",
    title: "Luxury Apartment in Ciudad Jardín",
    type: "apartment",
    city: "Cali",
    neighborhood: "Ciudad Jardín",
    address: "Calle 16 Norte #9N-25",
    price: 3800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: ["/luxury-apartment-cali-ciudad-jardin.jpg"],
    description:
      "Elegant apartment in exclusive Ciudad Jardín area. Features modern finishes, balcony with city views, and access to premium amenities.",
    amenities: ["WiFi", "Parking", "Pool", "Gym", "BBQ Area", "Security 24/7"],
    contactInfo: {
      name: "Luis Hernández",
      phone: "+57 320 234 5678",
      email: "luis.hernandez@example.com",
    },
    ownerId: "owner-004",
    createdAt: "2025-02-01T11:00:00Z",
  },
  {
    id: "prop-005",
    title: "Student Room near Universidad del Norte",
    type: "room",
    city: "Barranquilla",
    neighborhood: "Riomar",
    address: "Calle 82 #52-100",
    price: 650000,
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    images: ["/student-room-barranquilla-university.jpg"],
    description:
      "Affordable room perfect for students. Close to Universidad del Norte and public transportation. Includes utilities and internet.",
    amenities: ["WiFi", "Utilities Included", "Study Desk", "Shared Kitchen"],
    contactInfo: {
      name: "Pedro Sánchez",
      phone: "+57 318 765 4321",
      email: "pedro.sanchez@example.com",
    },
    ownerId: "owner-005",
    createdAt: "2025-02-05T16:45:00Z",
  },
  {
    id: "prop-006",
    title: "Penthouse with Mountain Views",
    type: "apartment",
    city: "Bucaramanga",
    neighborhood: "Cabecera",
    address: "Carrera 36 #48-120",
    price: 5500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    images: ["/penthouse-bucaramanga-mountain-views.jpg"],
    description:
      "Stunning penthouse with panoramic mountain views. Top floor with private terrace, jacuzzi, and premium finishes throughout.",
    amenities: ["WiFi", "Parking", "Terrace", "Jacuzzi", "Gym", "Security 24/7", "Elevator"],
    contactInfo: {
      name: "Sandra López",
      phone: "+57 312 345 6789",
      email: "sandra.lopez@example.com",
    },
    ownerId: "owner-006",
    createdAt: "2025-02-10T13:20:00Z",
  },
]

export function getProperties(): Property[] {
  if (typeof window === "undefined") return MOCK_PROPERTIES
  const stored = localStorage.getItem("smartrent_properties")
  const userProperties = stored ? JSON.parse(stored) : []
  return [...MOCK_PROPERTIES, ...userProperties]
}

export function saveProperty(property: Property): void {
  const properties = getProperties()
  properties.push(property)
  localStorage.setItem("smartrent_properties", JSON.stringify(properties))
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id)
}

export function getUserProperties(userId: string): Property[] {
  return getProperties().filter((p) => p.ownerId === userId)
}
