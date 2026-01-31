"use client";

// ============================================================================
// VERIFY CODE PAGE
// ============================================================================
// REGLA CRÍTICA: Esta página NUNCA debe llamar a signInWithOtp/sendOtp
// automáticamente (en useEffect o al montar). Solo debe verificar el código.
// El único lugar donde se envía OTP es el botón "Reenviar código".
// ============================================================================

import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, Mail, Shield, RefreshCw } from 'lucide-react';
import { resendOtp, verifyOtp } from '@/services/authOtp';

interface VerifyCodeProps {
  /** Email del usuario (se puede pasar como prop o leer de URL) */
  email?: string;
  /** Ruta a redirigir después de verificar exitosamente */
  redirectTo?: string;
}

export default function VerifyCode({
  email: emailProp,
  redirectTo = '/perfil'
}: VerifyCodeProps) {
  // ========================================================================
  // ESTADO
  // ========================================================================

  // Control de hidratación SSR
  const [isMounted, setIsMounted] = useState(false);

  // Datos del formulario
  const [email, setEmail] = useState(emailProp || '');
  const [otpType, setOtpType] = useState<'signup' | 'magiclink' | 'recovery' | 'email'>('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  // Estados de loading
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Mensajes
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cooldown para reenvío (en segundos)
  const [cooldown, setCooldown] = useState(0);

  // Referencias a inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ========================================================================
  // GUARDS ANTI-REPETICIÓN
  // ========================================================================
  // Estos refs previenen dobles llamadas por:
  // - StrictMode de React 18 (desmonta/remonta en dev)
  // - Doble click rápido
  // - Re-renderizados durante operaciones async

  const isVerifyingRef = useRef(false);
  const isResendingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // ========================================================================
  // INICIALIZACIÓN (solo una vez, con guard para StrictMode)
  // ========================================================================
  useEffect(() => {
    // Guard: evitar doble ejecución en StrictMode
    if (hasInitializedRef.current) {
      console.log('[VerifyCode] Init blocked: already initialized');
      return;
    }
    hasInitializedRef.current = true;

    console.log('[VerifyCode] Initializing component');

    // Leer parámetros de URL solo en cliente
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      // Email de URL si no viene por prop
      if (!emailProp) {
        const urlEmail = params.get('email');
        if (urlEmail) {
          const decodedEmail = decodeURIComponent(urlEmail).trim().toLowerCase();
          setEmail(decodedEmail);
          console.log('[VerifyCode] Email from URL:', decodedEmail);
        }
      }

      // Tipo de OTP: SIEMPRE es email para este flujo
      // Ignoramos cualquier parámetro 'type' de la URL para evitar confusiones
      setOtpType('email');
      console.log('[VerifyCode] OTP type forced to: email');
    }

    // Marcar como montado para evitar hydration mismatch
    setIsMounted(true);

    // IMPORTANTE: NO llamamos a sendOtp aquí. El usuario ya tiene un código
    // enviado desde la página de registro/login.
  }, [emailProp]);

  // ========================================================================
  // PERSISTENCIA DE COOLDOWN
  // ========================================================================
  useEffect(() => {
    // Al montar, recuperar cooldown si existe y es válido
    const savedCooldown = sessionStorage.getItem('otp_cooldown');
    const savedTime = sessionStorage.getItem('otp_cooldown_timestamp');

    if (savedCooldown && savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = parseInt(savedCooldown) - elapsed;

      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        sessionStorage.removeItem('otp_cooldown');
        sessionStorage.removeItem('otp_cooldown_timestamp');
      }
    }
  }, []);

  useEffect(() => {
    // Timer del cooldown
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Limpiar storage al terminar
          sessionStorage.removeItem('otp_cooldown');
          sessionStorage.removeItem('otp_cooldown_timestamp');
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
    sessionStorage.setItem('otp_cooldown', seconds.toString());
    sessionStorage.setItem('otp_cooldown_timestamp', Date.now().toString());
  };

  // ========================================================================
  // AUTO-FOCUS (solo después de montar)
  // ========================================================================
  useEffect(() => {
    if (isMounted && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isMounted]);

  // ========================================================================
  // HANDLERS DE INPUT
  // ========================================================================
  const handleCodeChange = useCallback((index: number, value: string) => {
    // Solo permitir dígitos
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    setCode(prev => {
      const newCode = [...prev];
      newCode[index] = digit;
      return newCode;
    });

    // Auto-avanzar al siguiente input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }, []);

  // ========================================================================
  // VERIFICAR CÓDIGO
  // ========================================================================
  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const fullCode = code.join('');

    // Guards anti-repetición
    if (isVerifyingRef.current || isVerifying) return;

    if (fullCode.length !== 6) {
      setError('Ingresa el código completo de 6 dígitos');
      return;
    }

    // Bloquear inmediatamente
    isVerifyingRef.current = true;
    setIsVerifying(true);
    setError(null);
    setSuccess(null);

    // Usamos el servicio robusto que maneja tipos automáticamente
    const result = await verifyOtp(email, fullCode, otpType);

    setIsVerifying(false);

    if (result.error) {
      isVerifyingRef.current = false;
      // Usamos el mensaje normalizado del servicio
      setError(result.message || 'Error al verificar');

      // Limpiar código si es inválido
      if (result.isInvalid || result.isExpired) {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } else {
      setSuccess('¡Verificado! Redirigiendo...');
      // No liberamos isVerifyingRef para evitar doble submit durante redirect
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    }
  }, [code, email, otpType, isVerifying, redirectTo]);

  // ========================================================================
  // REENVIAR CÓDIGO
  // ========================================================================
  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResendingRef.current || isResending) return;

    isResendingRef.current = true;
    setIsResending(true);
    setError(null);
    setSuccess(null);

    const result = await resendOtp(email);

    setIsResending(false);
    isResendingRef.current = false;

    if (result.error) {
      // Usar mensaje normalizado o fallback
      const msg = (result.error as any).message || '';

      if (result.isRateLimited || msg.includes('rate') || msg.includes('limit')) {
        const waitTime = result.retryAfterSeconds || 60;
        setError(`Demasiados intentos. Espera ${waitTime} segundos.`);
        startCooldown(waitTime);
      } else {
        setError('No se pudo reenviar el código. Intenta más tarde.');
        startCooldown(30); // Cooldown defensivo
      }
    } else {
      setSuccess('¡Nuevo código enviado! Revisa tu correo.');
      startCooldown(60);

      // Reset inputs
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setOtpType('email'); // Reset a tipo email estándar
    }
  }, [cooldown, email, isResending]);

  // ========================================================================
  // RENDER
  // ========================================================================
  const fullCode = code.join('');

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      {/* Decorative particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.5s' }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <a
            href="/auth/crear-cuenta"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al registro
          </a>

          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/20 mb-4">
              <Shield className="w-8 h-8 text-[#A89CFF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">
              Verificar código
            </h1>
            <p className="text-[#6B7280]">
              Ingresa el código de 6 dígitos enviado a
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-[#A89CFF]" />
              <span className="font-medium text-[#1E1B4B]">
                {isMounted ? email : <span className="inline-block w-40 h-5 bg-[#E8D4F8]/30 rounded animate-pulse" />}
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-[#A89CFF]/10 p-8 border border-[#E8D4F8]/30">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Inputs de código OTP */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1E1B4B] text-center">
                  Código de verificación
                </label>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isVerifying}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-[#E8D4F8] bg-white text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all hover:border-[#A89CFF]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Dígito ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-[#9CA3AF]">
                  El código expira en 60 minutos
                </p>
              </div>

              {/* Success message */}
              {success && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 text-center font-medium">{success}</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 text-center font-medium">{error}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                type="submit"
                disabled={isVerifying || fullCode.length !== 6}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#A89CFF]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  'Verificar código'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8D4F8]/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#9CA3AF]">
                  ¿No recibiste el código?
                </span>
              </div>
            </div>

            {/* Resend button with countdown */}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#E8D4F8] text-[#A89CFF] font-medium rounded-xl hover:bg-[#A89CFF]/5 hover:border-[#A89CFF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? (
                'Enviando...'
              ) : cooldown > 0 ? (
                `Reenviar en ${cooldown}s`
              ) : (
                'Reenviar código'
              )}
            </button>

            {/* Change email link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => window.location.href = '/auth/crear-cuenta'}
                className="text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"
              >
                ← Usar otro correo electrónico
              </button>
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-xs text-[#9CA3AF]">
            Si no encuentras el correo, revisa tu carpeta de spam
          </p>
        </div>
      </div>
    </div>
  );
}
