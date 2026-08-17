import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbtqxiyjemfjmabstquk.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_quXZy0Nl4tzukD46PTCAxg_0rJCeBT-';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase URL or Publishable key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
