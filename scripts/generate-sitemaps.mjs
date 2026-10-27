import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const BASE_URL = 'https://www.sutramexico.com';
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. SITEMAP PRINCIPAL (Páginas institucionales e inicio)
const MAIN_PAGES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/tienda', changefreq: 'daily', priority: '0.9' },
  { url: '/eventos', changefreq: 'weekly', priority: '0.9' },
  { url: '/nosotros', changefreq: 'monthly', priority: '0.8' },
  { url: '/comunidad', changefreq: 'weekly', priority: '0.8' },
  { url: '/mysterybox', changefreq: 'weekly', priority: '0.9' },
  { url: '/contacto', changefreq: 'monthly', priority: '0.7' },
];

// 2. SITEMAP DE LANDINGS DINÁMICAS (Categorías y colecciones del catálogo)
const LANDING_PAGES = [
  { url: '/tienda/all', changefreq: 'daily', priority: '0.9', title: 'Catálogo de Velas de Arena y Rituales' },
  { url: '/tienda/velas', changefreq: 'daily', priority: '0.9', title: 'Velas de Arena y Velas en Polvo' },
  { url: '/tienda/aromas', changefreq: 'weekly', priority: '0.85', title: 'Esencias Aromáticas y Home Sprays' },
  { url: '/tienda/accesorios', changefreq: 'weekly', priority: '0.85', title: 'Accesorios y Objetos Rituales' },
  { url: '/tienda/accesorios/jardin-zen', changefreq: 'weekly', priority: '0.8', title: 'Jardines Zen Artesanales' },
  { url: '/tienda/accesorios/cartas-rituales', changefreq: 'weekly', priority: '0.8', title: 'Cartas de Rituales y Mindfulness' },
  { url: '/tienda/accesorios/vasijas', changefreq: 'weekly', priority: '0.8', title: 'Vasijas Cerámicas Wabi-Sabi' },
  { url: '/tienda/te', changefreq: 'weekly', priority: '0.85', title: 'Tés e Infusiones Orgánicas' },
];

