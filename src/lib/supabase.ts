import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'dummy-key';

// Check if we are running with valid credentials
export const isSupabaseConfigured =
  supabaseUrl !== 'https://dummy.supabase.co' && supabaseKey !== 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
