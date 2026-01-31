import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vnkmbuqpczjmklkgwrgv.supabase.co";
const supabaseAnonKey = "sb_publishable_tRUEjdfTwrDTPQHgbGJbew_TXbgg0yZ";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase as s };
