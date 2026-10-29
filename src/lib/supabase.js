import { createClient } from '@supabase/supabase-js';

// Default public Supabase anon configuration (ensures production builds always connect to all 13,167+ landings)
const DEFAULT_SUPABASE_URL = 'https://bmcjgldxpojmvvyofmwu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY2pnbGR4cG9qbXZ2eW9mbXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzA2ODQsImV4cCI6MjEwNzA0NjY4NH0.FTDC8LBS1RFFpjMituYqLzMjUZ6edx0F634jQn03X0g';

// Environment variables for Supabase connection with production fallback
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

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
