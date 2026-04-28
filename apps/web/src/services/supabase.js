import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this warning explicit so misconfigured deployments fail loudly.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const createStatelessSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

export const isSupabaseUnavailable = (err) => {
  if (!err) return false;
  const msg = String(err.message || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('network request failed')
  );
};

export const getSupabaseErrorMessage = (err, fallbackMessage) => {
  const message =
    err?.message ||
    err?.error_description ||
    err?.details ||
    err?.hint;
  return typeof message === 'string' && message.trim() ? message : fallbackMessage;
};

export default supabase;
