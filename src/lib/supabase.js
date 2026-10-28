import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('TU_SUPABASE_URL')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

const rawTable = import.meta.env.VITE_SUPABASE_LANDINGS_TABLE || 'SUTRA SEO LANDING';
export const DEFAULT_LANDINGS_TABLE = rawTable.replace(/^"|"$/g, '').trim();

const rawTiendasTable = import.meta.env.VITE_SUPABASE_TIENDAS_TABLE || 'SUTRA SEO TIENDA';
export const DEFAULT_TIENDAS_TABLE = rawTiendasTable.replace(/^"|"$/g, '').trim();

