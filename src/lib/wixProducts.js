import { KNOWN_SUBSCRIPTION_OPTIONS } from './wixClient';

export const HIDDEN_SHOP_COLLECTION_ID = 'a0789006-8b3b-44bb-8997-c1adb0d7cb03';
export const VELA_DE_ARENA_SKU = 'S-VG-0001';
export const VELA_DE_ARENA_WIX_ID = '8f2638e1-9d93-43a0-ba82-f46b6d1dd212';
export const VELA_DE_ARENA_CANONICAL_SLUG = 'vela-de-arena-sutra';

export function resolveChoiceColorHex(rawVal = '') {
  const trimmed = String(rawVal || '').trim();
  if (trimmed.startsWith('#')) return trimmed;

  const normalized = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/\b(blanco|white)\b/.test(normalized)) return '#FAF7F2';
  if (/\b(negro|black|carbon)\b/.test(normalized)) return '#1C1917';
  if (/\b(dorado|gold|oro)\b/.test(normalized)) return '#D4A76A';
  if (/\b(arena|beige|sand)\b/.test(normalized)) return '#E8DFC8';
  if (/\b(rosa|rose)\b/.test(normalized)) return '#E8B4B8';
  if (/\b(verde|oliva|green)\b/.test(normalized)) return '#7B8A6E';
  if (/\b(terracota|barro)\b/.test(normalized)) return '#C27856';
  if (/\b(gris|gray|grey)\b/.test(normalized)) return '#9E9E9E';
  return '#D4A76A';
}

/**
 * Converts a raw Wix media URL (wix:image://v1/{fileId}/...) to a public Wix static CDN URL.
 * Also strips downscaled thumbnail parameters (/v1/fit/w_50... or /v1/fill/...) to return the full-resolution master.
 */