// 3. PRODUCTOS DINÁMICOS
const PRODUCTS = [
  {
    slug: 'vela-en-polvo-aroma-toronja-ritual-mente-clara',
    name: 'Vela en Polvo Aroma Toronja - Ritual Mente Clara',
    desc: 'Toronja fresca, 500g cera vegetal en polvo y 5 pabilos. Despeja tu mente y encuentra claridad con cera vegetal perlada.',
    image: 'https://static.wixstatic.com/media/45119e_bbf4162042e44913a8b3c074f6886a3a~mv2.png',
  },
  {
    slug: 'vela-en-polvo-aroma-manzanilla-ritual-abrazo-de-calma',
    name: 'Vela en Polvo Aroma Manzanilla - Ritual Abrazo de Calma',
    desc: 'Manzanilla suave, 500g cera vegetal en polvo y 5 pabilos. Transforma tus espacios en un refugio de serenidad.',
    image: 'https://static.wixstatic.com/media/45119e_3dcd6587d9c442a098762ac23c2f9d3c~mv2.png',
  },
  {
    slug: 'vela-en-polvo-aroma-copal-ritual-limpia-aura',
    name: 'Vela en Polvo Aroma Copal - Ritual Limpia Aura',
    desc: 'Copal sagrado, 500g cera vegetal en polvo y 5 pabilos. Renueva la energía de tus espacios soltando lo que ya no necesitas.',
    image: 'https://static.wixstatic.com/media/45119e_566fd41b9cde44d78bcd744aac5eb39a~mv2.png',
  },
  {
    slug: 'vela-en-polvo-aroma-mandarina-ritual-luz-alegre',
    name: 'Vela en Polvo Aroma Mandarina - Ritual Luz Alegre',
    desc: 'Mandarina chispeante, 500g cera vegetal en polvo y 5 pabilos. Llena tus espacios de alegría y vitalidad.',
    image: 'https://static.wixstatic.com/media/45119e_ffb1d6fa94d9458e857658e6feea2b27~mv2.png',
  },
  {
    slug: 'vela-en-polvo-aroma-lavanda-ritual-noche-serena',
    name: 'Vela en Polvo Aroma Lavanda - Ritual Noche Serena',
    desc: 'Lavanda francesa, 500g cera vegetal en polvo y 5 pabilos. Prepara cuerpo y mente para un descanso profundo y reparador.',
    image: 'https://static.wixstatic.com/media/45119e_85bdfa4ac0d247c582270391db2b6422~mv2.png',
  },
  {
    slug: 'p-vela-1',
    name: 'Vela Ritual Noche Serena',
    desc: 'Lavanda salvaje, sándalo y cera vegetal pura perlada. Hasta 120 horas de combustión limpia y reutilizable.',
    image: `${BASE_URL}/assets/images/cera-blanca.jpg`,
  },
  {
    slug: 'p-vela-2',
    name: 'Vela Ritual Luz de Luna',
    desc: 'Jazmín blanco, madera de cedro y cera pura en vaso de vidrio soplado artesanal ámbar ahumado.',
    image: `${BASE_URL}/assets/images/cat-velas.png`,
  },
  {
    slug: 'p-vela-3',
    name: 'Kit Ritual Candle Completo',
    desc: '500g cera granulada botánica, vasija de cerámica artesanal, 30 mechas de algodón y esencia aromática.',
    image: `${BASE_URL}/assets/images/category-candle.png`,
  },
  {
    slug: 'p-zen-1',
    name: 'Jardín Zen Artesanal 12"',
    desc: 'Bandeja de madera maciza torneada, 1.2 kg arena de cuarzo mineral, piedras de río y rastrillo de bambú.',
    image: `${BASE_URL}/assets/images/cat-jardin-zen.jpg`,
  },
  {
    slug: 'p-cartas-1',
    name: 'Baraja de Rituales Diarios "Pausa"',
    desc: 'Mazo de 30 cartas de intención con guía de meditación y libreto impreso de mindfulness.',
    image: `${BASE_URL}/assets/images/cartas-rituales.jpg`,
  },
  {
    slug: 'p-vasijas-1',
    name: 'Vasija Wabi-Sabi en Cerámica Gres',
    desc: 'Pieza escultórica modelada y esmaltada a mano por alfareros mexicanos horneada a 1,280°C.',
    image: `${BASE_URL}/assets/images/vasijas.jpg`,
  },
  {
    slug: 'p-aroma-1',
    name: 'Home Spray Amanecer Dorado',
    desc: 'Bruma ambiental botánica con bergamota de Calabria y flor de azahar.',
    image: `${BASE_URL}/assets/images/cat-sprays.png`,
  },
  {
    slug: 'esencia-madera-rosé-rosewood',
    name: 'Esencia "Madera Rosé" Rosewood',
    desc: 'Esencia pura concentrada para velas de arena de cera perlada con palo de rosa y cedro blanco.',
    image: 'https://static.wixstatic.com/media/45119e_a0916ab2abfe4b5e879a34baaf7833a1~mv2.png',
  },
  {
    slug: 'esencia-limpia-aura-copal',
    name: 'Esencia "Limpia Aura" Copal',
    desc: 'Esencia botánica para velas de arena con resina pura de copal blanco silvestre de Oaxaca.',
    image: 'https://static.wixstatic.com/media/45119e_1cea18a09df44703897b7b7af038eade~mv2.png',
  },
  {
    slug: 'p-aroma-2',
    name: 'Difusor Mikado Bosque Interior',
    desc: 'Difusor continuo con varillas de ratán natural con pino silvestre, cedro atlas y musgo húmedo.',
    image: `${BASE_URL}/assets/images/cat-difusores.png`,
  },
  {
    slug: 'p-aroma-3',
    name: 'Aceite Esencial Templo de Humo',
    desc: 'Destilado puro grado terapéutico con sándalo australiano, mirra sagrada y copal blanco mexicano.',
    image: `${BASE_URL}/assets/images/cat-aceites.png`,
  },
  {
    slug: 'p-tea-1',
    name: 'Ritual Tea "Calma Oriental"',
    desc: 'Infusión botánica relajante libre de cafeína con flores enteras de manzanilla, lavanda y té blanco puro.',
    image: `${BASE_URL}/assets/images/cat-te-ceremonial.jpg`,
  },
  {
    slug: 'p-tea-2',
    name: 'Ritual Tea "Despertar Zen"',
    desc: 'Té verde sencha orgánico de Japón con jazmín y menta fresca piperita.',
    image: `${BASE_URL}/assets/images/category-tea.png`,
  },
  {
    slug: 'misterybox-ritual-completo-velas-flotantes-y-velas-de-arena',
    name: 'Sutra Mystery Box · Ritual Completo',
    desc: 'Suscripción bimestral con entrega cada 2 meses. Incluye 500g cera en arena, vasija artesanal y 2 aromas sorpresa.',
    image: `${BASE_URL}/assets/images/mystery-box-hero.jpg`,
  },
  {
    slug: 'misterybox-esencial',
    name: 'Sutra Mystery Box · Ritual Esencial',
    desc: 'Suscripción bimestral de recarga con 500g cera en arena Sutra, 2 aromas botánicos y mechas.',
    image: `${BASE_URL}/assets/images/mystery-box-esencial.jpg`,
  },
];

