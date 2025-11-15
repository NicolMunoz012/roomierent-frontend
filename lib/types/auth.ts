// lib/types/auth.ts

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isLandlord: boolean;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  isLandlord: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isLandlord: boolean;
}