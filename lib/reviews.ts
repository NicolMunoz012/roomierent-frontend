// lib/reviews.ts

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`


const reviewsCache = new Map<number, Review[]>()

/**
 * Map: Caché de estadísticas
 * Clave: propertyId, Valor: ReviewStats
 */
const statsCache = new Map<number, ReviewStats>()

/**
 * Set: IDs de propiedades ya cargadas (evita duplicados)
 */
const loadedProperties = new Set<number>()

// ===== INTERFACES =====

export interface Review {
  id: number
  propertyId: number
  userId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
  canDelete: boolean
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: number[] // [1star, 2star, 3star, 4star, 5star]
}

export interface ReviewRequest {
  propertyId: number
  rating: number
  comment: string
}

// ===== FUNCIONES API =====

/**
 * Obtiene reseñas con sistema de caché (Map)
 * Patrón: Cache-Aside Pattern
 */
export async function getReviews(propertyId: number, token?: string): Promise<Review[]> {
  // 1. Verificar caché (Map.has y Map.get - O(1))
  if (reviewsCache.has(propertyId)) {
    console.log("✅ Reseñas obtenidas de caché")
    return reviewsCache.get(propertyId)!
  }

  // 2. Fetch desde API
  const headers: HeadersInit = token 
    ? { "Authorization": `Bearer ${token}` }
    : {}

  const response = await fetch(`${API_URL}/property/${propertyId}`, {
    headers,
    cache: "no-store",
  })

  if (!response.ok) return []

  const reviews: Review[] = await response.json()

  // 3. Guardar en caché (Map.set - O(1))
  reviewsCache.set(propertyId, reviews)
  loadedProperties.add(propertyId) // Set.add - O(1)

  console.log(`✅ ${reviews.length} reseñas cargadas para propiedad ${propertyId}`)

  return reviews
}

/**
 * Obtiene estadísticas con caché
 */
export async function getReviewStats(propertyId: number): Promise<ReviewStats> {
  // Verificar caché
  if (statsCache.has(propertyId)) {
    return statsCache.get(propertyId)!
  }

  const response = await fetch(`${API_URL}/property/${propertyId}/stats`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [0, 0, 0, 0, 0],
    }
  }

  const stats: ReviewStats = await response.json()
  
  // Guardar en caché
  statsCache.set(propertyId, stats)

  return stats
}

/**
 * Crea una nueva reseña e invalida caché
 */
export async function createReview(
  request: ReviewRequest,
  token: string
): Promise<Review> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al crear reseña")
  }

  const newReview: Review = await response.json()

  // Invalidar caché (Map.delete - O(1))
  reviewsCache.delete(request.propertyId)
  statsCache.delete(request.propertyId)

  console.log("✅ Reseña creada y caché invalidada")

  return newReview
}

/**
 * Elimina una reseña e invalida caché
 */
export async function deleteReview(
  reviewId: number,
  propertyId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al eliminar reseña")
  }

  // Invalidar caché
  reviewsCache.delete(propertyId)
  statsCache.delete(propertyId)

  console.log("✅ Reseña eliminada y caché invalidada")
}

/**
 * Limpia toda la caché (útil al hacer logout)
 */
export function clearReviewsCache(): void {
  reviewsCache.clear()
  statsCache.clear()
  loadedProperties.clear()
  console.log("✅ Caché de reseñas limpiada")
}

/**
 * Verifica si las reseñas de una propiedad están en caché
 * Set.has - O(1)
 */
export function areReviewsLoaded(propertyId: number): boolean {
  return loadedProperties.has(propertyId)
}

// ===== UTILIDADES CON ESTRUCTURAS DE DATOS =====

/**
 * Ordena reseñas por diferentes criterios
 * Utiliza: Array.sort con comparadores personalizados
 */
export function sortReviews(
  reviews: Review[],
  sortBy: "date" | "rating-high" | "rating-low"
): Review[] {
  const sorted = [...reviews] // Copia para no mutar original

  switch (sortBy) {
    case "date":
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case "rating-high":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "rating-low":
      return sorted.sort((a, b) => a.rating - b.rating)
    default:
      return sorted
  }
}

/**
 * Filtra reseñas por rating
 * Utiliza: Array.filter - O(n)
 */
export function filterByRating(reviews: Review[], minRating: number): Review[] {
  return reviews.filter(review => review.rating >= minRating)
}

/**
 * Agrupa reseñas por rating
 * Utiliza: Map para agrupación eficiente
 */
export function groupByRating(reviews: Review[]): Map<number, Review[]> {
  const groups = new Map<number, Review[]>()

  // Inicializar grupos (1-5 estrellas)
  for (let i = 1; i <= 5; i++) {
    groups.set(i, [])
  }

  // Agrupar reseñas
  for (const review of reviews) {
    const group = groups.get(review.rating)!
    group.push(review)
  }

  return groups
}

/**
 * Calcula estadísticas locales de un array de reseñas
 * Demuestra uso de reduce y operaciones matemáticas
 */
export function calculateLocalStats(reviews: Review[]): {
  average: number
  median: number
  mode: number
} {
  if (reviews.length === 0) {
    return { average: 0, median: 0, mode: 0 }
  }

  // Promedio
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  const average = Math.round((sum / reviews.length) * 10) / 10

  // Mediana (ordenar y tomar el valor central)
  const sorted = [...reviews].sort((a, b) => a.rating - b.rating)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1].rating + sorted[mid].rating) / 2
    : sorted[mid].rating

  // Moda (valor más frecuente) - usa Map para conteo
  const counts = new Map<number, number>()
  for (const review of reviews) {
    counts.set(review.rating, (counts.get(review.rating) || 0) + 1)
  }
  
  let mode = 1
  let maxCount = 0
  for (const [rating, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count
      mode = rating
    }
  }

  return { average, median, mode }
}