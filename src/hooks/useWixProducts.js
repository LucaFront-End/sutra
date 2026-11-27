import { useState, useEffect, useMemo } from 'react';
import { useWixClient } from '../context/WixContext';
import { fetchAllProducts, fetchProductBySlug } from '../lib/wixProducts';

/**
 * Hook to fetch all products from Wix Stores.
 * Excludes items in "NO MOSTRAR EN TIENDA" unless includeHidden is true.
 */
export function useWixProducts(options = {}) {
  const { includeHidden = false } = options;
  const { wixClient, isReady } = useWixClient();
  const [allProductsState, setAllProductsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllProducts(wixClient);
        if (!cancelled) setAllProductsState(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products');
          console.error('[useWixProducts]', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [wixClient, isReady]);

  const visibleProducts = useMemo(
    () => allProductsState.filter((p) => !p.hideFromShop),
    [allProductsState]
  );

  return {
    products: includeHidden ? allProductsState : visibleProducts,
    allWixProducts: allProductsState,
    loading,
    error,
  };
}

/**
 * Hook to fetch a single product by slug from Wix Stores.
 */
export function useWixProduct(slug) {
  const { wixClient, isReady } = useWixClient();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isReady || !slug) {
      if (!slug) setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductBySlug(wixClient, slug);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load product');
          console.error('[useWixProduct]', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [wixClient, isReady, slug]);

  return { product, loading, error };
}
