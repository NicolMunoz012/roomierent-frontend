// lib/types/recommendations.ts

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  ROOM = "ROOM",
  STUDIO = "STUDIO",
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  UNAVAILABLE = "UNAVAILABLE",
}

export interface PropertyResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  
  address: string;
  city: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  
  bedrooms: number;
  bathrooms: number;
  area: number;
  
  amenities: string[];
  imageUrls: string[];
  
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  
  viewCount: number;
  favoriteCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesResponse {
  id: number;
  preferredCity: string | null;
  preferredNeighborhoods: string[];
  minPrice: number | null;
  maxPrice: number | null;
  preferredType: PropertyType | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  minArea: number | null;
  desiredAmenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesRequest {
  preferredCity?: string;
  preferredNeighborhoods?: string[];
  minPrice?: number;
  maxPrice?: number;
  preferredType?: PropertyType;
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  desiredAmenities?: string[];
}

export interface RecommendationStrategy {
  name: string;
  description: string;
  weight: number;
}