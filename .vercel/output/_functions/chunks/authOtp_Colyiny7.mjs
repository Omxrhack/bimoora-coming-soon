import { s as supabase } from './supabase_D7K0YZcd.mjs';

async function requestOtp(email, isSignup = false) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { data: null, error: new Error("Email inválido") };
  }
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // shouldCreateUser: true crea el usuario si no existe (para registro)
        // shouldCreateUser: false solo envía OTP si el usuario ya existe (para login)
        shouldCreateUser: isSignup
      }
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}
async function verifyOtp(email, code, type = "email") {
  const sanitizedCode = code.replace(/\s+/g, "").replace(/[^0-9]/g, "");
  const sanitizedEmail = email.trim().toLowerCase();
  if (!/^\d{6}$/.test(sanitizedCode)) {
    return { data: null, error: new Error("El código debe tener 6 dígitos") };
  }
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: sanitizedEmail,
      token: sanitizedCode,
      type
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export { requestOtp as r, verifyOtp as v };
