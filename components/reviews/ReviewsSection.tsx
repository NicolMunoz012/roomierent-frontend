"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  getReviews,
  getReviewStats,
  createReview,
  deleteReview,
  sortReviews,
  filterByRating,
  groupByRating,
  calculateLocalStats,
  type Review,
  type ReviewStats,
  type ReviewRequest,
} from "@/lib/reviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Trash2, TrendingUp, Filter } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ReviewsSectionProps {
  propertyId: number
}

export function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Estado
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formulario
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  // Filtros y ordenamiento (Estructura de datos: Set para filtros activos)
  const [sortBy, setSortBy] = useState<"date" | "rating-high" | "rating-low">("date")
  const [minRating, setMinRating] = useState(1)
  const [activeFilters, setActiveFilters] = useState(new Set<string>())

  // Modal de confirmación
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)

  // Cargar datos
  useEffect(() => {
    loadData()
  }, [propertyId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        getReviews(propertyId, token || undefined),
        getReviewStats(propertyId),
      ])
      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error("Error cargando reseñas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Crear reseña
  const handleSubmit = async () => {
    if (!token || !user) {
      toast({ title: "Debes iniciar sesión", variant: "destructive" })
      return
    }

    if (comment.trim().length < 10) {
      toast({ title: "El comentario debe tener al menos 10 caracteres", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      const request: ReviewRequest = {
        propertyId,
        rating,
        comment: comment.trim(),
      }

      await createReview(request, token)

      toast({ title: "✅ Reseña publicada" })

      // Limpiar formulario
      setRating(5)
      setComment("")

      // Recargar datos
      await loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo publicar la reseña",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar reseña
  const handleDelete = async () => {
    if (!token || !reviewToDelete) return

    try {
      await deleteReview(reviewToDelete, propertyId, token)
      toast({ title: "✅ Reseña eliminada" })
      setReviewToDelete(null)
      await loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la reseña",
        variant: "destructive",
      })
    }
  }

  // Aplicar filtros y ordenamiento usando estructuras de datos
  const getFilteredReviews = (): Review[] => {
    let filtered = reviews

    // Filtrar por rating mínimo (Array.filter)
    if (minRating > 1) {
      filtered = filterByRating(filtered, minRating)
      activeFilters.add("rating")
    } else {
      activeFilters.delete("rating")
    }

    // Ordenar (Array.sort)
    filtered = sortReviews(filtered, sortBy)

    setActiveFilters(new Set(activeFilters)) // Actualizar Set
    return filtered
  }

  const filteredReviews = getFilteredReviews()

  // Calcular estadísticas locales adicionales
  const localStats = calculateLocalStats(reviews)

  // Agrupar por rating (Map)
  const groupedReviews = groupByRating(reviews)

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Estadísticas de Reseñas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Promedio */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats?.averageRating.toFixed(1) || "0.0"}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (stats?.averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.totalReviews || 0} reseñas
              </p>
            </div>

            {/* Mediana */}
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {localStats.median.toFixed(1)}
              </div>
              <p className="text-sm font-semibold mb-1">Mediana</p>
              <p className="text-xs text-muted-foreground">
                Valor central de calificaciones
              </p>
            </div>

            {/* Moda */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {localStats.mode}
                <Star className="inline h-6 w-6 ml-1 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm font-semibold mb-1">Más Común</p>
              <p className="text-xs text-muted-foreground">
                Calificación más frecuente
              </p>
            </div>
          </div>

          {/* Distribución de ratings */}
          {stats && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold mb-3">Distribución de Calificaciones</p>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution[star - 1]
                const percentage = stats.totalReviews > 0
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0

                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {count} ({percentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario de nueva reseña */}
      {user && user.role === "TENANT" && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Deja tu Reseña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de estrellas */}
            <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold">
                  {rating} {rating === 1 ? "estrella" : "estrellas"}
                </span>
              </div>
            </div>

            {/* Comentario */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comentario</Label>
              <Textarea
                id="comment"
                placeholder="Comparte tu experiencia... (mínimo 10 caracteres)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/1000 caracteres
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || comment.trim().length < 10}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Publicando..." : "Publicar Reseña"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filtros y ordenamiento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Reseñas ({filteredReviews.length})
            </CardTitle>
            {activeFilters.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSortBy("date")
                  setMinRating(1)
                  setActiveFilters(new Set())
                }}
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Ordenar */}
            <div className="flex-1 space-y-2">
              <Label>Ordenar por</Label>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Más recientes</SelectItem>
                  <SelectItem value="rating-high">Mayor calificación</SelectItem>
                  <SelectItem value="rating-low">Menor calificación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtrar por rating mínimo */}
            <div className="flex-1 space-y-2">
              <Label>Calificación mínima</Label>
              <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ estrellas</SelectItem>
                  <SelectItem value="2">2+ estrellas</SelectItem>
                  <SelectItem value="3">3+ estrellas</SelectItem>
                  <SelectItem value="4">4+ estrellas</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="space-y-4 mt-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay reseñas que coincidan con los filtros</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {review.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReviewToDelete(review.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.createdAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar reseña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Tu reseña será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}