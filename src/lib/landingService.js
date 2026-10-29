import { supabase, isSupabaseConfigured, DEFAULT_LANDINGS_TABLE, DEFAULT_TIENDAS_TABLE } from './supabase';
import fallbackLandings from '../data/landingFallback.json';
import fallbackTiendas from '../data/tiendasFallback.json';

// In-memory cache for fast repeat visits
const landingCache = new Map();

/**
 * Extrae el slug limpio en caso de que el usuario pegue una URL completa
 * (ej. https://www.sutramexico.com/ciudades/vela-en-polvo-para-velas-zapopan)
 */
function sanitizeSlugInput(input) {
  if (!input) return '';
  let s = String(input).trim();
  try {
    s = decodeURIComponent(s);
  } catch {}
  s = s.replace(/^https?:\/\/[^/]+\//i, '');
  s = s.replace(/^(ciudades|tiendas|zonas)\//i, '');
  s = s.replace(/^\/+|\/+$/g, '');
  return s.trim();
}

/**
 * Normaliza los campos de una fila independientemente de si provienen
 * de columnas con acentos/espacios o en formato snake_case en Supabase.
 */
export function normalizeLandingData(raw) {
  if (!raw) return null;
  const clean = (val) => (typeof val === 'string' ? val.trim() : (val || ''));

  return {
    id: raw.id,
    titulo: clean(raw.Titulo || raw.titulo || raw.title || ''),
    slug: clean(raw.Slug || raw.slug || ''),
    ciudad: clean(raw['Ciudad o Zona'] || raw.ciudad_o_zona || raw.ciudad || ''),
    estado: clean(raw.Estado || raw.estado || ''),
    tituloPagina: clean(
      raw['Título de página'] || 
      raw['Titulo de pagina'] || 
      raw.titulo_de_pagina || 
      raw.titulo_pagina || 
      raw.Titulo || 
      raw.titulo || 
      'Velas de Arena y Rituales'
    ),
    excerpt: clean(
      raw.Excerpt || 
      raw['Excerpt de página'] || 
      raw['Excerpt de pagina'] || 
      raw.excerpt || 
      raw.description || 
      'Descubre la colección de velas en polvo y velas de arena de Sutra México.'
    ),
    tituloSeo: clean(
      raw['Titulo de SEO'] || 
      raw['Título de SEO'] || 
      raw.titulo_de_seo || 
      raw.titulo_seo || 
      raw['Título de página'] || 
      'Velas en Polvo y de Arena en México | Sutra México'
    ),
    metadescripcion: clean(
      raw['Metadescripción'] || 
      raw['Metadescripcion'] || 
      raw.metadescripcion || 
      raw.meta_description || 
      raw.Excerpt || 
      'Explora las velas de arena de Sutra México con cera vegetal perlada y esencias naturales.'
    ),
    fraseBusqueda: clean(
      raw['Frase de búsqueda'] || 
      raw['Frase de busqueda'] || 
      raw.frase_de_busqueda || 
      raw.frase_busqueda || 
      'velas de arena'
    ),
    parrafoSeo: clean(
      raw['Párrafo SEO amplio'] || 
      raw['Parrafo SEO amplio'] || 
      raw.parrafo_seo_amplio || 
      raw.parrafo_seo || 
      ''
    ),
  };
}

/**
 * Obtiene la landing page de manera 100% dinámica:
 * 1. Si Supabase está conectado, consulta en tiempo real la tabla.
 * 2. Si no o durante desarrollo local sin credenciales, busca en el fallback.
 * 3. Si se añade una nueva fila en Supabase, se refleja de inmediato sin tocar código.
 * @param {string} slug
 * @param {'any' | 'ciudad' | 'tienda'} type
 */
export async function getLandingBySlug(slug, type = 'any') {
  if (!slug) return null;
  const normalizedSlug = sanitizeSlugInput(slug).toLowerCase();
  if (!normalizedSlug) return null;
  const cacheKey = `${type}:${normalizedSlug}`;

  // 1. Revisar caché en memoria
  if (landingCache.has(cacheKey)) {
    return landingCache.get(cacheKey);
  }

  // Define candidate tables based on type
  let candidateTables = [];
  if (type === 'tienda') {
    candidateTables = Array.from(new Set([DEFAULT_TIENDAS_TABLE, 'SUTRA SEO TIENDA', 'sutra_seo_tienda', 'sutra_seo_tiendas', 'tiendas']));
  } else if (type === 'ciudad') {
    candidateTables = Array.from(new Set([DEFAULT_LANDINGS_TABLE, 'SUTRA SEO LANDING', 'sutra_seo_landings', 'landings']));
  } else {
    candidateTables = Array.from(new Set([
      DEFAULT_LANDINGS_TABLE,
      DEFAULT_TIENDAS_TABLE,
      'SUTRA SEO LANDING',
      'SUTRA SEO TIENDA',
      'sutra_seo_landings',
      'sutra_seo_tienda',
      'landings',
      'tiendas',
    ]));
  }

  // 2. Consulta en tiempo real a Supabase (100% dinámico)
  if (isSupabaseConfigured && supabase) {
    try {
      for (const table of candidateTables) {
        let { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('Slug', normalizedSlug)
          .maybeSingle();

        if (!data && !error) {
          const ilikeRes = await supabase
            .from(table)
            .select('*')
            .ilike('Slug', normalizedSlug)
            .limit(1)
            .maybeSingle();
          data = ilikeRes.data;
          error = ilikeRes.error;
        }

        if (error && error.code === '42703') {
          const retry = await supabase
            .from(table)
            .select('*')
            .eq('slug', normalizedSlug)
            .maybeSingle();
          data = retry.data;
          error = retry.error;
        }

        if (!error && data) {
          const normalized = normalizeLandingData(data);
          landingCache.set(cacheKey, normalized);
          return normalized;
        }
      }
    } catch (err) {
      console.warn('[LandingService] Error consultando Supabase en tiempo real:', err.message);
    }
  }

  // 3. Fallback local para pruebas y resiliencia offline
  let fallback = null;
  if (type === 'tienda') {
    fallback = fallbackTiendas.find(
      (item) => String(item.Slug || item.slug).toLowerCase() === normalizedSlug
    );
  } else if (type === 'ciudad') {
    fallback = fallbackLandings.find(
      (item) => String(item.Slug || item.slug).toLowerCase() === normalizedSlug
    );
  } else {
    fallback = fallbackLandings.find(
      (item) => String(item.Slug || item.slug).toLowerCase() === normalizedSlug
    ) || fallbackTiendas.find(
      (item) => String(item.Slug || item.slug).toLowerCase() === normalizedSlug
    );
  }

  if (fallback) {
    const normalized = normalizeLandingData(fallback);
    landingCache.set(cacheKey, normalized);
    return normalized;
  }

  return null;
}

export async function getTiendaBySlug(slug) {
  return getLandingBySlug(slug, 'tienda');
}

export const POPULAR_STATES = [
  'Todos',
  'Aguascalientes',
  'Baja California',
  'Ciudad de México',
  'Guanajuato',
  'Jalisco',
  'Estado de México',
  'Nuevo León',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'Yucatán',
];

/**
 * Consulta un conjunto paginado y filtrado de landings dinámicas desde Supabase
 * en tiempo real para el hub repetidor de Zonas (ciudades o tiendas).
 */
export async function getLandingsHub({
  page = 0,
  pageSize = 24,
  search = '',
  estado = '',
  type = 'ciudades', // 'ciudades' | 'tiendas'
} = {}) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const isTienda = type === 'tiendas';
  const tableName = isTienda ? (DEFAULT_TIENDAS_TABLE || 'SUTRA SEO TIENDA') : DEFAULT_LANDINGS_TABLE;
  const fallbackSource = isTienda ? fallbackTiendas : fallbackLandings;
  const routePrefix = isTienda ? 'tiendas' : 'ciudades';

  const cleanedSearch = sanitizeSlugInput(search);

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      if (estado && estado !== 'Todos' && estado !== 'all') {
        query = query.ilike('Estado', `%${estado}%`);
      }

      if (cleanedSearch) {
        const words = cleanedSearch.split(/[\s\-_/]+/).filter(Boolean);
        const wildcardPattern = words.length > 1 ? words.join('%') : cleanedSearch;
        const slugPattern = words.length > 1 ? words.join('-') : cleanedSearch;

        query = query.or(
          `"Ciudad o Zona".ilike.%${cleanedSearch}%,"Estado".ilike.%${cleanedSearch}%,"Título de página".ilike.%${wildcardPattern}%,"Titulo".ilike.%${wildcardPattern}%,"Slug".ilike.%${slugPattern}%,"Slug".ilike.%${wildcardPattern}%`
        );
      }

      query = query.order('Estado', { ascending: true }).range(from, to);

      const { data, count, error } = await query;

      if (!error && Array.isArray(data)) {
        return {
          landings: data.map((item) => ({ ...normalizeLandingData(item), isTienda, routePrefix })),
          totalCount: count ?? data.length,
          totalPages: Math.ceil((count ?? data.length) / pageSize),
          currentPage: page,
          pageSize,
          type,
        };
      }
    } catch (err) {
      console.warn('[LandingService] getLandingsHub error:', err.message);
    }
  }

  // Fallback local dataset
  let list = fallbackSource.map((item) => ({ ...normalizeLandingData(item), isTienda, routePrefix }));
  if (estado && estado !== 'Todos' && estado !== 'all') {
    list = list.filter((item) => item.estado.toLowerCase().includes(estado.toLowerCase()));
  }
  if (cleanedSearch) {
    const s = cleanedSearch.toLowerCase();
    const words = s.split(/[\s\-_/]+/).filter(Boolean);
    list = list.filter((item) => {
      const haystack = `${item.ciudad} ${item.estado} ${item.tituloPagina} ${item.titulo} ${item.slug}`.toLowerCase();
      return haystack.includes(s) || (words.length > 1 && words.every((w) => haystack.includes(w)));
    });
  }

  const paged = list.slice(from, from + pageSize);
  return {
    landings: paged,
    totalCount: list.length,
    totalPages: Math.ceil(list.length / pageSize),
    currentPage: page,
    pageSize,
    type,
  };
}
