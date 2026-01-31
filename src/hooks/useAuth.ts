import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, RegisterData, LoginData, OAuthProvider } from '../models/types/user';

/**
 * Hook useAuth - Capa Controller (MVC)
 * Maneja el estado de autenticación y conecta la vista con el servicio
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Registrar usuario
  const register = useCallback(async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      const response = await authService.register(data);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Iniciar sesión
  const login = useCallback(async (data: LoginData) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Login con OAuth
  const loginWithOAuth = useCallback(async (provider: OAuthProvider) => {
    setIsSubmitting(true);
    try {
      const response = await authService.loginWithOAuth(provider);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Cerrar sesión
  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await authService.logout();
      if (response.success) {
        setUser(null);
      }
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Recuperar contraseña
  const resetPassword = useCallback(async (email: string) => {
    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword(email);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Actualizar contraseña
  const updatePassword = useCallback(async (newPassword: string) => {
    setIsSubmitting(true);
    try {
      const response = await authService.updatePassword(newPassword);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    // Estado
    user,
    isLoading,
    isSubmitting,
    isAuthenticated: !!user,

    // Acciones
    register,
    login,
    loginWithOAuth,
    logout,
    resetPassword,
    updatePassword,
  };
};
