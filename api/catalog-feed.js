/**
 * Live Catalog Feed Serverless Endpoint (Meta Commerce Manager XML/CSV/TSV & Google Merchant Center TSV)
 * Queries Wix Stores catalog dynamically in real time using @wix/sdk.
 */
import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';

export const WIX_CLIENT_ID = '7bf257ab-ef88-41f5-9904-da15badacfc1';
export const SITE_URL = 'https://www.sutramexico.com';
export const DEFAULT_BRAND = 'SUTRA México';
export const DEFAULT_GOOGLE_STORE_CODE = '06984961168883982863';

export function cleanText(raw = '') {
  return String(raw)
    .replace(/<\/(p|div|h[1-6]|li|ul|ol)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    // Strip XML-illegal control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function cleanMediaUrl(rawUrl = '') {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl.replace(/\/v1\/(fit|fill)\/[^/]+\/[^/]+$/, '');
  }
  if (rawUrl.startsWith('wix:image://')) {
    const match = rawUrl.match(/wix:image:\/\/v1\/([^/#]+)/);
    if (match && match[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }
  return rawUrl;
}

export function resolveCategories(name = '', slug = '') {
  const lower = `${name} ${slug}`.toLowerCase();
  if (lower.includes('misterybox') || lower.includes('mystery')) {
    return {
      googleCategory: '592', // Home & Garden > Decor > Home Fragrances > Candles
      productType: 'Hogar y Bienestar > Kits de Ritual > Mystery Box',
    };
  }
  if (lower.includes('jardín zen') || lower.includes('jardin-zen')) {
    return {
      googleCategory: '696', // Home & Garden > Decor
      productType: 'Hogar y Bienestar > Objetos de Ritual > Jardín Zen',
    };
  }
  if (lower.includes('té ') || lower.includes('te-rituales') || lower.includes('té-rituales')) {
    return {
      googleCategory: '2073', // Food, Beverages & Tobacco > Beverages > Tea & Infusions
      productType: 'Hogar y Bienestar > Infusiones Botánicas > Té Rituales',
    };
  }
  if (lower.includes('kit')) {
    return {
      googleCategory: '592',
      productType: 'Hogar y Bienestar > Kits de Velas de Arena',
    };
  }
  if (/\besencia\b/.test(lower) || lower.startsWith('esencia-')) {
    return {
      googleCategory: '2918', // Home & Garden > Decor > Home Fragrances > Fragrance Oil
      productType: 'Hogar y Bienestar > Aromaterapia > Esencias Aromáticas',
    };
  }
  return {
    googleCategory: '592',
    productType: 'Hogar y Bienestar > Velas de Arena y Cera en Polvo',
  };
}

export async function fetchWixCatalogItems() {
  const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
  });

  await wixClient.auth.generateVisitorTokens();

  const allItems = [];
  let pageResult = await wixClient.products.queryProducts().limit(100).find();
  if (Array.isArray(pageResult?.items)) {
    allItems.push(...pageResult.items);
  }

  while (typeof pageResult?.hasNext === 'function' && pageResult.hasNext()) {
    pageResult = await pageResult.next();
    if (Array.isArray(pageResult?.items)) {
      allItems.push(...pageResult.items);
    }
  }

  return allItems.filter((item) => item.visible !== false);
}

export function normalizeFeedProducts(wixItems = []) {
  return wixItems
    .map((item) => {
      const id = String(item._id || '').trim();
      const rawTitle = cleanText(item.name || '');
      const metaTitle = rawTitle.slice(0, 150);
      const googleBaseTitle =
        rawTitle.toLowerCase().includes('sutra') ? rawTitle : `${rawTitle} | SUTRA México`;
      const googleTitle = googleBaseTitle.slice(0, 150);

      let description = cleanText(item.description || '');
      if (!description || description.length < 30) {
        description = `${metaTitle}. Elaborado artesanalmente en México por SUTRA con cera vegetal perlada en arena, esencias botánicas puras y diseño consciente para transformar tu hogar en un santuario de bienestar.`;
      }
      if (description.length > 4900) {
        description = description.slice(0, 4900);
      }

      const link = `${SITE_URL}/producto/${encodeURIComponent(item.slug || id)}`;
      const mainRaw = item.media?.mainMedia?.image?.url || item.media?.items?.[0]?.image?.url || '';
      const image_link = cleanMediaUrl(mainRaw);

      const seenImages = new Set(image_link ? [image_link] : []);
      const additional_image_links = [];
      for (const m of item.media?.items || []) {
        const u = cleanMediaUrl(m?.image?.url || m?.thumbnail?.url || '');
        if (u && !seenImages.has(u)) {
          seenImages.add(u);
          additional_image_links.push(u);
          if (additional_image_links.length >= 10) break;
        }
      }

      const inStock =
        item.stock?.inStock !== false && item.stock?.inventoryStatus !== 'OUT_OF_STOCK';
      const trackInventory = Boolean(item.stock?.trackInventory);
      const rawQuantity = item.stock?.quantity;
      const numericQuantity =
        typeof rawQuantity === 'number' && Number.isFinite(rawQuantity)
          ? Math.max(0, Math.floor(rawQuantity))
          : null;
      let localQuantity = '';
      if (!inStock) {
        localQuantity = '0';
      } else if (trackInventory && numericQuantity !== null) {
        localQuantity = String(numericQuantity);
      } else if (numericQuantity !== null && numericQuantity > 0) {
        localQuantity = String(numericQuantity);
      }

      const metaAvailability = inStock ? 'in stock' : 'out of stock';
      const googleAvailability = inStock ? 'in_stock' : 'out_of_stock';
      const condition = 'new';

      const regularPrice = Number(item.priceData?.price ?? item.price?.price ?? 0);
      const discountedPrice = Number(
        item.priceData?.discountedPrice ?? item.price?.discountedPrice ?? regularPrice
      );
      const currency = item.priceData?.currency || item.price?.currency || 'MXN';

      const price = `${regularPrice.toFixed(2)} ${currency}`;
      const sale_price =
        discountedPrice > 0 && discountedPrice < regularPrice
          ? `${discountedPrice.toFixed(2)} ${currency}`
          : '';

      const brand = cleanText(item.brand) || DEFAULT_BRAND;
      const { googleCategory: google_product_category, productType: product_type } =
        resolveCategories(rawTitle, item.slug);
      const identifier_exists = 'no';
      const mpn = item.sku
        ? cleanText(item.sku)
        : `SUTRA-${id.slice(0, 8).toUpperCase()}`;
      const shippingCost = regularPrice >= 1200 ? '0.00' : '149.00';
      const shipping = `MX:::${shippingCost} ${currency}`;

      return {
        id,
        metaTitle,
        googleTitle,
        description,
        link,
        image_link,
        additional_image_links,
        inStock,
        localQuantity,
        metaAvailability,
        googleAvailability,
        condition,
        regularPrice,
        price,
        sale_price,
        brand,
        google_product_category,
        product_type,
        identifier_exists,
        mpn,
        shipping,
      };
    })
    .filter((p) => p.id && p.metaTitle && p.link && p.image_link && p.regularPrice > 0);
}

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCsv(val = '') {
  const s = String(val ?? '').replace(/[\r\n\t]+/g, ' ').trim();
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function escapeTsv(val = '') {
  return String(val ?? '').replace(/[\t\r\n]+/g, ' ').trim();
}

export function buildMetaXml(items = []) {
  const itemNodes = items
    .map((p) => {
      const extraImageTags = p.additional_image_links
        .map((url) => `      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
        .join('\n');
      const salePriceTag = p.sale_price
        ? `\n      <g:sale_price>${escapeXml(p.sale_price)}</g:sale_price>`
        : '';

      return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.metaTitle)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:availability>${escapeXml(p.metaAvailability)}</g:availability>
      <g:condition>${escapeXml(p.condition)}</g:condition>
      <g:price>${escapeXml(p.price)}</g:price>${salePriceTag}
      <g:link>${escapeXml(p.link)}</g:link>
      <g:image_link>${escapeXml(p.image_link)}</g:image_link>${extraImageTags ? `\n${extraImageTags}` : ''}
      <g:brand>${escapeXml(p.brand)}</g:brand>
      <g:google_product_category>${escapeXml(p.google_product_category)}</g:google_product_category>
      <g:product_type>${escapeXml(p.product_type)}</g:product_type>
      <g:identifier_exists>${escapeXml(p.identifier_exists)}</g:identifier_exists>
      <g:mpn>${escapeXml(p.mpn)}</g:mpn>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>SUTRA México - Catálogo Oficial</title>
    <link>${SITE_URL}</link>
    <description>Catálogo oficial de velas en polvo, velas de arena, esencias botánicas, objetos rituales y tés de SUTRA México.</description>
${itemNodes}
  </channel>
</rss>
`;
}

const META_HEADERS = [
  'id',
  'title',
  'description',
  'availability',
  'condition',
  'price',
  'link',
  'image_link',
  'brand',
  'additional_image_link',
  'sale_price',
  'google_product_category',
  'product_type',
  'identifier_exists',
  'mpn',
];

function mapMetaRow(p) {
  return [
    p.id,
    p.metaTitle,
    p.description,
    p.metaAvailability,
    p.condition,
    p.price,
    p.link,
    p.image_link,
    p.brand,
    p.additional_image_links.join(','),
    p.sale_price,
    p.google_product_category,
    p.product_type,
    p.identifier_exists,
    p.mpn,
  ];
}

export function buildMetaCsv(items = []) {
  const lines = [META_HEADERS.map(escapeCsv).join(',')];
  for (const p of items) {
    lines.push(mapMetaRow(p).map(escapeCsv).join(','));
  }
  return lines.join('\n') + '\n';
}

export function buildMetaTsv(items = []) {
  const lines = [META_HEADERS.map(escapeTsv).join('\t')];
  for (const p of items) {
    lines.push(mapMetaRow(p).map(escapeTsv).join('\t'));
  }
  return lines.join('\n') + '\n';
}

export function buildGoogleMerchantTsv(items = []) {
  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'additional_image_link',
    'availability',
    'price',
    'sale_price',
    'brand',
    'condition',
    'google_product_category',
    'product_type',
    'identifier_exists',
    'mpn',
    'shipping',
  ];

  const lines = [headers.join('\t')];
  for (const p of items) {
    const row = [
      p.id,
      p.googleTitle,
      p.description,
      p.link,
      p.image_link,
      p.additional_image_links.join(','),
      p.googleAvailability,
      p.price,
      p.sale_price,
      p.brand,
      p.condition,
      p.google_product_category,
      p.product_type,
      p.identifier_exists,
      p.mpn,
      p.shipping,
    ];
    lines.push(row.map(escapeTsv).join('\t'));
  }
  return lines.join('\n') + '\n';
}

const GOOGLE_LOCAL_HEADERS = ['id', 'store_code', 'availability', 'quantity', 'price'];

function mapGoogleLocalRow(p, storeCode) {
  return [p.id, storeCode, p.googleAvailability, p.localQuantity ?? '', p.price];
}

function buildDelimitedFeed(headers, rows, escapeFn, delimiter) {
  const lines = [headers.map(escapeFn).join(delimiter)];
  for (const row of rows) {
    lines.push(row.map(escapeFn).join(delimiter));
  }
  return lines.join('\n') + '\n';
}

export function buildGoogleLocalInventoryTsv(
  items = [],
  storeCode = DEFAULT_GOOGLE_STORE_CODE
) {
  const resolvedStoreCode = String(storeCode || DEFAULT_GOOGLE_STORE_CODE).trim();
  const rows = items.map((p) => mapGoogleLocalRow(p, resolvedStoreCode));
  return buildDelimitedFeed(GOOGLE_LOCAL_HEADERS, rows, escapeTsv, '\t');
}

export function buildGoogleLocalInventoryCsv(
  items = [],
  storeCode = DEFAULT_GOOGLE_STORE_CODE
) {
  const resolvedStoreCode = String(storeCode || DEFAULT_GOOGLE_STORE_CODE).trim();
  const rows = items.map((p) => mapGoogleLocalRow(p, resolvedStoreCode));
  return buildDelimitedFeed(GOOGLE_LOCAL_HEADERS, rows, escapeCsv, ',');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or HEAD.' });
  }

  const rawMarketplace = String(req.query?.marketplace || 'meta').toLowerCase();
  const isGoogleLocal =
    rawMarketplace === 'google_local' ||
    rawMarketplace === 'google-local' ||
    rawMarketplace === 'google_local_inventory';
  const marketplace = isGoogleLocal
    ? 'google_local'
    : rawMarketplace === 'google'
      ? 'google'
      : 'meta';

  const defaultFormat =
    marketplace === 'google' || marketplace === 'google_local' ? 'tsv' : 'xml';
  const rawFormat = String(req.query?.format || defaultFormat).toLowerCase();
  const format = ['xml', 'csv', 'tsv'].includes(rawFormat) ? rawFormat : defaultFormat;
  const storeCode = String(req.query?.store_code || DEFAULT_GOOGLE_STORE_CODE).trim() || DEFAULT_GOOGLE_STORE_CODE;

  try {
    const wixItems = await fetchWixCatalogItems();
    const productsList = normalizeFeedProducts(wixItems);

    let output = '';
    if (marketplace === 'google_local') {
      if (format === 'csv') {
        output = buildGoogleLocalInventoryCsv(productsList, storeCode);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="google-local-inventory-feed.csv"'
        );
      } else {
        output = buildGoogleLocalInventoryTsv(productsList, storeCode);
        res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="google-local-inventory-feed.tsv"'
        );
      }
    } else if (marketplace === 'google') {
      output = buildGoogleMerchantTsv(productsList);
      res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline; filename="google-merchant-feed.tsv"');
    } else if (format === 'csv') {
      output = buildMetaCsv(productsList);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline; filename="meta-catalog-feed.csv"');
    } else if (format === 'tsv') {
      output = buildMetaTsv(productsList);
      res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline; filename="meta-catalog-feed.tsv"');
    } else {
      output = buildMetaXml(productsList);
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    }

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    return res.status(200).send(output);
  } catch (err) {
    console.error('[api/catalog-feed] Error generating catalog feed:', err);
    return res.status(500).json({
      error: 'Error generating catalog feed from Wix Stores',
      details: err?.message || String(err),
    });
  }
}