export function parseWixMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/')) {
    // Strip Wix automatic thumbnail / downscaling parameters to return full master resolution!
    return rawUrl.replace(/\/v1\/(fit|fill)\/[^/]+\/[^/]+$/, '');
  }
  if (rawUrl.startsWith('wix:image://')) {
    // Regex matches fileId before slash or hash
    const match = rawUrl.match(/wix:image:\/\/v1\/([^/#]+)/);
    if (match && match[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }
  return rawUrl;
}

/**
 * Strips HTML tags and decodes common HTML entities from a string.
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } catch {
      // Fallback
    }
  }
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligently formats Wix rich text description into elegant HTML paragraphs, feature cards, and lists.
 */
export function formatDescriptionHtml(rawHtml, plainText) {
  let str = rawHtml || plainText;
  if (!str) return '';

  // 1. Separate sections: "¿Qué incluye..."
  const includesMatch = str.match(/<p>(¿Qué incluye[^<]+)<\/p>\s*<p>(.*?)<\/p>/i);
  if (includesMatch) {
    const title = includesMatch[1];
    const itemsRaw = includesMatch[2];
    const itemEmojis = ['📦', '🎁', '🏝️', '🌿', '🪮', '⚪', '🕯️', '🚚'];
    let items = [];
    
    let currentEmoji = '';
    let currentText = '';
    for (let i = 0; i < itemsRaw.length; i++) {
      const matchEmoji = itemEmojis.find((e) => itemsRaw.startsWith(e, i));
      if (matchEmoji) {
        if (currentEmoji) items.push({ emoji: currentEmoji, text: currentText.trim() });
        currentEmoji = matchEmoji;
        currentText = '';
        i += matchEmoji.length - 1;
      } else {
        currentText += itemsRaw[i];
      }
    }
    if (currentEmoji) items.push({ emoji: currentEmoji, text: currentText.trim() });

    const includesHtml = `
      <div class="pdp-included-box">
        <h4 class="pdp-included-title">✧ ${title}</h4>
        <ul class="pdp-included-list">
          ${items.map((it) => `<li><span class="incl-icon">${it.emoji}</span><span>${it.text}</span></li>`).join('\n')}
        </ul>
      </div>
    `;

    str = str.replace(includesMatch[0], includesHtml);
  }

  // 2. Section titles: "Las 4 Esferas Zen:" or subtitles
  str = str.replace(/<p>(Las 4 Esferas[^<]+)<\/p>/gi, '<div class="pdp-elements-header"><h3 class="pdp-desc-section-title">✧ $1</h3></div>');

  // 3. Shipping highlight: <p>🚚 Envíos a todo México.</p>
  str = str.replace(/<p>(🚚[^<]+)<\/p>/g, '<div class="pdp-shipping-highlight"><span>$1</span></div>');

  // 4. Split and structure feature blocks starting with emojis:
  // e.g. <p>🧘 Tu escape de calmaIdeal para... -> emoji + header + body
  const emojiStartRegex = /<p>((?:[\p{Extended_Pictographic}\uFE0F\u200D])+)\s*([^<]+)<\/p>/gu;
  str = str.replace(emojiStartRegex, (match, emoji, content) => {
    const splitIdx = content.search(/[a-zñáéíóú—\-][A-ZÁÉÍÓÚ]/u);
    if (splitIdx !== -1) {
      const header = content.slice(0, splitIdx + 1).trim();
      const body = content.slice(splitIdx + 1).trim();
      return `<div class="pdp-feature-card">
        <div class="pdp-feature-title-wrap">
          <span class="pdp-feature-icon">${emoji.trim()}</span>
          <strong class="pdp-feature-title">${header}</strong>
        </div>
        <p class="pdp-feature-body">${body}</p>
      </div>`;
    }
    return `<div class="pdp-feature-card">
      <div class="pdp-feature-title-wrap">
        <span class="pdp-feature-icon">${emoji.trim()}</span>
        <strong class="pdp-feature-title">${content.trim()}</strong>
      </div>
    </div>`;
  });

  // Clean any empty paragraphs
  str = str.replace(/<p>\s*<\/p>/g, '');

  return str;
}

/**
 * Normalizes a Wix Stores product into the shape expected by Sutra components.
 */
export function normalizeProduct(
  wixProduct,
  hiddenCollectionIds = new Set([HIDDEN_SHOP_COLLECTION_ID])
) {
  const {
    _id,
    slug,
    name,
    description,
    priceData,
    media,
    productOptions,
    ribbon,
    numericId,
    collectionIds,
    variants: wixVariants,
  } = wixProduct;

  // Extract price & discount
  const rawDiscountedPrice = priceData?.discountedPrice;
  const rawOriginalPrice = priceData?.price;

  let priceNum = 0;
  let originalPriceNum = null;

  if (rawDiscountedPrice !== undefined && rawOriginalPrice !== undefined && rawOriginalPrice > rawDiscountedPrice) {
    priceNum = Number(rawDiscountedPrice);
    originalPriceNum = Number(rawOriginalPrice);
  } else {
    priceNum = Number(rawOriginalPrice ?? rawDiscountedPrice ?? 0);
    originalPriceNum = null;
  }

  // Extract all media images and convert wix:image:// to cdn urls
  const rawImageUrls = [];
  if (media?.mainMedia?.image?.url) rawImageUrls.push(media.mainMedia.image.url);
  else if (media?.mainMedia?.thumbnail?.url) rawImageUrls.push(media.mainMedia.thumbnail.url);

  if (Array.isArray(media?.items)) {
    media.items.forEach((item) => {
      const u = item.image?.url || item.thumbnail?.url || item.url || item.src;
      if (u) rawImageUrls.push(u);
    });
  }

  const parsedUrls = [];
  rawImageUrls.forEach((raw) => {
    const parsed = parseWixMediaUrl(raw);
    if (parsed && !parsedUrls.includes(parsed)) {
      parsedUrls.push(parsed);
    }
  });

  const mainImage = parsedUrls[0] || '/assets/images/cera-blanca.jpg';

  const galleryImages = parsedUrls.map((url, idx) => ({
    id: `wix-img-${idx}`,
    src: url,
    label: '',
  }));

  // Clean and formatted description
  const cleanDescription = stripHtml(description);
  const formattedHtml = formatDescriptionHtml(description, cleanDescription);

  // Derive shortDesc for cards (under 12 words)
  let shortDesc = '';
  if (cleanDescription) {
    const firstSentence = cleanDescription.split(/[.!?]/)[0].trim();
    const words = firstSentence.split(/\s+/);
    shortDesc = words.length > 10 ? words.slice(0, 10).join(' ') + '...' : firstSentence;
  }

  // Deduce category dynamically from name & description with accent insensitivity
  const cleanStr = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normName = cleanStr(name);
  const normDesc = cleanStr(cleanDescription);
  let category = 'velas';
  let subcategory = null;

  // 1. Mystery Box / Subscriptions (checked first so it isn't overridden by 'velas' in subtitle)
  const isMysteryExplicit = normName.includes('mistery') || normName.includes('mystery') || normName.includes('suscripci');

  // 2. Explicit Tea checks (Té Rituales, Infusiones, Tisanas, Matcha, etc.)
  const isTeExplicit = !isMysteryExplicit && (
    normName.includes('te rituales') ||
    /\bte\b/i.test(normName) ||
    normName.includes('infusion') ||
    normName.includes('tisana') ||
    normName.includes('matcha') ||
    normName.includes('chawan')
  );

  // 3. Explicit Accessories checks (Jardín Zen, Cartas de rituales, Vasijas)
  const isZenExplicit = !isMysteryExplicit && !isTeExplicit && (normName.includes('zen') || normName.includes('jardin'));
  const isCartasExplicit = !isMysteryExplicit && !isTeExplicit && (normName.includes('carta') || normName.includes('baraja') || normDesc.includes('cartas de ritual'));
  const isVasijaExplicit = !isMysteryExplicit && !isTeExplicit && (normName.includes('vasija') || normName.includes('ceramica') || normDesc.includes('vasija wabi'));

  // 4. Explicit Vela checks (Candle kits, granular wax, vessels, refills)
  const isVelaExplicit = !isMysteryExplicit && !isTeExplicit && !isZenExplicit && !isCartasExplicit && !isVasijaExplicit && (
    normName.includes('vela') || normName.includes('cera en arena') || normName.includes('cera perlada') || normName.includes('kit vela') || normName.includes('cera granulada')
  );

  // 5. Aromas & Esencias
  const aromaKeywords = [
    'esencia', 'aroma', 'spray', 'bruma', 'mist', 'difusor', 'aceite', 
    'gotero', 'fragancia', 'rosewood', 'copal', 'patchouli', 'ylang',
    'amanecer vivo', 'noche serena', 'abrazo de calma', 'deseo dorado', 
    'luz alegre', 'sol interior', 'menta clara', 'raiz profunda', 'templo interior', 
    'limpia aura', 'madre rose', 'madre rosa'
  ];
  const hasAromaKw = aromaKeywords.some((kw) => normName.includes(kw));

  if (isMysteryExplicit) {
    category = 'suscripciones';
  } else if (isTeExplicit) {
    category = 'te';
  } else if (isZenExplicit) {
    category = 'accesorios';
    subcategory = 'jardin-zen';
  } else if (isCartasExplicit) {
    category = 'accesorios';
    subcategory = 'cartas-rituales';
  } else if (isVasijaExplicit) {
    category = 'accesorios';
    subcategory = 'vasijas';
  } else if (isVelaExplicit) {
    category = 'velas';
  } else if (hasAromaKw || normDesc.includes('esencia pura') || normDesc.includes('bruma bot')) {
    category = 'aromas';
  } else {
    category = 'velas';
  }

  // Extract dynamic options from Wix productOptions
  const options = [];
  if (Array.isArray(productOptions) && productOptions.length > 0) {
    productOptions.forEach((pOpt) => {
      const optName = pOpt.name || 'Opción';
      const isColor = pOpt.optionType === 'COLOR' || optName.toLowerCase().includes('color');
      const isSelect = !isColor && ((pOpt.choices && pOpt.choices.length > 4) || optName.toLowerCase().includes('aroma') || optName.toLowerCase().includes('esencia'));
      const optType = isColor ? 'color' : (isSelect ? 'select' : 'pills');

      const choices = (pOpt.choices || []).map((ch, idx) => {
        let chImg = ch.media?.mainMedia?.image?.url ? parseWixMediaUrl(ch.media.mainMedia.image.url) : undefined;
        // If choice has no direct media, look in wixVariants for an image corresponding to this choice
        if (!chImg && Array.isArray(wixVariants)) {
          const val = ch.value || ch.description;
          const matchingVar = wixVariants.find((v) => {
            return v.choices && (v.choices[pOpt.name] === val || Object.values(v.choices).includes(val));
          });
          const rawVarImg = matchingVar?.media?.mainMedia?.image?.url 
            || matchingVar?.media?.items?.[0]?.image?.url 
            || matchingVar?.image?.url;
          if (rawVarImg) chImg = parseWixMediaUrl(rawVarImg);
        }
        return {
          label: ch.description || ch.value || `Opción ${idx + 1}`,
          value: ch.value || ch.description || `opt-${idx}`,
          hex: isColor ? resolveChoiceColorHex(ch.value || ch.description) : undefined,
          isDefault: idx === 0,
          img: chImg,
        };
      });

      if (choices.length > 0) {
        options.push({
          id: pOpt.id || pOpt.name?.toLowerCase().replace(/\s+/g, '-') || `opt-${options.length}`,
          label: optName,
          type: optType,
          choices,
        });
      }
    });
  }

  const sku = String(wixProduct.sku || wixProduct.variants?.[0]?.variant?.sku || '').trim();
  const isVelaDeArenaHero =
    sku.toUpperCase() === VELA_DE_ARENA_SKU || _id === VELA_DE_ARENA_WIX_ID;
  const wixSlug = slug || _id;
  const canonicalSlug =
    isVelaDeArenaHero && (!slug || slug.startsWith('copia-de-'))
      ? VELA_DE_ARENA_CANONICAL_SLUG
      : wixSlug;
  const hideFromShop =
    Array.isArray(collectionIds) &&
    collectionIds.some((cid) => hiddenCollectionIds.has(cid));

  return {
    id: _id,
    _wixId: _id,
    slug: canonicalSlug,
    wixSlug,
    sku,
    hideFromShop,
    name: name || 'Producto SUTRA',
    emotionalName: ribbon || (subcategory === 'jardin-zen' ? 'Meditación & Enfoque' : 'Ritual Sutra'),
    price: `$${priceNum.toLocaleString()} MXN`,
    priceNum,
    originalPriceNum,
    category,
    subcategory,
    shortDesc: shortDesc || 'Elemento ritual artesanal de bienestar y conexión.',
    description: cleanDescription,
    descriptionHtml: formattedHtml,
    img: mainImage,
    images: galleryImages.length > 0 ? galleryImages : [{ id: 'main', src: mainImage, label: '' }],
    options: options.length > 0 ? options : undefined,
    wixVariants: wixVariants || [],
    numericId: numericId || '',
    stock: wixProduct.stock || { inStock: true, inventoryStatus: 'IN_STOCK' },
    collectionIds: collectionIds || [],
    subscriptionOptionId: wixProduct.subscriptionDetails?.subscriptions?.[0]?._id
      || KNOWN_SUBSCRIPTION_OPTIONS[_id]
      || null,
    isWixProduct: true,
  };
}

/**
 * Fetch all products from Wix Stores, resolving "NO MOSTRAR EN TIENDA" collection IDs dynamically.
 */
export async function fetchAllProducts(wixClient) {
  try {
    const [result, collectionsRes] = await Promise.all([
      wixClient.products.queryProducts().limit(100).find(),
      wixClient.collections?.queryCollections
        ? wixClient.collections.queryCollections().limit(100).find().catch(() => null)
        : Promise.resolve(null),
    ]);

    const hiddenCollectionIds = new Set([HIDDEN_SHOP_COLLECTION_ID]);
    (collectionsRes?.items || []).forEach((col) => {
      const normName = String(col?.name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      const normSlug = String(col?.slug || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      if (normName === 'no mostrar en tienda' || normSlug === 'no-mostrar-en-tienda') {
        if (col._id) hiddenCollectionIds.add(col._id);
      }
    });

    return (result.items || []).map((item) => normalizeProduct(item, hiddenCollectionIds));
  } catch (error) {
    console.error('[Wix] Failed to fetch products:', error);
    const msg = error?.message
      || error?.details?.applicationError?.description
      || 'Error loading products from Wix';
    throw new Error(msg);
  }
}

/**
 * Fetch a single product by slug from Wix Stores.
 */
export async function fetchProductBySlug(wixClient, slug) {
  try {
    const result = await wixClient.products
      .queryProducts()
      .eq('slug', slug)
      .find();

    if (result.items && result.items.length > 0) {
      return normalizeProduct(result.items[0]);
    }
    return null;
  } catch (error) {
    console.error('[Wix] Failed to fetch product by slug:', error);
    const msg = error?.message
      || error?.details?.applicationError?.description
      || 'Error loading product from Wix';
    throw new Error(msg);
  }
}
