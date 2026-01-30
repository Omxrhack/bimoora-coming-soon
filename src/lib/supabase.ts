import { createClient } from '@supabase/supabase-js';

// URL del proyecto Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
// Clave pública (anon key) para el cliente del navegador
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env');
}

// Cliente para uso en el navegador (browser-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Función helper para crear cliente del servidor (con service role key)
export const createServerClient = (serviceRoleKey: string) => {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
