import { supabase } from '../lib/supabase';
import type { RegisterData, LoginData, AuthResponse, OAuthProvider, User } from '../models/types/user';

/**
 * Servicio de autenticación - Capa Model (MVC)
 * Maneja toda la lógica de autenticación con Supabase
 */
export const authService = {
  /**
   * Registrar un nuevo usuario
   * NOTA: No envía email de confirmación automático. El OTP se envía manualmente después.
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
          },
          // Desactivar el envío automático de email de confirmación
          // El OTP se enviará manualmente desde el componente
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        return {
          success: false,
          message: 'Error al registrar usuario',
          error: error.message,
        };
      }

      // Si necesita confirmación de email
      if (authData.user && !authData.session) {
        return {
          success: true,
          message: 'Por favor, revisa tu correo para confirmar tu cuenta.',
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            full_name: authData.user.user_metadata?.full_name,
            created_at: authData.user.created_at,
          },
        };
      }

      return {
        success: true,
        message: '¡Registro exitoso!',
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email!,
          full_name: authData.user.user_metadata?.full_name,
          created_at: authData.user.created_at,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al registrar',
        error: String(error),
      };
    }
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Mensajes de error más amigables
        let friendlyMessage = 'Error al iniciar sesión';
        if (error.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMessage = 'Por favor, confirma tu email antes de iniciar sesión';
        }
        
        return {
          success: false,
          message: friendlyMessage,
          error: error.message,
        };
      }

      return {
        success: true,
        message: '¡Bienvenido de nuevo!',
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email!,
          full_name: authData.user.user_metadata?.full_name,
          created_at: authData.user.created_at,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión',
        error: String(error),
      };
    }
  },

  /**
   * Iniciar sesión con proveedor OAuth (Google, GitHub, Apple)
   */
  async loginWithOAuth(provider: OAuthProvider): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return {
          success: false,
          message: `Error al conectar con ${provider}`,
          error: error.message,
        };
      }

      // OAuth siempre redirige, así que si llegamos aquí está funcionando
      return {
        success: true,
        message: `Redirigiendo a ${provider}...`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error inesperado con ${provider}`,
        error: String(error),
      };
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: 'Error al cerrar sesión',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Sesión cerrada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al cerrar sesión',
        error: String(error),
      };
    }
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Recuperar contraseña
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: 'Error al enviar email de recuperación',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Te hemos enviado un enlace para restablecer tu contraseña',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado',
        error: String(error),
      };
    }
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          message: 'Error al actualizar contraseña',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado',
        error: String(error),
      };
    }
  },

  /**
   * Escuchar cambios en la sesión
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        });
      } else {
        callback(null);
      }
    });
  },
};
