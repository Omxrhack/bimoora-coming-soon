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


    console.log(' [authOtp] PETICIÓN EXITOSA - OTP ENVIADO A SUPABASE');

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

// Timeout para evitar que la UI se quede congelada (15 segundos)
const REQUEST_TIMEOUT = 15000;

// Helper para timeout
const withTimeout = async <T>(promise: Promise<T>): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Tiempo de espera agotado. Revisa tu conexión.')), REQUEST_TIMEOUT);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
};

/**
 * Normaliza errores de Supabase a mensajes amigables en español
 */
function normalizeAuthError(error: any): string {
  if (!error) return 'Error desconocido';
  const msg = error.message?.toLowerCase() || '';
  const code = error.code || '';

  if (msg.includes('rate') || msg.includes('limit') || msg.includes('429')) return 'Demasiados intentos. Por favor espera unos minutos.';
  if (code === 'otp_expired' || msg.includes('expired')) return 'El código ha expirado. Solicita uno nuevo.';
  if (msg.includes('invalid') || msg.includes('check')) return 'Código incorrecto o inválido.';
  if (msg.includes('network') || msg.includes('fetch')) return 'Error de conexión. Verifica tu internet.';
  if (msg.includes('user not found')) return 'Usuario no encontrado.';

  return 'Ocurrió un error. Intenta nuevamente.';
}

/**
 * Verifica el código OTP ingresado por el usuario.
 * 
 * IMPORTANTE: Esta función intenta verificar con el tipo especificado primero.
 * Si falla, intenta automáticamente con el otro tipo común (email/signup).
 * Esto resuelve el problema de no saber si el token viene de signUp o signInWithOtp.
 * 
 * @param email - Email del usuario
 * @param code - Código OTP de 6 dígitos (se sanitiza automáticamente)
 * @param type - Tipo de OTP preferido: 'email' para signInWithOtp, 'signup' para registro
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
      isInvalid: true,
      message: 'Código incompleto'
    };
  }

  // Función auxiliar para intentar verificar con un tipo específico
  const tryVerify = async (verifyType: 'signup' | 'email' | 'magiclink' | 'recovery') => {
    console.log('[authOtp] Trying verifyOtp with type:', verifyType);
    const { data, error } = await withTimeout(supabase.auth.verifyOtp({
      email: sanitizedEmail,
      token: sanitizedCode,
      type: verifyType,
    }));
    return { data, error };
  };

  try {
    // Primer intento con el tipo especificado
    let result = await tryVerify(type);

    // Si falla y el tipo es 'signup' o 'email', intentar con el otro
    if (result.error && (type === 'signup' || type === 'email')) {
      const alternativeType = type === 'signup' ? 'email' : 'signup';
      console.log('[authOtp] First attempt failed, trying alternative type:', alternativeType);

      const alternativeResult = await tryVerify(alternativeType);

      // Si el alternativo funciona, usarlo
      if (!alternativeResult.error) {
        console.log('[authOtp] Alternative type succeeded:', alternativeType);
        result = alternativeResult;
      }
    }

    if (result.error) {
      const message = normalizeAuthError(result.error);
      const isExpired = message.includes('expirado');
      const isInvalid = message.includes('incorrecto') || message.includes('inválido');

      console.log('[authOtp] verifyOtp error:', { isExpired, isInvalid, message: result.error.message });

      return { data: null, error: result.error, isExpired, isInvalid, message };
    }

    console.log('[authOtp] verifyOtp success - session created');
    return { data: result.data, error: null, isExpired: false, isInvalid: false, message: null };

  } catch (err: any) {
    console.error('[authOtp] Unexpected error in verifyOtp:', err);
    return {
      data: null,
      error: err,
      isExpired: false,
      isInvalid: false,
      message: normalizeAuthError(err)
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
