/**
 * SUTRA MEXICO — Content Data Proxy
 * Phase 1: Static content layer (will be replaced by Wix Headless CMS in Phase 2)
 * All copy and asset paths centralized here for easy CMS migration.
 */

import heroImg from '../assets/images/hero-lifestyle.png';
import categoryZen from '../assets/images/category-zen.png';
import categoryCandle from '../assets/images/category-candle.png';
import categoryAromas from '../assets/images/category-aromas.png';
import categoryTea from '../assets/images/category-tea.png';

/* ——— Navigation ——— */
export const navLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Objetos de Ritual', href: '#categorias' },
  { label: 'Velas de Arena', href: '#categorias' },
  { label: 'Aromas', href: '#categorias' },
  { label: 'Tés', href: '#categorias' },
  { label: 'Rituals', href: '#rituales' },
  { label: 'Nosotros', href: '#concepto' },
  { label: 'Journal', href: '#' },
  { label: 'Contacto', href: '#newsletter' },
];

/* ——— Hero ——— */
export const heroContent = {
  tagline: 'Bienestar Premium',
  title: 'Convierte momentos\ncotidianos en rituales.',
  subtitle: 'Velas, aromas y experiencias diseñadas para reconectar contigo.',
  ctaPrimary: 'Descubrir Rituals',
  ctaSecondary: 'Comprar Ahora',
  image: heroImg,
};

/* ——— Concepto ——— */
export const conceptContent = {
  tag: 'Nuestra Filosofía',
  title: 'El lujo de pausar.',
  description: 'Sutra nace para transformar pequeños momentos en experiencias sensoriales de bienestar. Cada producto es una invitación a detenerte, respirar y habitar tu tiempo con intención.',
  quote: 'Menos ruido. Más Sutra.',
};

/* ——— Categorías ——— */
export const categories = [
  {
    id: 'ritual-zen',
    name: 'Ritual Zen',
    tagline: 'Armoniza tu espacio',
    description: 'Jardines zen artesanales para meditar y encontrar equilibrio interior.',
    image: categoryZen,
    href: '/ritual-zen',
  },
  {
    id: 'ritual-candle',
    name: 'Ritual Candle',
    tagline: 'Enciende tu calma',
    description: 'Kits de velas premium con cera granulada y aromas exclusivos.',
    image: categoryCandle,
    href: '/velas',
  },
  {
    id: 'aromas',
    name: 'Aromas',
    tagline: 'Despierta tus sentidos',
    description: 'Esencias artesanales diseñadas para crear atmósferas únicas.',
    image: categoryAromas,
    href: '/aromas',
  },
  {
    id: 'ritual-tea',
    name: 'Ritual Tea',
    tagline: 'Bebe consciencia',
    description: 'Tés selectos para rituales de pausa y reconexión.',
    image: categoryTea,
    href: '/tes',
  },
];

