// lib/api/recommendations.ts

import { PropertyResponse, UserPreferencesResponse, UserPreferencesRequest } from "@/lib/types/recommendations";
import { getAuthHeaders } from "@/lib/auth-context";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roomierent-backend-production-a2c7.up.railway.app/api';

export async function getRecommendations(limit: number = 10): Promise<PropertyResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/recommendations?limit=${limit}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized');
    }
    throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
  }

  return response.json();
}

export async function getSimilarProperties(propertyId: number): Promise<PropertyResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/similar/${propertyId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch similar properties: ${response.statusText}`);
  }

  return response.json();
}

export async function getUserPreferences(): Promise<UserPreferencesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/preferences`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
  }

  return response.json();
}

export async function saveUserPreferences(
  preferences: UserPreferencesRequest
): Promise<UserPreferencesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/preferences`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to save user preferences: ${response.statusText}`);
  }

  return response.json();
}

export async function buildGraph(): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/build-graph`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to build graph: ${response.statusText}`);
  }
}