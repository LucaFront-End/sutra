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
  { label: 'Ritual Zen', href: '#categorias' },
  { label: 'Velas', href: '#categorias' },
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
  },
  {
    id: 'descanso',
    icon: '🌙',
    name: 'Ritual de Descanso',
    description: 'Prepara tu cuerpo y mente para un sueño profundo y reparador.',
    time: 'Noche',
  },
  {
    id: 'limpieza',
    icon: '🍃',
    name: 'Ritual Limpieza Energética',
    description: 'Renueva la energía de tu hogar con aromas purificadores.',
    time: 'Cualquier momento',
  },
  {
    id: 'regalo',
    icon: '🎁',
    name: 'Ritual para Regalar',
    description: 'Regala momentos, no objetos. Experiencias que se recuerdan.',
    time: 'Ocasión especial',
  },
  {
    id: 'dormir',
    icon: '✨',
    name: 'Ritual para Dormir',
    description: 'Crea un santuario nocturno con aromas de calma profunda.',
    time: 'Antes de dormir',
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
  },
  {
    id: 'bosque-interior',
    name: 'Bosque Interior',
    base: 'Pino y cedro',
    description: 'Un abrazo de naturaleza que despierta claridad y conexión terrenal.',
    mood: 'Claridad · Frescura · Raíces',
    color: '#7A9B6D',
  },
  {
    id: 'amanecer-dorado',
    name: 'Amanecer Dorado',
    base: 'Cítricos y vainilla',
    description: 'La luz de un nuevo día: energía suave envuelta en dulzura cálida.',
    mood: 'Energía · Alegría · Calidez',
    color: '#D4A76A',
  },
  {
    id: 'templo-de-humo',
    name: 'Templo de Humo',
    base: 'Sándalo e incienso',
    description: 'Aromas ancestrales que invitan a la meditación y la introspección.',
    mood: 'Meditación · Misterio · Profundidad',
    color: '#8B7355',
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
        { label: 'Ritual Zen', href: '#' },
        { label: 'Velas', href: '#' },
        { label: 'Aromas', href: '#' },
        { label: 'Tés', href: '#' },
        { label: 'Bundles', href: '#' },
        { label: 'Mystery Box', href: '#' },
      ],
    },
    {
      title: 'Info',
      links: [
        { label: 'Nosotros', href: '#' },
        { label: 'Journal', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Envíos', href: '#' },
        { label: 'Contacto', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos y Condiciones', href: '#' },
        { label: 'Política de Privacidad', href: '#' },
        { label: 'Aviso Legal', href: '#' },
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