/* ——— Rituales ——— */
export const rituals = [
  {
    id: 'home-office',
    icon: '☀️',
    name: 'Ritual Home Office',
    description: 'Comienza tu jornada con intención. Enciende, respira y enfoca.',
    time: 'Mañana',
    slug: 'vela-en-polvo-aroma-toronja-ritual-mente-clara',
    productSuggestion: 'Vela Toronja · Mente Clara',
    wixId: '546f3049-5a01-4ae5-9410-67487195df08',
  },
  {
    id: 'descanso',
    icon: '🌙',
    name: 'Ritual de Descanso',
    description: 'Prepara tu cuerpo y mente para un descanso profundo y reparador.',
    time: 'Noche',
    slug: 'vela-en-polvo-aroma-manzanilla-ritual-abrazo-de-calma',
    productSuggestion: 'Vela Manzanilla · Abrazo de Calma',
    wixId: '7ab800c8-f296-4901-9a69-e22e1de26f3b',
  },
  {
    id: 'limpieza',
    icon: '🍃',
    name: 'Ritual Limpieza Energética',
    description: 'Renueva la energía de tu hogar con aromas purificadores.',
    time: 'Cualquier momento',
    slug: 'vela-en-polvo-aroma-copal-ritual-limpia-aura',
    productSuggestion: 'Vela Copal · Limpia Aura',
    wixId: 'd8a0c992-61ea-4747-8f5d-3206a66f1c41',
  },
  {
    id: 'regalo',
    icon: '🎁',
    name: 'Ritual para Regalar',
    description: 'Regala momentos, no objetos. Experiencias que se recuerdan.',
    time: 'Ocasión especial',
    slug: 'vela-en-polvo-aroma-mandarina-ritual-luz-alegre',
    productSuggestion: 'Vela Mandarina · Luz Alegre',
    wixId: '2b336c91-50f0-4b92-831c-769add3af8e1',
  },
  {
    id: 'dormir',
    icon: '✨',
    name: 'Ritual para Dormir',
    description: 'Crea un santuario nocturno con aromas de calma profunda.',
    time: 'Antes de dormir',
    slug: 'vela-en-polvo-aroma-lavanda-ritual-noche-serena',
    productSuggestion: 'Vela Lavanda · Noche Serena',
    wixId: 'a12dd355-0d7c-435f-b3a2-2e3604e1eb56',
  },
];

/* ——— Best Sellers ——— */
export const bestSellers = [
  {
    id: 'jardin-zen',
    name: 'Jardín Zen Artesanal',
    emotionalName: 'Calma Interior',
    description: 'Kit completo de jardín zen de madera de 12" con arena natural, piedras y accesorios de meditación.',
    price: 1690,
    image: categoryZen,
    tag: 'Más vendido',
  },
  {
    id: 'kit-vela-grande',
    name: 'Kit Vela + Contenedor Grande',
    emotionalName: 'Llama Serena',
    description: 'Cera granulada premium 500gr, contenedor artesanal grande y 2 aromas exclusivos.',
    price: 1590,
    image: categoryCandle,
    tag: 'Premium',
  },
  {
    id: 'kit-vela-chico',
    name: 'Kit Vela + Contenedor Chico',
    emotionalName: 'Primera Luz',
    description: 'Tu primer ritual. Cera granulada 500gr, contenedor chico y 2 aromas para comenzar.',
    price: 1190,
    image: categoryCandle,
    tag: 'Ideal para iniciar',
  },
  {
    id: 'kit-cera',
    name: 'Kit de Cera + Aromas',
    emotionalName: 'Esencia Pura',
    description: 'Lo esencial para crear tu ritual. Cera granulada 500gr y 2 aromas artesanales.',
    price: 690,
    image: categoryAromas,
    tag: 'Accesible',
  },
];

