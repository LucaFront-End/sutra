import { useState, useEffect } from 'react';
import { useWixClient } from '../context/WixContext';
import { LEGAL_POLICIES_CONFIG, DEFAULT_LEGAL_CONTENT } from '../data/legalPoliciesData';

// In-memory cache across navigation sessions
const legalCache = new Map();

const LEGACY_COLLECTIONS = {
  terms: ['Terminosycondiciones', 'Temrinosycondiciones', 'Politicas'],
  refund: ['PoliticadeReembolsos', 'PoliticaDeReembolso', 'Politicas'],
  privacy: ['AvisodePrivacidad', 'PoliticaDePrivacidad', 'Politicas'],
  shipping: ['PoliticadeEnvios', 'Politicas'],
};

const CONTENT_FIELD_KEYS = [
  'contenido',
  'texto',
  'politica',
  'cuerpo',
  'descripcin',
  'descripcion',
  'richtext',
  'description',
  'content',
];

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderRicosTextNode(node) {
  const rawText = node?.textData?.text ?? '';
  let html = escapeHtml(rawText);
  const decorations = node?.textData?.decorations || [];

  for (const dec of decorations) {
    if (dec.type === 'BOLD') html = `<strong>${html}</strong>`;
    else if (dec.type === 'ITALIC') html = `<em>${html}</em>`;
    else if (dec.type === 'UNDERLINE') html = `<u>${html}</u>`;
    else if (dec.type === 'LINK' && dec.linkData?.link?.url) {
      const href = escapeHtml(dec.linkData.link.url);
      html = `<a href="${href}" target="_blank" rel="noopener noreferrer">${html}</a>`;
    }
  }
  return html;
}

function renderRicosNodes(nodes = []) {
  if (!Array.isArray(nodes)) return '';
  return nodes
    .map((node) => {
      if (!node || typeof node !== 'object') return '';
      if (node.type === 'TEXT') return renderRicosTextNode(node);

      const childrenHtml = renderRicosNodes(node.nodes || []);
      if (node.type === 'HEADING') {
        const level = Math.min(4, Math.max(2, Number(node.headingData?.level) || 2));
        return `<h${level}>${childrenHtml}</h${level}>`;
      }
      if (node.type === 'PARAGRAPH') {
        return childrenHtml ? `<p>${childrenHtml}</p>` : '';
      }
      if (node.type === 'BULLETED_LIST') {
        return `<ul>${childrenHtml}</ul>`;
      }
      if (node.type === 'ORDERED_LIST') {
        return `<ol>${childrenHtml}</ol>`;
      }
      if (node.type === 'LIST_ITEM') {
        return `<li>${childrenHtml}</li>`;
      }
      if (node.type === 'BLOCKQUOTE') {
        return `<blockquote>${childrenHtml}</blockquote>`;
      }
      if (node.type === 'DIVIDER') {
        return '<hr />';
      }
      return childrenHtml;
    })
    .filter(Boolean)
    .join('\n');
}

const IGNORED_META_KEYS = new Set([
  '_id',
  '_owner',
  '_createdDate',
  '_updatedDate',
  '_publishDate',
  '_draftDate',
  '_publishStatus',
  'title',
  'titulo',
  'slug',
  'subtitulo',
  'subtitle',
  'tag',
  'etiqueta',
]);

function extractHtmlContent(rawItem) {
  if (!rawItem) return '';
  const data = rawItem.data && typeof rawItem.data === 'object' ? rawItem.data : rawItem;

  for (const key of CONTENT_FIELD_KEYS) {
    const val = data[key];
    if (!val) continue;
    if (typeof val === 'string' && val.trim()) {
      return val;
    }
    if (typeof val === 'object' && Array.isArray(val.nodes)) {
      const converted = renderRicosNodes(val.nodes);
      if (converted.trim()) return converted;
    }
  }

  // Fallback: accept any custom field created by client in Wix CMS
  for (const [key, val] of Object.entries(data)) {
    if (IGNORED_META_KEYS.has(key) || !val) continue;
    if (typeof val === 'string' && val.trim().length > 20) {
      return val;
    }
    if (typeof val === 'object' && Array.isArray(val.nodes)) {
      const converted = renderRicosNodes(val.nodes);
      if (converted.trim().length > 20) return converted;
    }
  }
  return '';
}

function resolveDateIso(rawDate) {
  if (!rawDate) return null;
  if (typeof rawDate === 'object' && rawDate.$date) return rawDate.$date;
  return rawDate;
}

