// app/recommendations/page.tsx
"use client";

import { useState } from 'react';
import { useRecommendations, useSimilarProperties } from '@/hooks/useRecommendations';
import RecommendationsList from '@/components/recommendations/RecommendationsList';
import LoadingSkeleton from '@/components/recommendations/LoadingSkeleton';
import ErrorState from '@/components/recommendations/ErrorState';
import SimilarPropertiesModal from '@/components/recommendations/SimilarPropertiesModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const { properties, isLoading, error, refetch } = useRecommendations(12);
  const {
    similarProperties,
    isLoading: isLoadingSimilar,
    error: errorSimilar,
    fetchSimilar,
    clearSimilar,
  } = useSimilarProperties();

  const [showSimilarModal, setShowSimilarModal] = useState(false);

  const handleViewSimilar = async (propertyId: number) => {
    await fetchSimilar(propertyId);
    setShowSimilarModal(true);
  };

  const handleCloseSimilarModal = () => {
    setShowSimilarModal(false);
    clearSimilar();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Recomendaciones para ti
              </h1>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">
                Basado en tus preferencias y comportamiento dentro de la plataforma
              </p>
            </div>
            
            <Button asChild className="gap-2">
              <Link href="/preferences">
                <Settings className="h-4 w-4" />
                Ajustar Preferencias
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <LoadingSkeleton />}
        
        {error && <ErrorState message={error} onRetry={refetch} />}
        
        {!isLoading && !error && (
          <>
            {/* Results count */}
            {properties.length > 0 && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Encontramos{' '}
                  <span className="font-semibold text-foreground">
                    {properties.length}
                  </span>{' '}
                  propiedades recomendadas para ti
                </p>
              </div>
            )}

            <RecommendationsList
              properties={properties}
              onViewSimilar={handleViewSimilar}
            />
          </>
        )}
      </div>

      {/* Similar properties modal */}
      <SimilarPropertiesModal
        isOpen={showSimilarModal}
        onClose={handleCloseSimilarModal}
        properties={similarProperties}
        isLoading={isLoadingSimilar}
        error={errorSimilar}
        onViewSimilar={handleViewSimilar}
      />
    </div>
  );
}