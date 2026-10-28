import { supabase, isSupabaseConfigured, DEFAULT_LANDINGS_TABLE } from './supabase';
import fallbackLandings from '../data/landingFallback.json';

// In-memory cache for fast repeat visits
const landingCache = new Map();

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
 */
export async function getLandingBySlug(slug) {
  if (!slug) return null;
  const normalizedSlug = String(slug).trim().toLowerCase();

  // 1. Revisar caché en memoria
  if (landingCache.has(normalizedSlug)) {
    return landingCache.get(normalizedSlug);
  }

  // 2. Consulta en tiempo real a Supabase (100% dinámico)
  if (isSupabaseConfigured && supabase) {
    try {
      // Intenta primero con la tabla configurada
      const candidateTables = [
        DEFAULT_LANDINGS_TABLE,
        'sutra_seo_landings',
        'sutra_seo_landing',
        'landings',
        'seo_landings',
      ];

      for (const table of candidateTables) {
        // Intenta primero por 'Slug' (casing exacto del CSV en Supabase)
        let { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('Slug', normalizedSlug)
          .maybeSingle();

        // Si la columna 'Slug' no existe (código 42703), reintenta por 'slug' en minúsculas
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
          landingCache.set(normalizedSlug, normalized);
          return normalized;
        }
      }
    } catch (err) {
      console.warn('[LandingService] Error consultando Supabase en tiempo real:', err.message);
    }
  }

  // 3. Fallback local para pruebas y resiliencia offline
  const fallback = fallbackLandings.find(
    (item) => String(item.Slug || item.slug).toLowerCase() === normalizedSlug
  );

  if (fallback) {
    const normalized = normalizeLandingData(fallback);
    landingCache.set(normalizedSlug, normalized);
    return normalized;
  }

  return null;
}