// 4. ARTÍCULOS DINÁMICOS DEL BLOG / COMUNIDAD
const BLOG_ARTICLES = [
  {
    id: 'arte-de-pausar',
    title: 'El arte de pausar: Cómo crear un santuario de descanso en tu hogar',
    desc: 'En un mundo que glorifica la prisa constante, detenerte 15 minutos al día no es una pérdida de tiempo: es el acto supremo de autocuidado.',
    image: `${BASE_URL}/assets/images/cat-velas.png`,
  },
  {
    id: 'ritual-jardin-zen',
    title: 'Jardines Zen: Meditación activa a través del movimiento de la arena',
    desc: 'Aprende cómo el trazado de líneas circulares y ondas en la arena puede reducir la sobrecarga mental en minutos.',
    image: `${BASE_URL}/assets/images/cat-jardin-zen.jpg`,
  },
  {
    id: 'ceremonia-del-te',
    title: 'La ceremonia del té: Cultivando presencia en cada sorbo',
    desc: 'El agua caliente, las hojas expandiéndose y el aroma ascendente: un ancla inmediata al momento presente.',
    image: `${BASE_URL}/assets/images/cat-te-ceremonial.jpg`,
  },
  {
    id: 'cartas-de-intencion',
    title: 'Cartas de rituales: Cómo establecer una brújula emocional matutina',
    desc: 'Antes de revisar tu teléfono o tu lista de pendientes, consulta una carta de intención para orientar tu día.',
    image: `${BASE_URL}/assets/images/cartas-rituales.jpg`,
  },
];

// GENERADOR SITEMAP MAIN (Institucional)
function generateMainSitemap() {
  const urls = MAIN_PAGES.map((page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// GENERADOR SITEMAP LANDINGS DINÁMICAS (Categorías y Colecciones)
function generateLandingsSitemap() {
  const urls = LANDING_PAGES.map((page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// GENERADOR SITEMAP PRODUCTOS DINÁMICOS (Con metadatos de imágenes de Google)
function generateProductsSitemap() {
  const urls = PRODUCTS.map((prod) => `  <url>
    <loc>${BASE_URL}/producto/${escapeXml(prod.slug)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <image:image>
      <image:loc>${escapeXml(prod.image)}</image:loc>
      <image:title>${escapeXml(prod.name)}</image:title>
      <image:caption>${escapeXml(prod.desc)}</image:caption>
    </image:image>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

// GENERADOR SITEMAP BLOG / COMUNIDAD (Con metadatos e imágenes)
function generateBlogSitemap() {
  const urls = BLOG_ARTICLES.map((art) => `  <url>
    <loc>${BASE_URL}/comunidad/${escapeXml(art.id)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
    <image:image>
      <image:loc>${escapeXml(art.image)}</image:loc>
      <image:title>${escapeXml(art.title)}</image:title>
      <image:caption>${escapeXml(art.desc)}</image:caption>
    </image:image>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

// GENERADOR SITEMAP INDEX (Maestro general)
function generateIndexSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Sitemap 1: Páginas Principales e Institucionales -->
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <!-- Sitemap 2: Landings Dinámicas y Categorías -->
  <sitemap>
    <loc>${BASE_URL}/sitemap-landings.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <!-- Sitemap 3: Páginas Dinámicas de Productos (con Imágenes) -->
  <sitemap>
    <loc>${BASE_URL}/sitemap-productos.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <!-- Sitemap 4: Páginas Dinámicas de Comunidad y Blog -->
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// GENERADOR ROBOTS.TXT
function generateRobotsTxt() {
  return `# Robots.txt oficial de Sutra México
User-agent: *
Allow: /
Disallow: /cuenta
Disallow: /mi-cuenta
Disallow: /login

# Sitemaps Index oficial con sub-sitemaps agrupados
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-main.xml
Sitemap: ${BASE_URL}/sitemap-landings.xml
Sitemap: ${BASE_URL}/sitemap-productos.xml
Sitemap: ${BASE_URL}/sitemap-blog.xml
`;
}

// EXECUTE GENERATION
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

console.log('Generando estructura de sitemaps divididos por grupos...');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateIndexSitemap(), 'utf-8');
console.log('✓ Creado: public/sitemap.xml (Sitemap Index maestro)');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-main.xml'), generateMainSitemap(), 'utf-8');
console.log('✓ Creado: public/sitemap-main.xml (Páginas principales)');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-landings.xml'), generateLandingsSitemap(), 'utf-8');
console.log('✓ Creado: public/sitemap-landings.xml (Landings dinámicas de categorías)');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-productos.xml'), generateProductsSitemap(), 'utf-8');
console.log('✓ Creado: public/sitemap-productos.xml (Páginas dinámicas de producto con metainformación de imágenes)');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'), generateBlogSitemap(), 'utf-8');
console.log('✓ Creado: public/sitemap-blog.xml (Artículos dinámicos de blog con imágenes)');

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), generateRobotsTxt(), 'utf-8');
console.log('✓ Creado: public/robots.txt (Directivas de rastreo e indexación)');

console.log('¡Todos los sitemaps y robots.txt generados con éxito!');
