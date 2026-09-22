import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pwatvfjziewfhkopznyo.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_5S9SdOua_cuUN-kq_y2qRg_VE8fWsSv';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
