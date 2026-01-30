"use client";

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Mail, Shield, RefreshCw } from 'lucide-react';
import { requestOtp, verifyOtp } from '@/services/authOtp';

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
  // Leer email de props o de la URL
  const getInitialEmail = () => {
    if (emailProp) return emailProp;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('email') || '';
    }
    return '';
  };

  const [email, setEmail] = useState(getInitialEmail);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Guards para evitar doble envío (StrictMode, doble click)
  const isVerifyingRef = useRef(false);
  const isResendingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Leer email de URL al montar en cliente (con guard para StrictMode)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    
    if (!emailProp && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email');
      if (urlEmail) setEmail(decodeURIComponent(urlEmail).trim().toLowerCase());
    }
  }, [emailProp]);

  // Cooldown timer para reenvío
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Auto-focus en el primer input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir dígitos
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-avanzar al siguiente input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevenir submit con Enter (el formulario solo debe enviarse con el botón)
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    // Retroceder con backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      // Solo focus, NO auto-submit
      inputRefs.current[5]?.focus();
    }
  };

  const fullCode = code.join('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Guard reforzado: evitar doble submit
    if (isVerifyingRef.current) {
      console.log('[VerifyCode] Blocked: already verifying');
      return;
    }
    if (loading) {
      console.log('[VerifyCode] Blocked: loading state');
      return;
    }
    
    if (fullCode.length !== 6) {
      setError('Ingresa el código completo de 6 dígitos');
      return;
    }

    // Bloquear inmediatamente
    isVerifyingRef.current = true;
    setLoading(true);
    setError(null);
    setInfo(null);
    
    console.log('[VerifyCode] Calling verifyOtp...');

    const { error: verifyError } = await verifyOtp(email, fullCode);
    
    console.log('[VerifyCode] verifyOtp result:', verifyError ? 'error' : 'success');

    setLoading(false);
    // NO liberar isVerifyingRef aquí para evitar doble llamada durante redirect

    if (verifyError) {
      // Solo liberar si hay error (para permitir reintentar)
      isVerifyingRef.current = false;
      
      const msg = (verifyError as Error)?.message || 'Código inválido.';
      const errCode = (verifyError as any)?.code || '';
      
      // Detectar error de expiración por código o mensaje
      if (errCode === 'otp_expired' || msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('expirado')) {
        setError('Tu código ha expirado o ya fue usado. Solicita uno nuevo haciendo clic en "Reenviar código".');
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('inválido')) {
        setError('Código inválido. Verifica que ingresaste los 6 dígitos correctamente.');
      } else {
        setError('Código inválido o ya utilizado. Solicita uno nuevo.');
      }
      
      // Limpiar código en error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setInfo('¡Verificado! Redirigiendo...');
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    }
  };

  const handleResend = async () => {
    // Guard: evitar doble envío
    if (cooldown > 0 || isResendingRef.current || resending) return;
    
    isResendingRef.current = true;
    setResending(true);
    setError(null);
    setInfo(null);

    const { error: resendError } = await requestOtp(email, false);

    setResending(false);
    isResendingRef.current = false;

    if (resendError) {
      const msg = (resendError as Error)?.message || '';
      if (msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('limit')) {
        setError('Demasiados intentos. Espera unos minutos.');
        setCooldown(120); // 2 minutos de cooldown en rate limit
      } else {
        setError('No se pudo reenviar el código. Intenta más tarde.');
      }
    } else {
      setInfo('¡Nuevo código enviado! Revisa tu correo (también spam).');
      setCooldown(60); // 60 segundos de cooldown normal
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

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
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 dark:bg-[#0F0D1A]/80 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <a
            href="/auth/crear-cuenta"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#A8A3B8] hover:text-[#A89CFF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al registro
          </a>

          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/20 dark:from-[#A89CFF]/10 dark:to-[#E8D4F8]/10 mb-4">
              <Shield className="w-8 h-8 text-[#A89CFF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B4B] dark:text-white mb-2">
              Verificar código
            </h1>
            <p className="text-[#6B7280] dark:text-[#A8A3B8]">
              Ingresa el código de 6 dígitos enviado a
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-[#A89CFF]" />
              <span className="font-medium text-[#1E1B4B] dark:text-white">{email}</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/80 dark:bg-[#1A1726]/80 backdrop-blur-md rounded-2xl shadow-xl shadow-[#A89CFF]/10 p-8 border border-[#E8D4F8]/30 dark:border-[#A89CFF]/20">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Email oculto */}
              <input type="hidden" value={email} />

              {/* Inputs de código OTP */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1E1B4B] dark:text-white text-center">
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
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-[#E8D4F8] dark:border-[#A89CFF]/30 bg-white dark:bg-[#252133] text-[#1E1B4B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all hover:border-[#A89CFF]/50"
                      aria-label={`Dígito ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-[#9CA3AF] dark:text-[#6B6680]">
                  El código expira en 5 minutos
                </p>
              </div>

              {/* Success message */}
              {info && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-xl">
                  <p className="text-sm text-green-700 dark:text-green-400 text-center font-medium">{info}</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-400 text-center font-medium">{error}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || fullCode.length !== 6 || isVerifyingRef.current}
                onClick={(e) => {
                  // Protección adicional contra doble click
                  if (isVerifyingRef.current || loading) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#A89CFF]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                {loading ? (
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
                <div className="w-full border-t border-[#E8D4F8]/50 dark:border-[#A89CFF]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#1A1726] text-[#9CA3AF] dark:text-[#6B6680]">
                  ¿No recibiste el código?
                </span>
              </div>
            </div>

            {/* Resend button */}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#E8D4F8] dark:border-[#A89CFF]/30 text-[#A89CFF] font-medium rounded-xl hover:bg-[#A89CFF]/5 hover:border-[#A89CFF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? (
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
                className="text-sm text-[#6B7280] dark:text-[#A8A3B8] hover:text-[#A89CFF] transition-colors"
              >
                ← Usar otro correo electrónico
              </button>
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-xs text-[#9CA3AF] dark:text-[#6B6680]">
            Si no encuentras el correo, revisa tu carpeta de spam
          </p>
        </div>
      </div>
    </div>
  );
}
