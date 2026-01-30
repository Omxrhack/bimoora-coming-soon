import { supabase } from '@/lib/supabase';

/**
 * Envía un código OTP de 6 dígitos al email.
 * @param email - Email del usuario
 * @param isSignup - true para crear usuario nuevo, false para login de usuario existente
 */
export async function requestOtp(email: string, isSignup: boolean = false) {
  // Validación básica de email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { data: null, error: new Error('Email inválido') };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // shouldCreateUser: true crea el usuario si no existe (para registro)
        // shouldCreateUser: false solo envía OTP si el usuario ya existe (para login)
        shouldCreateUser: isSignup,
      },
    });

    return { data, error };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

/**
 * Verifica el código OTP ingresado por el usuario.
 * Si es válido, Supabase crea/obtiene la sesión automáticamente.
 * @param email - Email del usuario
 * @param code - Código OTP de 6 dígitos
 */
export async function verifyOtp(email: string, code: string) {
  // Sanitizar: eliminar espacios y caracteres no numéricos
  const sanitizedCode = code.replace(/\s+/g, '').replace(/[^0-9]/g, '');
  const sanitizedEmail = email.trim().toLowerCase();
  
  // Validación: debe ser exactamente 6 dígitos
  if (!/^\d{6}$/.test(sanitizedCode)) {
    return { data: null, error: new Error('El código debe tener 6 dígitos') };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: sanitizedEmail,
      token: sanitizedCode,
      type: 'email', 
    });

    // Si es exitoso, supabase guarda la sesión automáticamente (persistSession: true)
    return { data, error };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

/**
 * Obtiene la sesión actual del usuario.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

/**
 * Cierra la sesión del usuario.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
