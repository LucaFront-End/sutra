/**
 * Generates Google Merchant Center Product Feed (.tsv) from live Wix Stores catalog
 * Outputs:
 *   - ./google-merchant-feed.tsv
 *   - ./public/google-merchant-feed.tsv
 */
import fs from 'fs';
import path from 'path';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';

const WIX_CLIENT_ID = '7bf257ab-ef88-41f5-9904-da15badacfc1';
const SITE_URL = 'https://www.sutramexico.com';

const wixClient = createClient({
  modules: { products },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
});

function cleanText(raw = '') {
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
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function resolveCategories(name = '', slug = '') {
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

async function main() {
  await wixClient.auth.generateVisitorTokens();
  const res = await wixClient.products.queryProducts().limit(100).find();
  const wixItems = res.items || [];

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

  const rows = [headers.join('\t')];

  for (const item of wixItems) {
    // Skip accidental duplicate draft copies if slug starts with "copia-de-"
    if (String(item.slug || '').startsWith('copia-de-')) {
      continue;
    }

    const id = item._id;
    const rawTitle = cleanText(item.name || 'Producto Sutra México');
    const title = rawTitle.includes('SUTRA') || rawTitle.includes('Sutra')
      ? rawTitle
      : `${rawTitle} | SUTRA México`;

    let description = cleanText(item.description || '');
    if (!description || description.length < 30) {
      description = `${rawTitle}. Elaborado artesanalmente en México por SUTRA con cera vegetal perlada en arena, esencias botánicas puras y diseño consciente para transformar tu hogar en un santuario de bienestar.`;
    }
    if (description.length > 4900) {
      description = description.slice(0, 4900);
    }

    const link = `${SITE_URL}/producto/${encodeURIComponent(item.slug || item._id)}`;
    const mainImage = item.media?.mainMedia?.image?.url || '';
    const extraImages = (item.media?.items || [])
      .map((m) => m?.image?.url)
      .filter((url) => url && url !== mainImage)
      .slice(0, 10)
      .join(',');

    const inStock = item.stock?.inStock !== false;
    const availability = inStock ? 'in_stock' : 'out_of_stock';

    const regularPrice = Number(item.price?.price || item.priceData?.price || 0);
    const discountedPrice = Number(item.price?.discountedPrice || item.priceData?.discountedPrice || regularPrice);
    const currency = item.price?.currency || 'MXN';

    const priceFormatted = `${regularPrice.toFixed(2)} ${currency}`;
    const salePriceFormatted =
      discountedPrice > 0 && discountedPrice < regularPrice
        ? `${discountedPrice.toFixed(2)} ${currency}`
        : '';

    const { googleCategory, productType } = resolveCategories(rawTitle, item.slug);
    const mpn = item.sku
      ? cleanText(item.sku)
      : `SUTRA-${String(item._id).slice(0, 8).toUpperCase()}`;

    const shippingCost = regularPrice >= 1200 ? '0.00' : '149.00';
    const shipping = `MX:::${shippingCost} ${currency}`;

    const row = [
      id,
      title,
      description,
      link,
      mainImage,
      extraImages,
      availability,
      priceFormatted,
      salePriceFormatted,
      'SUTRA México',
      'new',
      googleCategory,
      productType,
      'no',
      mpn,
      shipping,
    ].map((cell) => String(cell ?? '').replace(/[\t\r\n]+/g, ' ').trim());

    rows.push(row.join('\t'));
  }

  const tsvContent = rows.join('\n') + '\n';

  const rootOut = path.resolve('d:/Workspace/Assets/Sutra/google-merchant-feed.tsv');
  const publicOut = path.resolve('d:/Workspace/Assets/Sutra/public/google-merchant-feed.tsv');

  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(rootOut, tsvContent, 'utf8');
  fs.writeFileSync(publicOut, tsvContent, 'utf8');

  console.log(`Generated ${rows.length - 1} products into:`);
  console.log(' -', rootOut);
  console.log(' -', publicOut);
}

main().catch((err) => {
  console.error('Error generating Google Merchant TSV:', err);
  process.exit(1);
});
