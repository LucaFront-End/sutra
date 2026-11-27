import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import { WIX_CLIENT_ID } from '../lib/wixClient.js';

export const LINKTREE_COLLECTION_ID = 'LINKTREE';
const CACHE_KEY = 'sutra_linktree_cache_v1';
const API_TIMEOUT_MS = 2500;

export const DEFAULT_LINKTREE_ITEMS = [
  {
    _id: 'default-tienda-online',
    title: 'Tienda Online',
    excerpt: 'Transforma tus espacios en rituales.',
    enlace: '/tienda',
    vector: '',
    _publishStatus: 'PUBLISHED',
    _createdDate: '2026-11-27T01:40:01.174Z',
  },
  {
    _id: 'default-mistery-box',
    title: 'Mistery Box',
    excerpt: 'Una experiencia llena de sorpresas.',
    enlace: '/mysterybox',
    vector: '',
    _publishStatus: 'PUBLISHED',
    _createdDate: '2026-11-27T01:41:12.918Z',
  },
  {
    _id: 'default-velas-en-arena',
    title: 'Velas en Arena',
    excerpt: 'Enciende, renueva y vuelve a disfrutar.',
    enlace: '/tienda/velas',
    vector: '',
    _publishStatus: 'PUBLISHED',
    _createdDate: '2026-11-27T01:41:31.548Z',
  },
  {
    _id: 'default-mercado-libre',
    title: 'Mercado Libre',
    excerpt: 'Compra de forma fácil y segura.',
    enlace: '',
    vector: '',
    _publishStatus: 'PUBLISHED',
    _createdDate: '2026-11-27T02:43:49.247Z',
  },
];

let readOnlyWixClient = null;

function getReadOnlyWixClient() {
  if (!readOnlyWixClient) {
    readOnlyWixClient = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
    });
  }
  return readOnlyWixClient;
}

