import { useState, useEffect } from 'react';
import { useWixClient } from '../context/WixContext';
import { LEGAL_POLICIES_CONFIG, DEFAULT_LEGAL_CONTENT } from '../data/legalPoliciesData';

// In-memory cache across navigation sessions
const legalCache = new Map();

/**
 * Normalizes rich text or HTML returned by Wix CMS or headless sources
 */
function extractHtmlContent(rawItem) {
  if (!rawItem) return '';
  const data = rawItem.data || rawItem;
  return (
    data.contenido || 
    data.descripcin || 
    data.descripcion || 
    data.richtext || 
    data.description || 
    data.content || 
    ''
  );
}

/**
 * Hook to dynamically fetch legal policies from CMS (Wix CMS / Supabase / Built-in high-fidelity dataset)
 * @param {string} policyKey - 'terms' | 'refund' | 'privacy' | 'shipping'
 */
export function useLegalCMS(policyKey = 'terms') {
  const { wixClient } = useWixClient();
  const config = LEGAL_POLICIES_CONFIG[policyKey] || LEGAL_POLICIES_CONFIG.terms;
  const cached = legalCache.get(config.key);

  const [data, setData] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [isCMSLive, setIsCMSLive] = useState(Boolean(cached?.isLive));

  useEffect(() => {
    // If already cached in memory, use it immediately
    if (legalCache.has(config.key)) {
      const entry = legalCache.get(config.key);
      setData(entry);
      setIsCMSLive(Boolean(entry.isLive));
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchPolicyFromCMS() {
      setLoading(true);
      setError(null);

      // Default fallback content from high-fidelity dataset
      const defaultContent = DEFAULT_LEGAL_CONTENT[config.key] || '';
      const fallbackEntry = {
        id: `default-${config.key}`,
        title: config.label,
        content: defaultContent,
        lastUpdated: config.lastUpdated,
        isLive: false,
      };

      try {
        // 1. Try querying Wix CMS collection if available
        if (wixClient?.items?.query) {
          try {
            const res = await wixClient.items.query(config.collection).limit(1).find();
            if (!isCancelled && res.items && res.items.length > 0) {
              const raw = res.items[0];
              const rawData = raw.data || raw;
              const htmlContent = extractHtmlContent(raw);

              if (htmlContent && htmlContent.trim().length > 40) {
                const liveEntry = {
                  id: rawData._id || raw.id,
                  title: rawData.title || rawData.titulo || config.label,
                  content: htmlContent,
                  lastUpdated: rawData._updatedDate || rawData._createdDate || config.lastUpdated,
                  isLive: true,
                };
                legalCache.set(config.key, liveEntry);
                setData(liveEntry);
                setIsCMSLive(true);
                setLoading(false);
                return;
              }
            }
          } catch (wixErr) {
            // Collection might not exist yet in Wix dashboard, proceed to fallback smoothly
            console.info(`[LegalCMS] Wix CMS collection ${config.collection} not found, using built-in legal CMS.`);
          }
        }

        // 2. Use high-fidelity built-in legal dataset
        if (!isCancelled) {
          legalCache.set(config.key, fallbackEntry);
          setData(fallbackEntry);
          setIsCMSLive(false);
        }
      } catch (err) {
        console.warn(`[LegalCMS] Notice:`, err.message);
        if (!isCancelled) {
          legalCache.set(config.key, fallbackEntry);
          setData(fallbackEntry);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchPolicyFromCMS();

    return () => {
      isCancelled = true;
    };
  }, [wixClient, config.key, config.collection, config.label, config.lastUpdated]);

  return {
    config,
    data,
    content: data?.content || DEFAULT_LEGAL_CONTENT[config.key] || '',
    title: data?.title || config.label,
    lastUpdated: data?.lastUpdated || config.lastUpdated,
    loading,
    error,
    isCMSLive,
    allPolicies: Object.values(LEGAL_POLICIES_CONFIG),
  };
}
