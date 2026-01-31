// Tipos para el modelo de Usuario
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

// Tipos para registro
export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

// Tipos para login
export interface LoginData {
  email: string;
  password: string;
}

// Tipos para respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
  error?: string;
}

// Tipos para providers de OAuth
export type OAuthProvider = 'google' | 'github' | 'apple';