function normalizeSearchText(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Maps an item's title and link to a crisp geometric preset vector key
 * when no custom CMS vector/image has been uploaded or if a remote asset fails to load.
 */
export function resolveVectorPresetKey(title = '', enlace = '') {
  const text = `${normalizeSearchText(title)} ${normalizeSearchText(enlace)}`;

  if (/\b(mercado\s*libre|mercadolibre|meli)\b/.test(text)) return 'mercadolibre';
  if (/\bamazon\b/.test(text)) return 'amazon';
  if (/\b(mistery|mystery|box|caja|suscrip)/.test(text)) return 'box';
  if (/\b(vela|arena|polvo|cera|aroma|esencia|ritual)\b/.test(text)) return 'candle';
  if (/\b(tienda|shop|catalogo|comprar|online)\b/.test(text)) return 'store';
  if (/\b(evento|boda|corporativo|mayoreo|hotel)\b/.test(text)) return 'events';
  if (/\b(whatsapp|wa\.me|asesor|concierge)\b/.test(text)) return 'whatsapp';
  if (/\b(comunidad|blog|journal)\b/.test(text)) return 'community';
  if (/\binstagram\b/.test(text)) return 'instagram';
  if (/\btiktok\b/.test(text)) return 'tiktok';
  if (/\bfacebook\b/.test(text)) return 'facebook';
  if (/\byoutube\b/.test(text)) return 'youtube';
  if (/\bspotify\b/.test(text)) return 'spotify';

  return 'sutra';
}

function sanitizeSvgMarkup(rawSvg = '') {
  return String(rawSvg)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .trim();
}

/**
 * Parses Wix CMS IMAGE / VECTOR / URL / inline SVG values into a uniform media descriptor
 * with automatic /shapes <-> /media fallback and iconKey preset backup.
 */
export function parseWixVectorMedia(rawVector, title = '', enlace = '') {
  const iconKey = resolveVectorPresetKey(title, enlace);
  const unwrapped =
    rawVector && typeof rawVector === 'object'
      ? rawVector.url || rawVector.src || rawVector.fileUrl || ''
      : rawVector;

  const value = typeof unwrapped === 'string' ? unwrapped.trim() : '';
  if (!value) {
    return { type: 'preset', primaryUrl: '', fallbackUrl: '', svgMarkup: '', iconKey };
  }

  if (value.startsWith('<svg')) {
    const svgMarkup = sanitizeSvgMarkup(value);
    if (svgMarkup) {
      return { type: 'svg', primaryUrl: '', fallbackUrl: '', svgMarkup, iconKey };
    }
    return { type: 'preset', primaryUrl: '', fallbackUrl: '', svgMarkup: '', iconKey };
  }

  if (value.startsWith('wix:vector://')) {
    const match = value.match(/wix:vector:\/\/v1\/([^/#]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        type: 'image',
        primaryUrl: `https://static.wixstatic.com/shapes/${fileId}`,
        fallbackUrl: `https://static.wixstatic.com/media/${fileId}`,
        svgMarkup: '',
        iconKey,
      };
    }
  }

  if (value.startsWith('wix:image://')) {
    const match = value.match(/wix:image:\/\/v1\/([^/#]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        type: 'image',
        primaryUrl: `https://static.wixstatic.com/media/${fileId}`,
        fallbackUrl: fileId.toLowerCase().endsWith('.svg')
          ? `https://static.wixstatic.com/shapes/${fileId}`
          : '',
        svgMarkup: '',
        iconKey,
      };
    }
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/') ||
    value.startsWith('/')
  ) {
    const primaryUrl = value.replace(/\/v1\/(fit|fill)\/[^/]+\/[^/]+$/, '');
    return { type: 'image', primaryUrl, fallbackUrl: '', svgMarkup: '', iconKey };
  }

  return { type: 'preset', primaryUrl: '', fallbackUrl: '', svgMarkup: '', iconKey };
}

const TITLE_FALLBACK_DESTINATIONS = [
  { match: /^(tienda\s*online|tienda|shop|catalogo)$/, href: '/tienda', internalPath: '/tienda', isExternal: false },
  { match: /^(mistery\s*box|mystery\s*box|misterybox|mysterybox|suscripcion)$/, href: '/mysterybox', internalPath: '/mysterybox', isExternal: false },
  { match: /^(velas\s*(en|de)\s*arena|velas\s*en\s*polvo|velas)$/, href: '/tienda/velas', internalPath: '/tienda/velas', isExternal: false },
  { match: /^(aromas|esencias)$/, href: '/tienda/aromas', internalPath: '/tienda/aromas', isExternal: false },
  { match: /^jardin\s*zen$/, href: '/tienda/accesorios/jardin-zen', internalPath: '/tienda/accesorios/jardin-zen', isExternal: false },
  { match: /^(accesorios|vasijas)$/, href: '/tienda/accesorios', internalPath: '/tienda/accesorios', isExternal: false },
  { match: /^(te|tes|infusiones)$/, href: '/tienda/te', internalPath: '/tienda/te', isExternal: false },
  { match: /^(eventos|bodas)$/, href: '/eventos', internalPath: '/eventos', isExternal: false },
  { match: /^(comunidad|blog|journal)$/, href: '/comunidad', internalPath: '/comunidad', isExternal: false },
  { match: /^nosotros$/, href: '/nosotros', internalPath: '/nosotros', isExternal: false },
  { match: /^contacto$/, href: '/contacto', internalPath: '/contacto', isExternal: false },
  {
    match: /^whatsapp$/,
    href: 'https://wa.me/5215500000000?text=Hola%20Sutra,%20vengo%20desde%20sus%20enlaces%20oficiales',
    internalPath: null,
    isExternal: true,
  },
  {
    match: /^instagram$/,
    href: 'https://www.instagram.com/sutramexico?exln=aTE1NmpxejNoNHNn&utm_source=qr',
    internalPath: null,
    isExternal: true,
  },
  {
    match: /^tiktok$/,
    href: 'https://www.tiktok.com/@sutra.mx',
    internalPath: null,
    isExternal: true,
  },
  {
    match: /^facebook$/,
    href: 'https://www.facebook.com/share/1JocX6bo7H/?mibextid=wwXIfr',
    internalPath: null,
    isExternal: true,
  },
];

/**
 * Resolves the destination URL for a CMS row, preserving explicit CMS URLs,
 * turning same-site URLs into SPA routes, and providing smart defaults for known Sutra titles.
 */
export function resolveLinkDestination(rawEnlace = '', title = '') {
  const val = String(rawEnlace || '').trim();

  if (val) {
    if (val.startsWith('/')) {
      return {
        href: val,
        internalPath: val,
        isExternal: false,
        hasUrl: true,
        isFallbackUrl: false,
      };
    }

    if (/^(mailto:|tel:|whatsapp:)/i.test(val)) {
      return {
        href: val,
        internalPath: null,
        isExternal: true,
        hasUrl: true,
        isFallbackUrl: false,
      };
    }

    const withProtocol = /^https?:\/\//i.test(val) ? val : `https://${val}`;
    try {
      const parsed = new URL(withProtocol);
      const hostname = parsed.hostname.toLowerCase();
      const pathname = parsed.pathname || '/';
      const isSutraHost = hostname === 'sutramexico.com' || hostname === 'www.sutramexico.com';
      const isStaticFeedOrApi =
        pathname.startsWith('/api/') || /\.(xml|csv|tsv)$/i.test(pathname);

      if (isSutraHost && !isStaticFeedOrApi) {
        const internalPath = `${pathname}${parsed.search}${parsed.hash}` || '/';
        return {
          href: internalPath,
          internalPath,
          isExternal: false,
          hasUrl: true,
          isFallbackUrl: false,
        };
      }

      return {
        href: parsed.toString(),
        internalPath: null,
        isExternal: true,
        hasUrl: true,
        isFallbackUrl: false,
      };
    } catch {
      return {
        href: withProtocol,
        internalPath: null,
        isExternal: true,
        hasUrl: true,
        isFallbackUrl: false,
      };
    }
  }

  const normalizedTitle = normalizeSearchText(title);
  const matchedFallback = TITLE_FALLBACK_DESTINATIONS.find((entry) =>
    entry.match.test(normalizedTitle)
  );

  if (matchedFallback) {
    return {
      href: matchedFallback.href,
      internalPath: matchedFallback.internalPath,
      isExternal: matchedFallback.isExternal,
      hasUrl: true,
      isFallbackUrl: true,
    };
  }

  return {
    href: '',
    internalPath: null,
    isExternal: true,
    hasUrl: false,
    isFallbackUrl: false,
  };
}

/**
 * Normalizes raw items from @wix/data or REST v2 into clean UI-ready records.
 */
export function normalizeLinktreeItems(rawItems = []) {
  if (!Array.isArray(rawItems)) return [];

  const cleaned = rawItems
    .map((entry) => {
      const raw = entry?.data && typeof entry.data === 'object' ? { ...entry.data, _id: entry._id || entry.id || entry.data._id } : entry;
      if (!raw || typeof raw !== 'object') return null;

      if (raw._publishStatus && raw._publishStatus !== 'PUBLISHED') return null;
      if (raw.activo === false || raw.enabled === false) return null;

      const title = String(raw.title || raw.titulo || '').trim();
      if (!title) return null;

      const excerpt = String(raw.excerpt || raw.descripcion || raw.subtitulo || '').trim();
      const rawEnlace = String(raw.enlace || raw.url || raw.link || raw.href || '').trim();
      const rawVector = raw.vector ?? raw.icono ?? raw.icon ?? raw.imagen ?? '';

      const orderRaw = raw.orden ?? raw.order ?? raw.posicion;
      const numericOrder =
        orderRaw !== undefined && orderRaw !== null && orderRaw !== '' && Number.isFinite(Number(orderRaw))
          ? Number(orderRaw)
          : Number.POSITIVE_INFINITY;

      const createdDate = String(raw._createdDate || '');
      const createdMs = createdDate ? new Date(createdDate).getTime() : 0;

      return {
        id: String(raw._id || raw.id || title),
        title,
        excerpt,
        rawEnlace,
        rawVector,
        destination: resolveLinkDestination(rawEnlace, title),
        media: parseWixVectorMedia(rawVector, title, rawEnlace),
        createdDate,
        _numericOrder: numericOrder,
        _createdMs: Number.isFinite(createdMs) ? createdMs : 0,
      };
    })
    .filter(Boolean);

  cleaned.sort((a, b) => {
    if (a._numericOrder !== b._numericOrder) {
      return a._numericOrder - b._numericOrder;
    }
    return a._createdMs - b._createdMs;
  });

  return cleaned.map((entry) => ({
    id: entry.id,
    title: entry.title,
    excerpt: entry.excerpt,
    rawEnlace: entry.rawEnlace,
    rawVector: entry.rawVector,
    destination: entry.destination,
    media: entry.media,
    createdDate: entry.createdDate,
  }));
}

export function getCachedLinktreeItems() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore storage corruption
  }
  return null;
}

function saveCachedLinktreeItems(normalized = []) {
  if (typeof window === 'undefined' || !Array.isArray(normalized) || normalized.length === 0) return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore quota errors
  }
}

