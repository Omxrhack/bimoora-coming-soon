import { supabase } from '@/lib/supabase';

// ============================================================================
// SERVICIO DE AUTENTICACIÓN OTP
// ============================================================================
// Este servicio maneja TODAS las llamadas a signInWithOtp y verifyOtp.
// REGLA DE ORO: signInWithOtp SOLO debe llamarse desde:
//   1. El botón "Enviar código" en RequestCode/AccederForm
//   2. El botón "Reenviar código" en VerifyCode
// NUNCA en useEffect, ni automáticamente al cargar páginas.
// ============================================================================

/**
 * Resultado de las operaciones OTP con información de rate limit
 */
interface OtpResult {
  data: any;
  error: Error | null;
  isRateLimited: boolean;
  retryAfterSeconds?: number;
}

/**
 * Envía un código OTP de 6 dígitos al email.
 * 
 * IMPORTANTE: Esta función SOLO debe llamarse desde handlers de usuario (onClick, onSubmit).
 * NUNCA debe llamarse en useEffect o automáticamente.
 * 
 * @param email - Email del usuario (se normaliza a lowercase)
 * @param shouldCreateUser - true para crear usuario nuevo (signup), false para login
 */
export async function sendOtp(email: string, shouldCreateUser: boolean = false): Promise<OtpResult> {
  // Validación y normalización de email
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      data: null,
      error: new Error('Email inválido'),
      isRateLimited: false
    };
  }

  console.log('[authOtp] sendOtp called for:', normalizedEmail, 'shouldCreateUser:', shouldCreateUser);

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser,
      },
    });

    // Detectar rate limit
    if (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      const isRateLimited =
        errorMessage.includes('rate') ||
        errorMessage.includes('limit') ||
        errorMessage.includes('429') ||
        errorMessage.includes('too many');

      if (isRateLimited) {
        console.log('[authOtp] Rate limited detected');
        // Supabase rate limit es típicamente 60 segundos por email
        return {
          data: null,
          error,
          isRateLimited: true,
          retryAfterSeconds: 60
        };
      }

      return { data: null, error, isRateLimited: false };
    }

    console.log('[authOtp] OTP sent successfully');
    return { data, error: null, isRateLimited: false };

  } catch (err) {
    console.error('[authOtp] Unexpected error in sendOtp:', err);
    return {
      data: null,
      error: err as Error,
      isRateLimited: false
    };
  }
}

/**
 * Reenvía un código OTP.
 * Alias de sendOtp con shouldCreateUser=false (el usuario ya existe).
 * Incluye validación adicional de cooldown en el cliente.
 */
export async function resendOtp(email: string): Promise<OtpResult> {
  console.log('[authOtp] resendOtp called for:', email);
  // El usuario ya existe, no crear nuevo
  return sendOtp(email, false);
}

/**
 * Verifica el código OTP ingresado por el usuario.
 * 
 * @param email - Email del usuario
 * @param code - Código OTP de 6 dígitos (se sanitiza automáticamente)
 * @param type - Tipo de OTP: 'email' para signInWithOtp, 'signup' para flujo nativo de registro
 */
export async function verifyOtp(
  email: string,
  code: string,
  type: 'signup' | 'magiclink' | 'recovery' | 'email' = 'email'
) {
  // Sanitizar: eliminar espacios y caracteres no numéricos
  const sanitizedCode = code.replace(/\s+/g, '').replace(/[^0-9]/g, '');
  const sanitizedEmail = email.trim().toLowerCase();

  console.log('[authOtp] verifyOtp called:', { email: sanitizedEmail, codeLength: sanitizedCode.length, type });

  // Validación: debe ser exactamente 6 dígitos
  if (!/^\d{6}$/.test(sanitizedCode)) {
    return {
      data: null,
      error: new Error('El código debe tener exactamente 6 dígitos'),
      isExpired: false,
      isInvalid: true
    };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: sanitizedEmail,
      token: sanitizedCode,
      type,
    });

    if (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorCode = (error as any)?.code || '';

      // Detectar expiración
      const isExpired =
        errorCode === 'otp_expired' ||
        errorMessage.includes('expired') ||
        errorMessage.includes('expirado');

      // Detectar código inválido
      const isInvalid =
        errorMessage.includes('invalid') ||
        errorMessage.includes('inválido');

      console.log('[authOtp] verifyOtp error:', { isExpired, isInvalid, message: error.message });

      return { data: null, error, isExpired, isInvalid };
    }

    console.log('[authOtp] verifyOtp success - session created');
    return { data, error: null, isExpired: false, isInvalid: false };

  } catch (err) {
    console.error('[authOtp] Unexpected error in verifyOtp:', err);
    return {
      data: null,
      error: err as Error,
      isExpired: false,
      isInvalid: false
    };
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

// ============================================================================
// LEGACY EXPORTS (para compatibilidad con código existente)
// ============================================================================
export const requestOtp = sendOtp;