function pickBestLegalItem(items = []) {
  const candidates = (Array.isArray(items) ? items : [])
    .map((item) => {
      const rawData = item?.data && typeof item.data === 'object' ? item.data : item;
      const htmlContent = extractHtmlContent(item);
      return { rawItem: item, rawData, htmlContent };
    })
    .filter((entry) => entry.htmlContent && entry.htmlContent.trim().length > 20);

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const tA = new Date(
      resolveDateIso(a.rawData?._updatedDate) || resolveDateIso(a.rawData?._createdDate) || 0
    ).getTime();
    const tB = new Date(
      resolveDateIso(b.rawData?._updatedDate) || resolveDateIso(b.rawData?._createdDate) || 0
    ).getTime();
    return tB - tA;
  });

  return candidates[0];
}

function normalizeLiveItem(picked, config) {
  const { rawItem, rawData, htmlContent } = picked;
  return {
    id: rawData._id || rawItem.id || `cms-${config.key}`,
    title: rawData.title || rawData.titulo || config.label,
    subtitle: rawData.subtitulo || rawData.subtitle || '',
    tag: rawData.tag || rawData.etiqueta || '',
    content: htmlContent,
    lastUpdated:
      resolveDateIso(rawData._updatedDate) ||
      resolveDateIso(rawData._createdDate) ||
      config.lastUpdated,
    isLive: true,
  };
}

/**
 * Hook to dynamically fetch legal policies from Wix CMS with local luxury dataset fallback.
 * @param {string} policyKey - 'terms' | 'refund' | 'privacy' | 'shipping'
 */
export function useLegalCMS(policyKey = 'terms') {
  const { wixClient } = useWixClient();
  const config = LEGAL_POLICIES_CONFIG[policyKey] || LEGAL_POLICIES_CONFIG.terms;

  const [state, setState] = useState(() => {
    const cached = legalCache.get(config.key) || null;
    return { key: cached ? config.key : null, entry: cached };
  });

  useEffect(() => {
    let isCancelled = false;

    const fallbackEntry = {
      id: `default-${config.key}`,
      title: config.label,
      subtitle: '',
      tag: '',
      content: DEFAULT_LEGAL_CONTENT[config.key] || '',
      lastUpdated: config.lastUpdated,
      isLive: false,
    };

    async function fetchPolicyFromCMS() {
      let liveEntry = null;

      try {
        if (wixClient?.items?.query) {
          const legacyList = LEGACY_COLLECTIONS[config.key] || [];
          const candidateCollections = [config.collection, ...legacyList];

          for (const coll of candidateCollections) {
            if (isCancelled) return;
            try {
              const queryBuilder = wixClient.items.query(coll);
              const res =
                coll === 'Politicas'
                  ? await queryBuilder.eq('slug', config.key).limit(10).find()
                  : await queryBuilder.limit(10).find();
              const picked = pickBestLegalItem(res?.items || []);
              if (picked) {
                liveEntry = normalizeLiveItem(picked, config);
                break;
              }
            } catch {
              // Collection may not exist yet; try next candidate
            }
          }
        }

        if (!liveEntry && !isCancelled) {
          try {
            const apiRes = await fetch(
              `/api/legal-policies?policy=${encodeURIComponent(config.key)}`
            );
            const contentType = apiRes.headers.get('content-type') || '';
            if (apiRes.ok && contentType.includes('application/json')) {
              const json = await apiRes.json();
              const apiItem = json?.policy?.item;
              if (apiItem) {
                const picked = pickBestLegalItem([apiItem]);
                if (picked) {
                  liveEntry = normalizeLiveItem(picked, config);
                }
              }
            }
          } catch {
            // Serverless API not available (e.g. local Vite preview)
          }
        }
      } catch (err) {
        console.warn('[LegalCMS] Notice:', err?.message || err);
      }

      if (isCancelled) return;

      const resolved = liveEntry || fallbackEntry;
      legalCache.set(config.key, resolved);
      setState({ key: config.key, entry: resolved });
    }

    fetchPolicyFromCMS();

    const handleFocus = () => {
      fetchPolicyFromCMS();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isCancelled = true;
      window.removeEventListener('focus', handleFocus);
    };
  }, [wixClient, config]);

  const cachedForKey = legalCache.get(config.key) || null;
  const activeEntry = state.key === config.key ? state.entry : cachedForKey;
  const loading = !activeEntry;

  return {
    config,
    data: activeEntry,
    content: activeEntry?.content || DEFAULT_LEGAL_CONTENT[config.key] || '',
    title: activeEntry?.title || config.label,
    subtitle: activeEntry?.subtitle || '',
    tag: activeEntry?.tag || '',
    lastUpdated: activeEntry?.lastUpdated || config.lastUpdated,
    loading,
    error: null,
    isCMSLive: Boolean(activeEntry?.isLive),
    allPolicies: Object.values(LEGAL_POLICIES_CONFIG),
  };
}