/* ——— Aromas (Experiencia Sensorial) ——— */
export const aromas = [
  {
    id: 'noche-serena',
    name: 'Noche Serena',
    base: 'Lavanda',
    description: 'Lavanda reinterpretada para crear calma profunda y descanso emocional.',
    mood: 'Calma · Descanso · Serenidad',
    color: '#9B8EC4',
    slug: 'vela-en-polvo-aroma-lavanda-ritual-noche-serena',
    wixId: 'a12dd355-0d7c-435f-b3a2-2e3604e1eb56',
    esenciaSlug: 'esencia-noche-serena-lavanda',
    esenciaWixId: '91943fb7-a6a9-4623-b032-8a3172ba52e5',
    productName: 'Vela en Polvo Aroma Lavanda - Ritual Noche Serena',
  },
  {
    id: 'bosque-interior',
    name: 'Bosque Interior',
    base: 'Pino y cedro · Patchouli',
    description: 'Un abrazo de naturaleza que despierta claridad y conexión terrenal.',
    mood: 'Claridad · Frescura · Raíces',
    color: '#7A9B6D',
    slug: 'vela-en-polvo-aroma-patchouli-ritual-raíz-profunda',
    wixId: '57f76a36-902d-47fe-b253-2b2e3988e94e',
    esenciaSlug: 'esencia-raíz-profunda-patchouli',
    esenciaWixId: '1d49a17b-4607-45a4-86d2-f27b56d0520e',
    productName: 'Vela en Polvo Aroma Patchouli - Ritual Raíz Profunda',
  },
  {
    id: 'amanecer-dorado',
    name: 'Amanecer Dorado',
    base: 'Cítricos y vainilla',
    description: 'La luz de un nuevo día: energía suave envuelta en dulzura cálida.',
    mood: 'Energía · Alegría · Calidez',
    color: '#D4A76A',
    slug: 'vela-en-polvo-aroma-mandarina-y-toronja-ritual-amanecer-vivo',
    wixId: '4076b535-bc9f-408d-872c-ef00548caedb',
    esenciaSlug: 'esencia-amanecer-vivo-mandarina-toronja',
    esenciaWixId: '1b8a9448-011a-47eb-8d59-ac27092064ab',
    productName: 'Vela en Polvo Aroma Mandarina y Toronja - Ritual Amanecer Vivo',
  },
  {
    id: 'templo-de-humo',
    name: 'Templo de Humo',
    base: 'Sándalo e incienso',
    description: 'Aromas ancestrales que invitan a la meditación y la introspección.',
    mood: 'Meditación · Misterio · Profundidad',
    color: '#8B7355',
    slug: 'vela-en-polvo-aroma-incienso-ritual-templo-interior',
    wixId: 'afcbd886-0b32-465b-84c3-0bb75eb4b95d',
    esenciaSlug: 'esencia-templo-interior-incienso',
    esenciaWixId: '4ab98939-d84a-4650-8617-6e7e615145fb',
    productName: 'Vela en Polvo Aroma Incienso - Ritual Templo Interior',
  },
];

/* ——— Marquee Phrases ——— */
export const marqueePhrases = [
  'El lujo de sentir paz',
  'Tu hogar también merece rituales',
  'Habita tu tiempo',
  'Diseñado para desacelerar',
  'Menos ruido. Más Sutra',
  'El bienestar también puede verse hermoso',
];

/* ——— Newsletter ——— */
export const newsletterContent = {
  tag: 'Newsletter',
  title: 'Tu ritual comienza aquí.',
  subtitle: 'Recibe rituales, guías de aromas y un 10% de descuento en tu primera compra.',
  cta: 'Suscribirme',
  placeholder: 'Tu correo electrónico',
};

/* ——— Footer ——— */
export const footerContent = {
  brand: 'SUTRA',
  tagline: 'Rituales de bienestar premium',
  columns: [
    {
      title: 'Tienda',
      links: [
        { label: 'Objetos de Ritual', href: '#' },
        { label: 'Velas de Arena', href: '#' },
        { label: 'Aromas', href: '#' },
        { label: 'Tés', href: '#' },
        { label: 'Bundles', href: '#' },
        { label: 'Mystery Box', href: '#' },
      ],
    },
    {
      title: 'Info',
      links: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Journal', href: '/comunidad' },
        { label: 'Zonas', href: '/zonas' },
        { label: 'Envíos a Todo México', href: '/politica-de-envios' },
        { label: 'Contacto', href: '/contacto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
        { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
        { label: 'Política de Reembolsos', href: '/politica-de-reembolso' },
        { label: 'Política de Envíos', href: '/politica-de-envios' },
      ],
    },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/sutra.mx', icon: 'ig' },
    { label: 'TikTok', href: 'https://tiktok.com/@sutra.mx', icon: 'tt' },
    { label: 'WhatsApp', href: 'https://wa.me/521', icon: 'wa' },
  ],
  copyright: `© ${new Date().getFullYear()} Sutra México. Todos los derechos reservados.`,
};
