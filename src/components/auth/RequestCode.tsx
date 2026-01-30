"use client";

import { useState } from 'react';
import { requestOtp } from '@/services/authOtp';

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
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(isSignupMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const { error: otpError } = await requestOtp(trimmedEmail, isSignup);

    setLoading(false);

    if (otpError) {
      const msg = (otpError as Error)?.message || 'No se pudo enviar el código.';
      
      // Manejar rate limit
      if (msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('limit')) {
        setError('Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.');
      } else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
        setError('No existe una cuenta con este email. ¿Quieres registrarte?');
      } else {
        setError(msg);
      }
    } else {
      setMessage('¡Código enviado! Revisa tu correo electrónico.');
      // Redirigir a verificación con el email como parámetro
      setTimeout(() => {
        window.location.href = `${redirectTo}?email=${encodeURIComponent(trimmedEmail)}`;
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white dark:bg-[#1A1726] rounded-2xl shadow-xl p-8 border border-[#E8D4F8]/30 dark:border-[#A89CFF]/20">
        <h1 className="text-2xl font-bold text-[#1E1B4B] dark:text-white mb-2 text-center">
          {isSignup ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="text-[#6B7280] dark:text-[#A8A3B8] text-center mb-6">
          Te enviaremos un código de 6 dígitos a tu correo
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-[#1E1B4B] dark:text-white mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E8D4F8] dark:border-[#A89CFF]/30 bg-white dark:bg-[#252133] text-[#1E1B4B] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B6680] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSignup}
              onChange={(e) => setIsSignup(e.target.checked)}
              className="w-4 h-4 rounded border-[#E8D4F8] dark:border-[#A89CFF]/30 text-[#A89CFF] focus:ring-[#A89CFF]/50"
            />
            <span className="text-sm text-[#6B7280] dark:text-[#A8A3B8]">
              Crear cuenta nueva (registro)
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar código'
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
            <p className="text-sm text-green-700 dark:text-green-400 text-center">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#A8A3B8]">
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
      </div>
    </div>
  );
}