/**
 * Fetches published LINKTREE items:
 * 1) Same-origin /api/linktree (fast CDN/SSR-friendly, resilient in in-app webviews)
 * 2) Direct @wix/sdk query to LINKTREE (works locally in Vite dev/preview & as client fallback)
 * 3) Cached or default items if completely offline
 */
export async function fetchLinktreeItems() {
  // 1. Try serverless endpoint first in browser
  if (typeof fetch === 'function') {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), API_TIMEOUT_MS) : null;
    try {
      const response = await fetch('/api/linktree', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller?.signal,
      });
      const contentType = response.headers?.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data?.ok && Array.isArray(data.items) && data.items.length > 0) {
          const normalized = normalizeLinktreeItems(data.items);
          if (normalized.length > 0) {
            saveCachedLinktreeItems(normalized);
            return { items: normalized, source: data.source || 'api' };
          }
        }
      }
    } catch {
      // Fallback to direct Wix SDK query
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  // 2. Direct @wix/sdk query to Wix CMS collection LINKTREE
  try {
    const client = getReadOnlyWixClient();
    const res = await client.items.query(LINKTREE_COLLECTION_ID).limit(100).find();
    const rawItems = Array.isArray(res?.items) ? res.items : [];
    const normalized = normalizeLinktreeItems(rawItems);
    if (normalized.length > 0) {
      saveCachedLinktreeItems(normalized);
      return { items: normalized, source: 'wix-sdk' };
    }
  } catch (err) {
    console.warn('[Linktree] Error querying Wix CMS LINKTREE:', err?.message || err);
  }

  // 3. Offline cache or default items fallback
  const cached = getCachedLinktreeItems();
  if (cached && cached.length > 0) {
    return { items: cached, source: 'cache' };
  }

  return {
    items: normalizeLinktreeItems(DEFAULT_LINKTREE_ITEMS),
    source: 'default',
  };
}
