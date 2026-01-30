"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { getSession } from '@/services/authOtp';
import { supabase } from '@/lib/supabase';

interface PrivateRouteProps {
  children: ReactNode;
  /** Ruta a redirigir si no hay sesión */
  redirectTo?: string;
}

export default function PrivateRoute({ 
  children, 
  redirectTo = '/auth/solicitar-codigo' 
}: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { session, error } = await getSession();
      
      if (mounted) {
        if (error) {
          console.error('Error checking session:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
        setLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setIsAuthenticated(!!session);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Guardar la ubicación actual para redirigir después del login
      const currentPath = window.location.pathname + window.location.search;
      const redirectUrl = `${redirectTo}?returnTo=${encodeURIComponent(currentPath)}`;
      window.location.href = redirectUrl;
    }
  }, [loading, isAuthenticated, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 dark:from-[#0F0D1A] dark:via-[#1A1726] dark:to-[#0F0D1A]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#A8A3B8]">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Mientras redirige, mostrar loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 dark:from-[#0F0D1A] dark:via-[#1A1726] dark:to-[#0F0D1A]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#A8A3B8]">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
