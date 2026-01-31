"use client";

// ============================================================================
// REQUEST CODE PAGE
// ============================================================================
// Esta página envía OTP al email del usuario.
// ÚNICA ubicación donde se llama sendOtp (además del botón Reenviar en VerifyCode).
// ============================================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { sendOtp } from '@/services/authOtp';
import { ArrowLeft, Mail } from 'lucide-react';

interface RequestCodeProps {
  /** true para registro (crear usuario), false para login */
  isSignupMode?: boolean;
  /** Ruta a redirigir después de enviar el código */
  redirectTo?: string;
}

export default function RequestCode({
  isSignupMode = false,
  redirectTo = '/auth/verificar-codigo'
}: RequestCodeProps) {
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(isSignupMode);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // ========================================================================
  // GUARDS ANTI-REPETICIÓN
  // ========================================================================
  const isSubmittingRef = useRef(false);

  // ========================================================================
  // PERSISTENCIA DE COOLDOWN
  // ========================================================================
  useEffect(() => {
    // Al montar, recuperar cooldown si existe y es válido
    const savedCooldown = sessionStorage.getItem('req_otp_cooldown');
    const savedTime = sessionStorage.getItem('req_otp_cooldown_timestamp');

    if (savedCooldown && savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = parseInt(savedCooldown) - elapsed;

      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        sessionStorage.removeItem('req_otp_cooldown');
        sessionStorage.removeItem('req_otp_cooldown_timestamp');
      }
    }
  }, []);

  // ========================================================================
  // COOLDOWN TIMER
  // ========================================================================
  // Se activa si hay rate limit
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Limpiar storage al terminar
          sessionStorage.removeItem('req_otp_cooldown');
          sessionStorage.removeItem('req_otp_cooldown_timestamp');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Helper para guardar cooldown
  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    sessionStorage.setItem('req_otp_cooldown', seconds.toString());
    sessionStorage.setItem('req_otp_cooldown_timestamp', Date.now().toString());
  };

  // ========================================================================
  // SUBMIT HANDLER
  // ========================================================================
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guards anti-repetición
    if (isSubmittingRef.current || isLoading || cooldown > 0) {
      console.log('[RequestCode] Submit blocked: already submitting, loading, or cooldown active');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Ingresa un email válido');
      return;
    }

    // Bloquear inmediatamente
    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    console.log('[RequestCode] Calling sendOtp for:', trimmedEmail, 'isSignup:', isSignup);

    const result = await sendOtp(trimmedEmail, isSignup);

    setIsLoading(false);
    isSubmittingRef.current = false;

    if (result.error) {
      // Usar mensaje normalizado o fallback
      const msg = (result.error as any).message || '';

      if (result.isRateLimited || msg.includes('rate') || msg.includes('limit')) {
        const waitTime = result.retryAfterSeconds || 60;
        setError(`Demasiados intentos. Espera ${waitTime} segundos.`);
        startCooldown(waitTime);
      } else {
        if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
          setError('No existe una cuenta con este email. ¿Quieres registrarte?');
        } else {
          setError(msg || 'No se pudo enviar el código.');
        }
      }
    } else {
      setSuccess('¡Código enviado! Revisa tu correo electrónico.');

      // IMPORTANTE: Solo navegamos si NO hubo error (incluyendo rate limits 429)
      // Si hubo error, el usuario permanece aquí para ver el mensaje.
      setTimeout(() => {
        const type = isSignup ? 'signup' : 'email';
        window.location.href = `${redirectTo}?email=${encodeURIComponent(trimmedEmail)}&type=${type}`;
      }, 1500);
    }
  }, [email, isSignup, isLoading, cooldown, redirectTo]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </a>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-[#A89CFF]/10 p-8 border border-[#E8D4F8]/30">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/20 mb-4">
                <Mail className="w-7 h-7 text-[#A89CFF]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">
                {isSignup ? 'Crear cuenta' : 'Iniciar sesión'}
              </h1>
              <p className="text-[#6B7280]">
                Te enviaremos un código de 6 dígitos a tu correo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1E1B4B] mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSignup}
                  onChange={(e) => setIsSignup(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-[#E8D4F8] text-[#A89CFF] focus:ring-[#A89CFF]/50"
                />
                <span className="text-sm text-[#6B7280]">
                  Crear cuenta nueva (registro)
                </span>
              </label>

              {/* Success message */}
              {success && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 text-center font-medium">{success}</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim() || cooldown > 0}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </span>
                ) : cooldown > 0 ? (
                  `Espera ${cooldown}s`
                ) : (
                  'Enviar código'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7280]">
              {isSignup ? (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="text-[#A89CFF] hover:underline font-medium"
                  >
                    Iniciar sesión
                  </button>
                </>
              ) : (
                <>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-[#A89CFF] hover:underline font-medium"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </p>

            <div className="mt-4 text-center">
              <a
                href="/auth/acceder"
                className="text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"
              >
                O inicia sesión con contraseña
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
