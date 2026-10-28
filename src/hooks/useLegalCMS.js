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
          const candidateCollections = [
            config.collection,
            config.key === 'terms' ? 'Terminosycondiciones' : null,
            config.key === 'terms' ? 'TerminosYCondiciones' : null,
            config.key === 'refund' ? 'PoliticaDeReembolsos' : null,
            config.key === 'privacy' ? 'AvisoDePrivacidad' : null,
            config.key === 'shipping' ? 'PoliticaDeEnvios' : null,
          ].filter(Boolean);

          let foundItem = null;

          for (const coll of candidateCollections) {
            try {
              const res = await wixClient.items.query(coll).limit(1).find();
              if (res.items && res.items.length > 0) {
                foundItem = res.items[0];
                break;
              }
            } catch (_) {
              // Try next candidate
            }
          }

          // Also check consolidated 'Politicas' or 'Legal' collection if single collection approach was used
          if (!foundItem) {
            for (const singleColl of ['Politicas', 'LegalPolicies', 'Legal']) {
              try {
                const res = await wixClient.items.query(singleColl).eq('slug', config.key).limit(1).find();
                if (res.items && res.items.length > 0) {
                  foundItem = res.items[0];
                  break;
                }
              } catch (_) {}
            }
          }

          if (!isCancelled && foundItem) {
            const rawData = foundItem.data || foundItem;
            const htmlContent = extractHtmlContent(foundItem);

            if (htmlContent && htmlContent.trim().length > 40) {
              const liveEntry = {
                id: rawData._id || foundItem.id,
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
