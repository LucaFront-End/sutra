import process from 'node:process';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const WIX_API_BASE = 'https://www.wixapis.com';
const WIX_CLIENT_ID = '7bf257ab-ef88-41f5-9904-da15badacfc1';
const DEFAULT_WIX_SITE_ID = 'd33fa0f4-e839-48dc-9ba7-f71199a5796e';
const COLLECTION_ID = 'LINKTREE';

function filterPublishedItems(rawItems = []) {
  return (Array.isArray(rawItems) ? rawItems : []).filter((entry) => {
    const data = entry?.data && typeof entry.data === 'object' ? entry.data : entry;
    if (!data || typeof data !== 'object') return false;
    if (data._publishStatus && data._publishStatus !== 'PUBLISHED') return false;
    return true;
  });
}

async function queryViaSdk() {
  const client = createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
  });

  const result = await client.items.query(COLLECTION_ID).limit(100).find();
  return filterPublishedItems(result?.items || []);
}

async function queryViaRestApi(apiKey, siteId) {
  const response = await fetch(`${WIX_API_BASE}/wix-data/v2/items/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
      'wix-site-id': siteId,
    },
    body: JSON.stringify({
      dataCollectionId: COLLECTION_ID,
      query: { paging: { limit: 100 } },
      consistentRead: true,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `Wix Data REST error HTTP ${response.status}`);
  }

  const rawList = Array.isArray(data?.dataItems) ? data.dataItems : [];
  const flattened = rawList.map((entry) => ({
    ...(entry?.data || {}),
    _id: entry?.id || entry?.data?._id,
  }));

  return filterPublishedItems(flattened);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const isFresh = req.query?.fresh === '1';
  res.setHeader(
    'Cache-Control',
    isFresh ? 'no-store' : 'public, s-maxage=15, stale-while-revalidate=60'
  );

  try {
    const publishedItems = await queryViaSdk();
    return res.status(200).json({
      ok: true,
      collection: COLLECTION_ID,
      source: 'wix-sdk',
      count: publishedItems.length,
      items: publishedItems,
    });
  } catch (sdkErr) {
    const apiKey = (process.env.WIX_API_KEY || process.env.VITE_WIX_API_KEY || '').trim();
    const siteId = (
      process.env.WIX_SITE_ID ||
      process.env.VITE_WIX_SITE_ID ||
      DEFAULT_WIX_SITE_ID
    ).trim();

    if (apiKey) {
      try {
        const restItems = await queryViaRestApi(apiKey, siteId);
        return res.status(200).json({
          ok: true,
          collection: COLLECTION_ID,
          source: 'wix-rest',
          count: restItems.length,
          items: restItems,
        });
      } catch (restErr) {
        return res.status(502).json({
          ok: false,
          collection: COLLECTION_ID,
          error: restErr?.message || sdkErr?.message || 'wix_query_failed',
        });
      }
    }

    return res.status(502).json({
      ok: false,
      collection: COLLECTION_ID,
      error: sdkErr?.message || 'wix_query_failed',
    });
  }
}
