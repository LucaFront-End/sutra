import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_TRACKING_CONFIG,
  TRACKING_CONFIG_EVENT,
  fetchPublicTrackingConfig,
  getCachedTrackingConfig,
  normalizeTrackingConfig,
} from '../services/trackingService';
import { flushPendingMetaPixelEvents } from '../services/dataLayerService';

const SLOT_ATTR = 'data-sutra-tracking-slot';

function extractPixelIdFallback(code = '') {
  const text = String(code || '');
  const initMatch = text.match(/fbq\(\s*['"]init['"]\s*,\s*['"](\d{8,24})['"]/i);
  if (initMatch?.[1]) return initMatch[1];
  const imgMatch = text.match(/facebook\.com\/tr\?id=(\d{8,24})/i);
  if (imgMatch?.[1]) return imgMatch[1];
  return '';
}

function clearInjectedSlot(slotName) {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll(`[${SLOT_ATTR}="${slotName}"]`);
  existing.forEach((el) => el.remove());
}

function injectHtmlSlot(slotName, rawCode, container) {
  clearInjectedSlot(slotName);
  if (!container || typeof document === 'undefined') return;

  const trimmed = String(rawCode || '').trim();
  if (!trimmed) return;

  // Guard against bare JavaScript pasted without <script> tags
  const hasHtmlTags = /<\s*[a-zA-Z!/]/.test(trimmed);
  if (!hasHtmlTags) {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute(SLOT_ATTR, slotName);
    scriptEl.textContent = trimmed;
    container.appendChild(scriptEl);
    return;
  }

  const template = document.createElement('template');
  template.innerHTML = trimmed;
  const nodes = Array.from(template.content.childNodes);

  for (const node of nodes) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    if (node.tagName === 'SCRIPT') {
      const scriptEl = document.createElement('script');
      for (const attr of Array.from(node.attributes)) {
        scriptEl.setAttribute(attr.name, attr.value);
      }
      scriptEl.setAttribute(SLOT_ATTR, slotName);
      if (node.textContent) {
        scriptEl.textContent = node.textContent;
      }
      container.appendChild(scriptEl);
    } else {
      const cloned = node.cloneNode(true);
      if (typeof cloned.setAttribute === 'function') {
        cloned.setAttribute(SLOT_ATTR, slotName);
      }
      // Execute any nested <script> tags inside wrapper elements if present
      const nestedScripts =
        typeof cloned.querySelectorAll === 'function'
          ? Array.from(cloned.querySelectorAll('script'))
          : [];
      for (const oldScript of nestedScripts) {
        const freshScript = document.createElement('script');
        for (const attr of Array.from(oldScript.attributes)) {
          freshScript.setAttribute(attr.name, attr.value);
        }
        freshScript.textContent = oldScript.textContent || '';
        oldScript.replaceWith(freshScript);
      }
      container.appendChild(cloned);
    }
  }
}

function ensureMetaPixelRuntime(pixelId) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !pixelId) {
    return;
  }

  if (typeof window.fbq !== 'function') {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      t.setAttribute(SLOT_ATTR, 'meta-fbevents');
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
  }

  if (!window._sutraMetaInitializedIds) {
    window._sutraMetaInitializedIds = new Set();
  }

  if (!window._sutraMetaInitializedIds.has(pixelId)) {
    window.fbq('init', pixelId);
    window._sutraMetaInitializedIds.add(pixelId);
  }

  clearInjectedSlot('meta-noscript');
  const noscript = document.createElement('noscript');
  noscript.setAttribute(SLOT_ATTR, 'meta-noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.alt = '';
  img.src = `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

export default function TrackingScriptsManager() {
  const { pathname, search } = useLocation();
  const [config, setConfig] = useState(() => {
    const cached = getCachedTrackingConfig();
    return cached || { ...DEFAULT_TRACKING_CONFIG };
  });
  const lastTrackedPathRef = useRef('');
  const lastAppliedSlotsRef = useRef({
    metaCustom: null,
    customHead: null,
    customBody: null,
  });

  useEffect(() => {
    let active = true;
    fetchPublicTrackingConfig().then((res) => {
      if (typeof window !== 'undefined') {
        window._sutraTrackingResolved = true;
      }
      if (!active || !res?.config) return;
      const next = normalizeTrackingConfig(res.config);
      const effectivePixel = next.metaPixelId || extractPixelIdFallback(next.metaCustomCode);
      if (!next.metaEnabled || !effectivePixel) {
        if (typeof window !== 'undefined') {
          window._sutraPendingMetaEvents = [];
        }
      }
      setConfig((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    });

    const handleUpdated = (event) => {
      if (event?.detail) {
        if (typeof window !== 'undefined') {
          window._sutraTrackingResolved = true;
        }
        const next = normalizeTrackingConfig(event.detail);
        setConfig(next);
        lastTrackedPathRef.current = '';
      }
    };

    window.addEventListener(TRACKING_CONFIG_EVENT, handleUpdated);
    return () => {
      active = false;
      window.removeEventListener(TRACKING_CONFIG_EVENT, handleUpdated);
    };
  }, []);

  const effectivePixelId =
    config.metaPixelId || extractPixelIdFallback(config.metaCustomCode);

  // Inject Meta Pixel + Meta extra snippet + Custom Head & Body snippets when config changes
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    if (config.metaEnabled && effectivePixelId) {
      ensureMetaPixelRuntime(effectivePixelId);
      // Fire PageView before flushing any queued ViewContent/AddToCart events from cold load
      const currentRouteKey = `${effectivePixelId}::${pathname}${search}`;
      if (lastTrackedPathRef.current !== currentRouteKey && typeof window.fbq === 'function') {
        lastTrackedPathRef.current = currentRouteKey;
        window.fbq('track', 'PageView');
      }
      flushPendingMetaPixelEvents();
    } else {
      clearInjectedSlot('meta-noscript');
    }

    const desiredMetaCustom =
      config.metaEnabled && config.metaCustomCode ? config.metaCustomCode.trim() : '';
    if (lastAppliedSlotsRef.current.metaCustom !== desiredMetaCustom) {
      lastAppliedSlotsRef.current.metaCustom = desiredMetaCustom;
      if (desiredMetaCustom) {
        injectHtmlSlot('meta-custom', desiredMetaCustom, document.head);
      } else {
        clearInjectedSlot('meta-custom');
      }
    }

    const desiredCustomHead =
      config.customEnabled && config.customHeadCode ? config.customHeadCode.trim() : '';
    if (lastAppliedSlotsRef.current.customHead !== desiredCustomHead) {
      lastAppliedSlotsRef.current.customHead = desiredCustomHead;
      if (desiredCustomHead) {
        injectHtmlSlot('custom-head', desiredCustomHead, document.head);
      } else {
        clearInjectedSlot('custom-head');
      }
    }

    const desiredCustomBody =
      config.customEnabled && config.customBodyCode ? config.customBodyCode.trim() : '';
    if (lastAppliedSlotsRef.current.customBody !== desiredCustomBody) {
      lastAppliedSlotsRef.current.customBody = desiredCustomBody;
      if (desiredCustomBody) {
        injectHtmlSlot('custom-body', desiredCustomBody, document.body);
      } else {
        clearInjectedSlot('custom-body');
      }
    }

    return undefined;
  }, [
    config.metaEnabled,
    effectivePixelId,
    config.metaCustomCode,
    config.customEnabled,
    config.customHeadCode,
    config.customBodyCode,
  ]);

  // Trigger Meta Pixel PageView on initial mount and SPA route changes
  useEffect(() => {
    if (!config.metaEnabled || !effectivePixelId) return;
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

    const currentRouteKey = `${effectivePixelId}::${pathname}${search}`;
    if (lastTrackedPathRef.current === currentRouteKey) return;

    lastTrackedPathRef.current = currentRouteKey;
    window.fbq('track', 'PageView');
  }, [config.metaEnabled, effectivePixelId, pathname, search]);

  return null;
}
