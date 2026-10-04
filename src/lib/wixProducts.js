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
export function normalizeProduct(wixProduct) {
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

  // 1. Explicit Vela checks (Candle kits, granular wax, vessels, refills)
  const isVelaExplicit = normName.includes('vela') || normName.includes('cera en arena') || normName.includes('cera perlada') || normName.includes('kit vela') || normName.includes('cera granulada');

  // 2. Explicit Tea checks (Té Rituales, Infusiones, Tisanas, Matcha, etc.)
  // Must be checked before aromas so that teas like "Té Rituales Raíz" or "Té Rituales Balance" aren't confused with aromas
  const isTeExplicit = !isVelaExplicit && (
    normName.includes('te rituales') ||
    /\bte\b/i.test(normName) ||
    normName.includes('infusion') ||
    normName.includes('tisana') ||
    normName.includes('matcha') ||
    normName.includes('chawan')
  );

  // 3. Explicit Accessories checks (Jardín Zen, Cartas de rituales, Vasijas)
  const isZenExplicit = !isVelaExplicit && !isTeExplicit && (normName.includes('zen') || normName.includes('jardin'));
  const isCartasExplicit = !isVelaExplicit && !isTeExplicit && (normName.includes('carta') || normName.includes('baraja') || normDesc.includes('cartas de ritual'));
  const isVasijaExplicit = !isVelaExplicit && !isTeExplicit && (normName.includes('vasija') || normName.includes('ceramica') || normDesc.includes('vasija wabi'));

  // 4. Mystery Box / Subscriptions
  const isMysteryExplicit = normName.includes('mistery') || normName.includes('mystery') || normName.includes('suscripci');

  // 5. Aromas & Esencias
  const aromaKeywords = [
    'esencia', 'aroma', 'spray', 'bruma', 'mist', 'difusor', 'aceite', 
    'gotero', 'fragancia', 'rosewood', 'copal', 'patchouli', 'ylang',
    'amanecer vivo', 'noche serena', 'abrazo de calma', 'deseo dorado', 
    'luz alegre', 'sol interior', 'menta clara', 'raiz profunda', 'templo interior', 
    'limpia aura', 'madre rose', 'madre rosa'
  ];
  const hasAromaKw = aromaKeywords.some((kw) => normName.includes(kw));

  if (isVelaExplicit) {
    category = 'velas';
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
  } else if (isMysteryExplicit) {
    category = 'suscripciones';
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

      const choices = (pOpt.choices || []).map((ch, idx) => ({
        label: ch.description || ch.value || `Opción ${idx + 1}`,
        value: ch.value || ch.description || `opt-${idx}`,
        hex: isColor && ch.value && ch.value.startsWith('#') ? ch.value : (isColor ? '#D4A76A' : undefined),
        isDefault: idx === 0,
        img: ch.media?.mainMedia?.image?.url ? parseWixMediaUrl(ch.media.mainMedia.image.url) : undefined,
      }));

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

  return {
    id: _id,
    _wixId: _id,
    slug: slug || _id,
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
    isWixProduct: true,
  };
}

/**
 * Fetch all products from Wix Stores.
 */
export async function fetchAllProducts(wixClient) {
  try {
    const result = await wixClient.products.queryProducts().find();
    return (result.items || []).map(normalizeProduct);
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
