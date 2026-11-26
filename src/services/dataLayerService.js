const PURCHASE_DEDUPE_KEY = 'sutra_gtm_purchased_txs_v1';
const memoryPurchasedTxs = new Set();

function roundPrice(num) {
  const n = Number(num);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

function parsePriceValue(rawPrice) {
  if (typeof rawPrice === 'number') return roundPrice(rawPrice);
  if (typeof rawPrice === 'string') {
    const cleaned = rawPrice.replace(/[^0-9.-]/g, '');
    return roundPrice(parseFloat(cleaned) || 0);
  }
  return 0;
}

function ensureDataLayer() {
  if (typeof window === 'undefined') return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

function hasTrackedPurchase(transactionId) {
  if (!transactionId) return false;
  const key = String(transactionId).trim();
  if (memoryPurchasedTxs.has(key)) return true;
  try {
    const raw = window.sessionStorage.getItem(PURCHASE_DEDUPE_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.includes(key);
  } catch {
    return false;
  }
}

function markPurchaseTracked(transactionId) {
  if (!transactionId) return;
  const key = String(transactionId).trim();
  memoryPurchasedTxs.add(key);
  try {
    const raw = window.sessionStorage.getItem(PURCHASE_DEDUPE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(list) ? list : [];
    if (!next.includes(key)) {
      next.push(key);
      window.sessionStorage.setItem(PURCHASE_DEDUPE_KEY, JSON.stringify(next.slice(-30)));
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

/**
 * Normalizes a Sutra product or cart line item into a GA4 / GTM & Meta Pixel item payload.
 * Guarantees `item_id` matches the exact Wix Store product UUID used in `/meta-catalog-feed.xml`,
 * `/meta-catalog-feed.csv`, and `/google-merchant-feed.tsv`.
 */
export function buildDataLayerItem(rawItem, overrideQuantity, overridePrice) {
  const source = rawItem?.product ? { ...rawItem.product, ...rawItem } : rawItem || {};

  const itemId = String(
    source._wixId ||
      source.wixId ||
      source.catalogItemId ||
      source.catalogReference?.catalogItemId ||
      source.productId ||
      source.id ||
      source.slug ||
      'unknown-item'
  ).trim();

  const itemName = String(
    source.name ||
      source.productName?.translated ||
      source.productName?.original ||
      'Producto SUTRA'
  ).trim();

  const itemBrand = String(
    source.brand ||
      source.item_brand ||
      'SUTRA México'
  ).trim();

  const itemCategory = String(
    source.category ||
      source.item_category ||
      'Velas y Rituales'
  ).trim();

  const unitPrice =
    overridePrice !== undefined && overridePrice !== null
      ? parsePriceValue(overridePrice)
      : parsePriceValue(
          source.priceNum ??
            source.unitPrice ??
            source.price?.amount ??
            source.price
        );

  const quantity = Math.max(
    1,
    Math.round(Number(overrideQuantity ?? source.quantity ?? 1) || 1)
  );

  return {
    item_id: itemId,
    item_name: itemName,
    item_brand: itemBrand,
    item_category: itemCategory,
    price: unitPrice,
    quantity,
    currency: 'MXN',
  };
}

export function pushEcommerceDataLayer(eventName, ecommercePayload, extraTopLevel = {}) {
  const dl = ensureDataLayer();
  if (!dl) return false;

  dl.push({ ecommerce: null });
  dl.push({
    event: eventName,
    ...extraTopLevel,
    ecommerce: ecommercePayload,
  });
  return true;
}

function fireNativeMetaPixelEvent(eventName, params) {
  if (typeof window === 'undefined') return false;

  if (
    typeof window.fbq === 'function' &&
    window._sutraMetaInitializedIds &&
    window._sutraMetaInitializedIds.size > 0
  ) {
    try {
      window.fbq('track', eventName, params);
      return true;
    } catch {
      return false;
    }
  }

  // On cold landing before /api/tracking-config resolves, queue the event so ViewContent isn't lost
  if (!window._sutraTrackingResolved) {
    window._sutraPendingMetaEvents = window._sutraPendingMetaEvents || [];
    if (window._sutraPendingMetaEvents.length < 20) {
      window._sutraPendingMetaEvents.push({ eventName, params });
    }
    return true;
  }

  return false;
}

export function flushPendingMetaPixelEvents() {
  if (
    typeof window === 'undefined' ||
    typeof window.fbq !== 'function' ||
    !window._sutraMetaInitializedIds ||
    window._sutraMetaInitializedIds.size === 0 ||
    !Array.isArray(window._sutraPendingMetaEvents) ||
    window._sutraPendingMetaEvents.length === 0
  ) {
    return 0;
  }

  const pending = window._sutraPendingMetaEvents.splice(0);
  let sent = 0;
  for (const ev of pending) {
    try {
      window.fbq('track', ev.eventName, ev.params);
      sent += 1;
    } catch {
      // ignore individual event errors
    }
  }
  return sent;
}

export function trackViewItem(product, unitPrice) {
  if (!product) return false;
  const item = buildDataLayerItem(product, 1, unitPrice);
  const contentIds = [item.item_id];

  fireNativeMetaPixelEvent('ViewContent', {
    content_ids: contentIds,
    contents: [{ id: item.item_id, quantity: 1, item_price: item.price }],
    content_name: item.item_name,
    content_category: item.item_category,
    content_type: 'product',
    value: item.price,
    currency: 'MXN',
  });

  return pushEcommerceDataLayer(
    'view_item',
    {
      currency: 'MXN',
      value: item.price,
      content_ids: contentIds,
      content_type: 'product',
      items: [item],
    },
    {
      content_ids: contentIds,
      content_type: 'product',
    }
  );
}

export function trackAddToCart(product, quantity = 1, unitPrice) {
  if (!product) return false;
  const item = buildDataLayerItem(product, quantity, unitPrice);
  const contentIds = [item.item_id];
  const value = roundPrice(item.price * item.quantity);

  fireNativeMetaPixelEvent('AddToCart', {
    content_ids: contentIds,
    contents: [{ id: item.item_id, quantity: item.quantity, item_price: item.price }],
    content_name: item.item_name,
    content_category: item.item_category,
    content_type: 'product',
    value,
    currency: 'MXN',
  });

  return pushEcommerceDataLayer(
    'add_to_cart',
    {
      currency: 'MXN',
      value,
      content_ids: contentIds,
      content_type: 'product',
      items: [item],
    },
    {
      content_ids: contentIds,
      content_type: 'product',
    }
  );
}

export function trackBeginCheckout(cartItems = [], totalValue, couponCode = '') {
  const items = (Array.isArray(cartItems) ? cartItems : [])
    .map((ci) => {
      const qty = Math.max(1, Number(ci.quantity || 1) || 1);
      return buildDataLayerItem(ci, qty, ci.priceNum ?? ci.unitPrice ?? ci.price);
    })
    .filter(Boolean);

  if (items.length === 0) return false;

  const fallbackValue = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const value = totalValue !== undefined ? parsePriceValue(totalValue) : roundPrice(fallbackValue);
  const contentIds = items.map((i) => i.item_id);

  fireNativeMetaPixelEvent('InitiateCheckout', {
    content_ids: contentIds,
    contents: items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    content_type: 'product',
    value,
    currency: 'MXN',
  });

  return pushEcommerceDataLayer(
    'begin_checkout',
    {
      currency: 'MXN',
      value,
      content_ids: contentIds,
      content_type: 'product',
      ...(couponCode ? { coupon: String(couponCode).trim() } : {}),
      items,
    },
    {
      content_ids: contentIds,
      content_type: 'product',
    }
  );
}

export function trackPurchase({
  transactionId,
  items = [],
  value,
  shipping = 0,
  coupon = '',
}) {
  const cleanTxId = String(transactionId || '').trim();
  if (!cleanTxId || hasTrackedPurchase(cleanTxId)) return false;

  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((it) => buildDataLayerItem(it, it.quantity || 1, it.priceNum ?? it.unitPrice ?? it.price))
    .filter(Boolean);

  const fallbackValue = normalizedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const resolvedValue =
    value !== undefined && Number(value) > 0
      ? parsePriceValue(value)
      : roundPrice(fallbackValue);

  if (normalizedItems.length === 0 && resolvedValue <= 0) return false;

  markPurchaseTracked(cleanTxId);

  const contentIds = normalizedItems.map((i) => i.item_id);

  fireNativeMetaPixelEvent('Purchase', {
    content_ids: contentIds,
    contents: normalizedItems.map((i) => ({
      id: i.item_id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: normalizedItems.reduce((sum, i) => sum + i.quantity, 0),
    content_type: 'product',
    value: resolvedValue,
    currency: 'MXN',
  });

  return pushEcommerceDataLayer(
    'purchase',
    {
      transaction_id: cleanTxId,
      currency: 'MXN',
      value: resolvedValue,
      shipping: parsePriceValue(shipping),
      content_ids: contentIds,
      content_type: 'product',
      ...(coupon ? { coupon: String(coupon).trim() } : {}),
      items: normalizedItems,
    },
    {
      transaction_id: cleanTxId,
      content_ids: contentIds,
      content_type: 'product',
    }
  );
}
