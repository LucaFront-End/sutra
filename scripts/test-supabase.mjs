if (typeof WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bmcjgldxpojmvvyofmwu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY2pnbGR4cG9qbXZ2eW9mbXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzA2ODQsImV4cCI6MjEwNzA0NjY4NH0.FTDC8LBS1RFFpjMituYqLzMjUZ6edx0F634jQn03X0g';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: { enabled: false },
});

async function testConnection() {
  console.log('Testing connection to Supabase...');

  // 1. Try querying 'SUTRA SEO LANDING'
  console.log('\n--- Querying table "SUTRA SEO LANDING" ---');
  const { data, error, count } = await supabase
    .from('SUTRA SEO LANDING')
    .select('*', { count: 'exact' })
    .limit(3);

  if (error) {
    console.error('Error querying "SUTRA SEO LANDING":', error);
  } else {
    console.log(`Success! Total count in Supabase table: ${count}`);
    if (data && data.length > 0) {
      console.log('Columns in table:', Object.keys(data[0]));
      console.log('Sample row 0:', data[0]);
    }
  }

  // 2. Query a specific slug
  const testSlug = 'velas-de-arena-aguascalientes';
  console.log(`\n--- Querying slug: "${testSlug}" ---`);
  
  // Let's test different query styles
  const res1 = await supabase
    .from('SUTRA SEO LANDING')
    .select('*')
    .eq('Slug', testSlug)
    .maybeSingle();

  console.log('Query with .eq("Slug", testSlug):', res1.error ? res1.error : (res1.data ? 'Found!' : 'null'));
  if (res1.data) {
    console.log('Row details:', {
      Titulo: res1.data.Titulo,
      Slug: res1.data.Slug,
      TituloPagina: res1.data['Título de página'],
      Excerpt: res1.data.Excerpt,
      TituloSEO: res1.data['Titulo de SEO'],
      Metadescripcion: res1.data['Metadescripción'],
    });
  }
}

testConnection().catch(console.error);
