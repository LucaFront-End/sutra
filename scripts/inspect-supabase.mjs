if (typeof WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bmcjgldxpojmvvyofmwu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY2pnbGR4cG9qbXZ2eW9mbXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzA2ODQsImV4cCI6MjEwNzA0NjY4NH0.FTDC8LBS1RFFpjMituYqLzMjUZ6edx0F634jQn03X0g';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectTable() {
  console.log('Inspecting "SUTRA SEO LANDING"...');

  // Test insert of 1 test row from CSV to see if columns and write permissions work
  const testRow = {
    Titulo: 'Velas de arena Aguascalientes',
    Slug: 'velas-de-arena-aguascalientes',
    'Ciudad o Zona': 'Aguascalientes',
    Estado: 'Aguascalientes',
    'Título de página': 'Velas de arena en Aguascalientes',
    Excerpt: 'Inspiración para velas de arena en Aguascalientes: explora materiales, estilos y detalles con Sutra México.',
    'Titulo de SEO': 'Descubre velas de arena en Aguascalientes | Sutra México',
    'Metadescripción': '¿Buscas velas de arena en Aguascalientes? Conoce la colección de Sutra México, compara alternativas y encuentra inspiración para tu ocasión.',
    'Frase de búsqueda': 'velas de arena',
    'Párrafo SEO amplio': 'Pensar en velas de arena en Aguascalientes es también pensar en la ocasión, el ambiente y los detalles que deseas destacar. Las velas de arena utilizan cera vegetal perlada que puede colocarse en recipientes adecuados y combinarse con mechas compatibles.'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('SUTRA SEO LANDING')
    .insert([testRow])
    .select();

  console.log('Insert test result:', insertError ? insertError : insertData);

  // Read back
  const { data: readData, error: readError, count } = await supabase
    .from('SUTRA SEO LANDING')
    .select('*', { count: 'exact' });

  console.log('Read back result count:', count, 'data length:', readData?.length);
  if (readData && readData.length > 0) {
    console.log('Row 0:', readData[0]);
  }
}

inspectTable().catch(console.error);
