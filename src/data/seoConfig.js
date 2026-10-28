/**
 * SEO SUTRA MÉXICO — CONFIGURACIÓN OFICIAL
 * Extraído textualmente al pie de la letra del documento de la especialista en SEO:
 * "SEO SUTRA MÉXICO — TÍTULOS Y METADESCRIPCIONES"
 */

export const SITE_URL = 'https://www.sutramexico.com';
export const SITE_NAME = 'Sutra México';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/hero-lifestyle.png`;

export const SEO_DATA = {
  // 1. HOME / INICIO
  home: {
    title: 'Velas en Polvo y Velas de Arena en México | Sutra México',
    description: 'Descubre Sutra México: velas en polvo, velas de arena, aromas y rituales únicos. Crea ambientes especiales con velas personalizables. Compra en línea.',
    canonical: `${SITE_URL}/`,
    type: 'website',
  },

  // 2. TIENDA
  tienda: {
    title: 'Comprar Velas en Polvo y de Arena en México | Sutra',
    description: 'Compra velas en polvo, velas de arena, esencias aromáticas y kits de velas en Sutra México. Personaliza tus rituales y recibe tus productos en todo México.',
    canonical: `${SITE_URL}/tienda`,
    type: 'website',
  },

  // 3. EVENTOS
  eventos: {
    title: 'Velas de Arena y Velas Flotantes para Eventos | Sutra',
    description: 'Transforma bodas, cenas y eventos con velas de arena y decoraciones con velas flotantes. Descubre opciones personalizadas para eventos en México con Sutra.',
    canonical: `${SITE_URL}/eventos`,
    type: 'website',
  },

  // 4. NOSOTROS
  nosotros: {
    title: 'Conoce Sutra México | Velas en Polvo y Rituales',
    description: 'Conoce Sutra México, una marca que transforma momentos cotidianos en rituales con velas en polvo, aromas y experiencias diseñadas para reconectar.',
    canonical: `${SITE_URL}/nosotros`,
    type: 'website',
  },

  // 5. COMUNIDAD / BLOG
  comunidad: {
    title: 'Comunidad Sutra | Rituales, Velas y Bienestar',
    description: 'Únete a la comunidad Sutra México. Descubre rituales, inspiración, ideas para decorar con velas de arena y momentos de bienestar para tu vida diaria.',
    canonical: `${SITE_URL}/comunidad`,
    type: 'website',
  },

  // 6. MYSTERY BOX
  mysterybox: {
    title: 'Mystery Box de Velas y Rituales | Sutra México',
    description: 'Descubre la Mystery Box de Sutra México: una experiencia sorpresa con velas en polvo, aromas y accesorios para transformar momentos cotidianos en rituales.',
    canonical: `${SITE_URL}/mysterybox`,
    type: 'website',
  },

  // 7. CONTACTO
  contacto: {
    title: 'Contacto Sutra México | Velas en Polvo y de Arena',
    description: 'Contacta a Sutra México para resolver dudas sobre velas en polvo, velas de arena, pedidos, eventos y compras especiales. Estamos para ayudarte.',
    canonical: `${SITE_URL}/contacto`,
    type: 'website',
  },

  // 8. ZONAS Y COBERTURA (HUB DINÁMICO DE SANTUARIOS)
  zonas: {
    title: 'Zonas y Cobertura de Velas de Arena en México | Sutra',
    description: 'Explora todos los santuarios, ciudades y zonas de cobertura de Sutra en México. Velas de arena artesanales, esencias botánicas y cajas de ritual con envío a todo el país.',
    canonical: `${SITE_URL}/zonas`,
    type: 'website',
  },

  // 8. CATEGORÍAS DE PRODUCTOS / CATÁLOGO
  catalogo: {
    title: 'Velas de Arena, Aromas y Accesorios | Sutra México',
    description: 'Explora las categorías de Sutra México: velas en polvo, velas de arena, esencias aromáticas, accesorios y tés. Encuentra todo para crear tu propio ritual.',
    canonical: `${SITE_URL}/tienda/all`,
    type: 'website',
  },

  // 9. ACCESORIOS
  accesorios: {
    title: 'Accesorios para Velas en Polvo y de Arena | Sutra',
    description: 'Descubre accesorios para velas en polvo y velas de arena en Sutra México. Complementa tus rituales con piezas y detalles para personalizar cada espacio.',
    canonical: `${SITE_URL}/tienda/accesorios`,
    type: 'website',
  },

  // 10. VELAS DE ARENA
  velas: {
    title: 'Velas de Arena y Velas en Polvo en México | Sutra',
    description: 'Compra velas de arena y velas en polvo en Sutra México. Cera vegetal perlada en blanco o negro, kits personalizables y esencias para crear tu propia vela.',
    canonical: `${SITE_URL}/tienda/velas`,
    type: 'website',
  },

  // 11. AROMAS
  aromas: {
    title: 'Esencias Aromáticas para Velas de Arena | Sutra México',
    description: 'Descubre esencias aromáticas para velas de arena y velas en polvo. Lavanda, copal, patchouli, cítricos y más aromas para personalizar tus rituales Sutra.',
    canonical: `${SITE_URL}/tienda/aromas`,
    type: 'website',
  },

  // 12. TÉS E INFUSIONES ORGÁNICOS
  te: {
    title: 'Tés e Infusiones Orgánicos en México | Sutra México',
    description: 'Compra tés e infusiones orgánicos en Sutra México. Descubre mezclas naturales de hierbas, flores y especias para disfrutar momentos de bienestar y relajación.',
    canonical: `${SITE_URL}/tienda/te`,
    type: 'website',
  },
};

/**
 * Retorna los metadatos SEO exactos según la categoría de tienda
 */
export function getCategorySEO(category = 'all', subcategory = null) {
  if (category === 'velas') return SEO_DATA.velas;
  if (category === 'aromas') return SEO_DATA.aromas;
  if (category === 'te') return SEO_DATA.te;
  if (category === 'accesorios') {
    if (subcategory) {
      return {
        ...SEO_DATA.accesorios,
        canonical: `${SITE_URL}/tienda/accesorios/${subcategory}`,
      };
    }
    return SEO_DATA.accesorios;
  }
  if (category === 'suscripciones' || category === 'mysterybox') {
    return SEO_DATA.mysterybox;
  }
  if (category === 'all') {
    return SEO_DATA.catalogo;
  }
  return SEO_DATA.tienda;
}

/**
 * Genera metadatos dinámicos para una página de producto
 */
export function getProductSEO(product) {
  if (!product) return SEO_DATA.tienda;
  const name = product.name || 'Vela de Arena Sutra';
  const slug = product.slug || product._wixId || product.id;
  const desc = product.shortDesc || product.description || SEO_DATA.tienda.description;
  const rawImg = product.img || (product.images && product.images[0]?.src) || DEFAULT_OG_IMAGE;
  const imgUrl = typeof rawImg === 'string' ? rawImg : (rawImg?.src || DEFAULT_OG_IMAGE);

  const priceNum = product.priceNum || (product.price ? parseInt(String(product.price).replace(/\D/g, ''), 10) : 690);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    image: [imgUrl],
    description: desc,
    sku: String(product.id || slug),
    brand: {
      '@type': 'Brand',
      name: 'Sutra México',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/producto/${slug}`,
      priceCurrency: 'MXN',
      price: priceNum,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Sutra México',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating || 5.0),
      reviewCount: String(product.reviewCount || 25),
    },
  };

  return {
    title: `${name} | Sutra México`,
    description: desc,
    canonical: `${SITE_URL}/producto/${slug}`,
    image: imgUrl,
    type: 'product',
    schema,
  };
}

/**
 * Genera metadatos dinámicos para un post de blog / comunidad
 */
export function getBlogPostSEO(article) {
  if (!article) return SEO_DATA.comunidad;
  const title = article.title || 'Diario Sutra';
  const desc = article.excerpt || SEO_DATA.comunidad.description;
  const imgUrl = typeof article.image === 'string' ? article.image : (article.image?.src || DEFAULT_OG_IMAGE);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    headline: title,
    description: desc,
    image: [imgUrl],
    author: {
      '@type': 'Organization',
      name: 'Sutra México',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sutra México',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/comunidad/${article.id}`,
    },
  };

  return {
    title: `${title} | Comunidad Sutra México`,
    description: desc,
    canonical: `${SITE_URL}/comunidad/${article.id}`,
    image: imgUrl,
    type: 'article',
    schema,
  };
}
