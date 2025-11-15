// hooks/useRecommendations.ts

import { useState, useEffect, useCallback } from 'react';
import { PropertyResponse } from '@/lib/types/recommendations';
import { useAuth } from '@/lib/auth-context';  
import { getRecommendations, getSimilarProperties } from '@/lib/api/recommendations';
import { useRouter } from 'next/navigation';

export function useRecommendations(limit: number = 10) {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();  // ← AGREGADO

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getRecommendations(limit);
      setProperties(data);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      
      if (err.message === 'Unauthorized' || err.message.includes('No authentication token')) {
        router.push('/login');
        return;
      }
      
      setError(err.message || 'No pudimos obtener tus recomendaciones. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [limit, router]);

  useEffect(() => {
    // Verificar autenticación usando el contexto
    if (!isAuthenticated || !token) {  // ← CAMBIADO
      router.push('/login');
      return;
    }

    fetchRecommendations();
  }, [fetchRecommendations, router, isAuthenticated, token]);  
  return {
    properties,
    isLoading,
    error,
    refetch: fetchRecommendations,
  };
}

export function useSimilarProperties() {
  const [similarProperties, setSimilarProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilar = useCallback(async (propertyId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSimilarProperties(propertyId);
      setSimilarProperties(data);
    } catch (err: any) {
      console.error('Error fetching similar properties:', err);
      setError(err.message || 'Error al cargar propiedades similares');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSimilar = useCallback(() => {
    setSimilarProperties([]);
    setError(null);
  }, []);

  return {
    similarProperties,
    isLoading,
    error,
    fetchSimilar,
    clearSimilar,
  };
}