import { useEffect } from 'react';
import { SEO_DATA, SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../data/seoConfig';

function updateMetaTag(attribute, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonical(url) {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function updateJsonLd(schema) {
  const scriptId = 'sutra-jsonld-schema';
  let script = document.getElementById(scriptId);
  if (!schema) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

export default function SEO({
  pageKey,
  title: propTitle,
  description: propDesc,
  canonical: propCanonical,
  image: propImage,
  type: propType,
  schema: propSchema,
}) {
  const base = pageKey && SEO_DATA[pageKey] ? SEO_DATA[pageKey] : {};

  const finalTitle = propTitle || base.title || `${SITE_NAME} | Velas en Polvo y Rituales de Bienestar`;
  const finalDesc = propDesc || base.description || 'Descubre Sutra México: velas en polvo, velas de arena, aromas y rituales únicos.';
  const finalCanonical = propCanonical || base.canonical || SITE_URL;
  const finalImage = propImage || DEFAULT_OG_IMAGE;
  const finalType = propType || base.type || 'website';

  // Default Organization & WebSite schema if none provided
  const finalSchema = propSchema || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tienda?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  useEffect(() => {
    // 1. Title
    document.title = finalTitle;

    // 2. Standard Meta
    updateMetaTag('name', 'description', finalDesc);
    updateCanonical(finalCanonical);

    // 3. OpenGraph
    updateMetaTag('property', 'og:title', finalTitle);
    updateMetaTag('property', 'og:description', finalDesc);
    updateMetaTag('property', 'og:url', finalCanonical);
    updateMetaTag('property', 'og:type', finalType);
    updateMetaTag('property', 'og:site_name', SITE_NAME);
    updateMetaTag('property', 'og:image', finalImage);

    // 4. Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', finalTitle);
    updateMetaTag('name', 'twitter:description', finalDesc);
    updateMetaTag('name', 'twitter:image', finalImage);

    // 5. JSON-LD
    updateJsonLd(finalSchema);
  }, [finalTitle, finalDesc, finalCanonical, finalImage, finalType, finalSchema]);

  return null;
}
