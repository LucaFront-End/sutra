import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWixProducts } from '../hooks/useWixProducts';
import ceraBlancaImg from '../assets/images/cera-blanca.jpg';
import ceraNegraImg from '../assets/images/cera-negra.jpg';
import { KNOWN_SUBSCRIPTION_OPTIONS } from '../lib/wixClient';
import SEO from '../components/SEO';
import './MysteryBox.css';

const WIX_DEFAULT_MEDIA = [
  'https://static.wixstatic.com/media/45119e_0103574325954391bd4cda1a23be17dd~mv2.png',
  'https://static.wixstatic.com/media/45119e_6f31282f3a9b421dad79be68ffeb1a4b~mv2.png',
];

// ─── Helpers for 100% Dynamic Wix Stores Data Extraction ───────────────────────

/**
 * Extracts a concise tier name from full Wix product title.
 * e.g. "MisteryBox Ritual Completo | Velas Flotantes..." -> "Ritual Completo"
 */
function getTierName(product, fallback = 'Ritual') {
  if (!product?.name) return fallback;
  const mainPart = product.name.split('|')[0].trim();
  const cleaned = mainPart.replace(/^(misterybox|mystery\s*box)\s*/i, '').trim();
  return cleaned || mainPart || fallback;
}

/**
 * Dynamically resolves savings from Wix discount prices or parsed description.
 * Automatically adapts if client changes prices or description in Wix dashboard.
 */
function getSavingsBadge(product, defaultSavings = 'Ahorro Especial') {
  if (!product) return defaultSavings;
  if (product.originalPriceNum && product.priceNum && product.originalPriceNum > product.priceNum) {
    const diff = Math.round(product.originalPriceNum - product.priceNum);
    return `Ahorro $${diff.toLocaleString()} MXN`;
  }
  const fullText = `${product.description || ''} ${product.descriptionHtml || ''}`;
  const match = fullText.match(/ahorr[ao]\s*(\$[\d,]+(?:\s*mxn)?)/i);
  if (match) {
    return `Ahorro ${match[1].toUpperCase()}`;
  }
  return defaultSavings;
}

/**
 * Dynamically derives intro description from Wix product data.
 */
function getProductIntro(product, fallback = '') {
  if (!product) return fallback;
  if (product.shortDesc && product.shortDesc.length > 25) {
    return product.shortDesc;
  }
  const clean = product.description || '';
  const paragraphs = clean.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
  for (const para of paragraphs) {
    if (para.length > 30 && !para.toLowerCase().startsWith('precio') && !para.toLowerCase().includes('ahorra') && !para.toLowerCase().startsWith('valor')) {
      const sentence = para.split(/[.!?]/)[0].trim();
      return sentence ? `${sentence}.` : para;
    }
  }
  return fallback;
}

/**
 * Dynamically extracts bullet items ("¿Qué incluye?") directly from Wix description HTML or text.
 * When client edits bullet items in Wix Stores, they reflect immediately here.
 */
function extractIncludedItems(product, fallback = []) {
  if (!product) return fallback;
  const html = product.descriptionHtml || product.description || '';

  // 1. Try to extract from <li> tags
  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length > 0) {
    const extracted = liMatches.map(m => {
      return m[1]
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&#39;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, ' ')
        .replace(/^[✓•\-\*\+]\s*/, '')
        .trim();
    }).filter(t => t.length > 3 && !t.toLowerCase().startsWith('http'));

    if (extracted.length > 0) {
      return extracted;
    }
  }

  // 2. Try to extract from lines starting with bullets or symbols
  const text = product.description || '';
  const lines = text.split(/[\n\r]+/g)
    .map(line => line.replace(/^[✓•\-\*\+]\s*/, '').trim())
    .filter(line => line.length > 8 && !line.toLowerCase().startsWith('http') && !line.toLowerCase().startsWith('precio') && !line.toLowerCase().startsWith('valor'));

  if (lines.length >= 2) {
    return lines;
  }

  return fallback;
}

/**
 * Resolves color dot background for dynamic color choices.
 */
function getColorHex(value, defaultHex = '#D4A76A') {
  if (!value) return defaultHex;
  const lower = String(value).toLowerCase();
  if (lower.includes('blanco') || lower.includes('white') || lower.includes('nieve') || lower.includes('claro')) return '#FAF7F2';
  if (lower.includes('negro') || lower.includes('black') || lower.includes('carbon') || lower.includes('carbón') || lower.includes('oscuro')) return '#1C1917';
  if (lower.includes('dorado') || lower.includes('gold') || lower.includes('oro')) return '#D4A76A';
  if (lower.includes('arena') || lower.includes('sand') || lower.includes('beige')) return '#E8DFC8';
  if (lower.includes('terracota') || lower.includes('clay') || lower.includes('barro')) return '#C27856';
  if (lower.includes('rosa') || lower.includes('rose')) return '#E8B4B8';
  if (lower.includes('verde') || lower.includes('green') || lower.includes('oliva')) return '#7B8A6E';
  if (lower.includes('gris') || lower.includes('grey') || lower.includes('gray')) return '#9E9E9E';
  return defaultHex;
}

export default function MysteryBox({ onNavigate }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { products: wixProducts, loading: wixLoading } = useWixProducts();

  const [activeCompletoImg, setActiveCompletoImg] = useState(0);
  const [activeEsencialImg, setActiveEsencialImg] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    completo: { 'Color:': 'Blanco' },
    esencial: { 'Color:': 'Blanco' },
  });
  const [addedPlanId, setAddedPlanId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Dynamically resolve real products from Wix Stores
  const wixCompleto = useMemo(() => {
    return (wixProducts || []).find(
      (p) => p._wixId === 'a9a00ce4-e102-4b47-8f45-da29e2579106' ||
             p.slug === 'misterybox-ritual-completo-velas-flotantes-y-velas-de-arena' ||
             (p.category === 'suscripciones' && (p.slug?.includes('completo') || p.name?.toLowerCase().includes('completo')))
    );
  }, [wixProducts]);

  const wixEsencial = useMemo(() => {
    return (wixProducts || []).find(
      (p) => p._wixId === '6f22920a-ad94-43ca-baf5-4853d9d6dfd5' ||
             p.slug === 'misterybox-esencial' ||
             (p.category === 'suscripciones' && (p.slug?.includes('esencial') || p.name?.toLowerCase().includes('esencial')))
    );
  }, [wixProducts]);

  // Synchronize dynamic default choices from Wix products when loaded
  useEffect(() => {
    if (wixCompleto?.options?.length) {
      setSelectedOptions((prev) => {
        const initial = { ...prev.completo };
        wixCompleto.options.forEach((opt) => {
          if (!initial[opt.label]) {
            const defaultChoice = opt.choices?.find((c) => c.isDefault) || opt.choices?.[0];
            if (defaultChoice) initial[opt.label] = defaultChoice.value || defaultChoice.label;
          }
        });
        return { ...prev, completo: initial };
      });
    }
  }, [wixCompleto]);

  useEffect(() => {
    if (wixEsencial?.options?.length) {
      setSelectedOptions((prev) => {
        const initial = { ...prev.esencial };
        wixEsencial.options.forEach((opt) => {
          if (!initial[opt.label]) {
            const defaultChoice = opt.choices?.find((c) => c.isDefault) || opt.choices?.[0];
            if (defaultChoice) initial[opt.label] = defaultChoice.value || defaultChoice.label;
          }
        });
        return { ...prev, esencial: initial };
      });
    }
  }, [wixEsencial]);

  const filterUnique = (arr) => Array.from(new Set(arr.filter(Boolean)));

  const wixCompletoImgs = (wixCompleto?.images || []).map((img) =>
    typeof img === 'string' ? img : img?.src || img?.url
  );
  const wixEsencialImgs = (wixEsencial?.images || []).map((img) =>
    typeof img === 'string' ? img : img?.src || img?.url
  );

  // Dynamic Wix galleries
  const completoGallery = filterUnique(
    wixCompletoImgs.length > 0 ? wixCompletoImgs : WIX_DEFAULT_MEDIA
  );
  const esencialGallery = filterUnique(
    wixEsencialImgs.length > 0 ? wixEsencialImgs : WIX_DEFAULT_MEDIA
  );

  const defaultWixOptions = [
    {
      id: 'color:',
      label: 'Color:',
      type: 'color',
      choices: [
        { label: 'Blanco', value: 'Blanco', hex: '#FAF7F2', isDefault: true, img: WIX_DEFAULT_MEDIA[0] },
        { label: 'Negro', value: 'Negro', hex: '#1C1917', isDefault: false, img: WIX_DEFAULT_MEDIA[1] },
      ],
    },
  ];

  // 100% Dynamic Plans built directly from live Wix Stores catalog
  const plans = {
    completo: {
      id: wixCompleto?._wixId || 'a9a00ce4-e102-4b47-8f45-da29e2579106',
      _wixId: wixCompleto?._wixId || 'a9a00ce4-e102-4b47-8f45-da29e2579106',
      subscriptionOptionId: wixCompleto?.subscriptionOptionId || KNOWN_SUBSCRIPTION_OPTIONS['a9a00ce4-e102-4b47-8f45-da29e2579106'],
      slug: wixCompleto?.slug || 'misterybox-ritual-completo-velas-flotantes-y-velas-de-arena',
      isWixProduct: true,
      name: wixCompleto?.name || 'MisteryBox Ritual Completo | Velas Flotantes y Velas de Arena',
      tierName: getTierName(wixCompleto, 'Ritual Completo'),
      tag: wixCompleto?.ribbon || 'EXPERIENCIA COMPLETA',
      badge: 'BIMESTRAL',
      price: wixCompleto?.price || '$1,590 MXN',
      priceNum: wixCompleto?.priceNum || 1590,
      period: 'cada 2 meses',
      savings: getSavingsBadge(wixCompleto, 'Ahorro $600 MXN'),
      desc: getProductIntro(wixCompleto, 'Vasija de cerámica artesanal y curación botánica estacional completa.'),
      img: completoGallery[activeCompletoImg] || completoGallery[0],
      gallery: completoGallery,
      wixVariants: wixCompleto?.wixVariants || [],
      options: wixCompleto?.options?.length ? wixCompleto.options : defaultWixOptions,
      items: extractIncludedItems(wixCompleto, [
        '500g cera en arena botánica pura',
        'Vasija artesanal de cerámica exclusiva',
        '2 Aromas botánicos sorpresa estacionales',
        'Botella de cerillos largos + 5 mechas',
        'Carta ritual y guía de meditación',
      ]),
    },
    esencial: {
      id: wixEsencial?._wixId || '6f22920a-ad94-43ca-baf5-4853d9d6dfd5',
      _wixId: wixEsencial?._wixId || '6f22920a-ad94-43ca-baf5-4853d9d6dfd5',
      subscriptionOptionId: wixEsencial?.subscriptionOptionId || KNOWN_SUBSCRIPTION_OPTIONS['6f22920a-ad94-43ca-baf5-4853d9d6dfd5'],
      slug: wixEsencial?.slug || 'misterybox-esencial',
      isWixProduct: true,
      name: wixEsencial?.name || 'MisteryBox Esencial | Velas Flotantes y Velas de Arena',
      tierName: getTierName(wixEsencial, 'Ritual Esencial'),
      tag: wixEsencial?.ribbon || 'RECARGA',
      badge: 'BIMESTRAL',
      price: wixEsencial?.price || '$690 MXN',
      priceNum: wixEsencial?.priceNum || 690,
      period: 'cada 2 meses',
      savings: getSavingsBadge(wixEsencial, 'Ahorro $360 MXN'),
      desc: getProductIntro(wixEsencial, 'Recarga periódica de cera y aromas para acompañar tus recipientes.'),
      img: esencialGallery[activeEsencialImg] || esencialGallery[0],
      gallery: esencialGallery,
      wixVariants: wixEsencial?.wixVariants || [],
      options: wixEsencial?.options?.length ? wixEsencial.options : defaultWixOptions,
      items: extractIncludedItems(wixEsencial, [
        '500g cera en arena botánica pura',
        '2 Aromas botánicos sorpresa estacionales',
        'Botella de cerillos largos + 5 mechas',
        'Carta ritual y guía de meditación',
        'Sin vasija · Recarga tus recipientes',
      ]),
    },
  };

  const handleGoToProduct = (plan) => {
    if (onNavigate) {
      onNavigate('product', plan);
    } else {
      navigate(`/producto/${plan.slug}`);
    }
  };

  const handleOptionChoice = (planKey, optLabel, choice) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        [optLabel]: choice.value || choice.label,
      },
    }));

    // If choice has an image, switch gallery active image
    const plan = plans[planKey];
    if (choice.img && plan?.gallery?.length) {
      const imgIdx = plan.gallery.findIndex((g) => g === choice.img || (typeof g === 'string' && g.includes(choice.img.split('/').pop())));
      if (imgIdx >= 0) {
        if (planKey === 'completo') setActiveCompletoImg(imgIdx);
        else setActiveEsencialImg(imgIdx);
      }
    } else if (plan?.wixVariants?.length) {
      // Find variant media matching this choice
      const matched = plan.wixVariants.find((v) => {
        const c = v.choices || {};
        return c[optLabel] === choice.value || Object.values(c).includes(choice.value);
      });
      const varImg = matched?.media?.mainMedia?.image?.url || matched?.image?.url;
      if (varImg) {
        const imgIdx = plan.gallery.findIndex((g) => g === varImg || (typeof g === 'string' && g.includes(varImg.split('/').pop())));
        if (imgIdx >= 0) {
          if (planKey === 'completo') setActiveCompletoImg(imgIdx);
          else setActiveEsencialImg(imgIdx);
        }
      }
    }
  };

  const handleSubscribe = (planKey) => {
    const plan = plans[planKey];
    const wixRef = planKey === 'completo' ? wixCompleto : wixEsencial;
    const currentOpts = selectedOptions[planKey] || {};

    // Match Wix variantId if available
    const matchedWixVariant = (plan.wixVariants || []).find((v) => {
      const choices = v.choices || {};
      return Object.entries(currentOpts).every(([optName, optVal]) => {
        return choices[optName] === optVal || Object.values(choices).some((val) => String(val).toLowerCase() === String(optVal).toLowerCase());
      });
    });

    const optSummary = Object.entries(currentOpts)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ') || 'Plan bimestral';

    const itemToAdd = {
      ...(wixRef || {}),
      id: plan.id,
      _wixId: plan._wixId,
      slug: plan.slug,
      subscriptionOptionId: plan.subscriptionOptionId,
      isWixProduct: true,
      name: plan.name,
      price: plan.price,
      priceNum: plan.priceNum,
      category: 'suscripciones',
      img: plan.img,
      variantId: matchedWixVariant?._id || matchedWixVariant?.id || undefined,
      selectedOptions: currentOpts,
      selectedVariant: `${optSummary} | Entrega bimestral`,
      wixVariants: plan.wixVariants,
      options: plan.options,
      subscription: {
        frequency: 'Cada 2 meses',
        tier: plan.name,
        type: optSummary,
        subscriptionOptionId: plan.subscriptionOptionId,
      },
    };

    addToCart(itemToAdd, 1, itemToAdd.selectedVariant);
    setAddedPlanId(plan.id);
    setIsCartOpen(true);

    setTimeout(() => {
      setAddedPlanId(null);
    }, 2500);
  };

  const faqs = [
    {
      q: '¿Con qué frecuencia recibiré mi Mystery Box de Sutra?',
      a: 'Tu caja se envía puntualmente cada 2 meses (cada 60 días). Recibirás una notificación por correo y WhatsApp unos días antes de cada envío con los detalles del despacho.',
    },
    {
      q: '¿Qué diferencia hay entre el Ritual Completo y el Ritual Esencial?',
      a: 'El Ritual Completo incluye además una vasija artesanal de cerámica exclusiva modelada a mano (ideal para iniciar o coleccionar vasijas). El Ritual Esencial incluye la cera de arena, 2 aromas y 5 mechas de 15 cm, pensado para quienes ya tienen su vasija preferida en casa.',
    },
    {
      q: '¿Puedo pausar, adelantar o cancelar mi suscripción en cualquier momento?',
      a: 'Sí, tienes control absoluto. Puedes pausar tu suscripción temporalmente (por ejemplo, si estás de viaje) o cancelarla sin penalizaciones ni plazos forzosos desde tu panel de usuario o escribiéndonos a nuestro WhatsApp Concierge.',
    },
    {
      q: '¿Los aromas son siempre los mismos o van cambiando?',
      a: '¡Van cambiando! Cada entrega bimestral presenta formulaciones aromáticas estacionales diseñadas para acompañar el ritmo del año (notas cítricas y herbales en primavera/verano, o amaderadas y resinosas en otoño/invierno).',
    },
    {
      q: '¿El envío está incluido en el precio de la suscripción?',
      a: 'Sí. Todos los envíos de la Mystery Box cuentan con entrega asegurada sin costo adicional a cualquier código postal de la República Mexicana.',
    },
  ];

  return (
    <div className="mystery-page fade-in">
      <SEO pageKey="mysterybox" />

      {/* Breadcrumb Navigation */}
      <div className="mystery-nav container">
        <div className="mystery-breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Mystery Box Bimestral</span>
        </div>
        <Link to="/tienda" className="mystery-back-link">
          ← Explorar toda la tienda
        </Link>
      </div>

      {/* Hero Header */}
      <section className="mystery-hero container">
        <div className="mystery-hero__grid">
          <div className="mystery-hero__copy">
            <span className="mystery-eyebrow">✦ EXPERIENCIA DE SUSCRIPCIÓN BIMESTRAL</span>
            <h1 className="mystery-title">Sutra Mystery Box</h1>
            <p className="mystery-lead">
              Un santuario sensorial que se renueva cada 2 meses en la puerta de tu hogar. 
              Recibe piezas sagradas, curaciones aromáticas de temporada y recargas de cera de arena 
              para que tu pausa de bienestar nunca se apague.
            </p>

            <div className="mystery-hero__highlights">
              <div className="mystery-pill">
                <span className="pill-dot">📦</span>
                <span>Entrega cada 60 días</span>
              </div>
              <div className="mystery-pill">
                <span className="pill-dot">✨</span>
                <span>Envíos gratis a todo México</span>
              </div>
              <div className="mystery-pill">
                <span className="pill-dot">🕊️</span>
                <span>Cancela o pausa cuando quieras</span>
              </div>
            </div>

            <div className="mystery-hero__cta-group">
              <a href="#planes" className="btn btn--gold">
                Ver los 2 Planes de Suscripción ↓
              </a>
              <span className="mystery-hero__guarantee">
                ✓ Sin plazos forzosos · Garantía de satisfacción
              </span>
            </div>
          </div>

          <div className="mystery-hero__visual">
            <div className="mystery-hero__frame">
              <img 
                src={plans.completo.gallery[0]} 
                alt={plans.completo.name} 
                className="mystery-hero__img" 
              />
              <div className="mystery-badge-float">
                <span className="badge-spark">✦</span>
                <div>
                  <strong>{plans.completo.name}</strong>
                  <small>{plans.completo.price} · {plans.completo.period}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="mystery-plans-section" id="planes">
        <div className="container">
          <div className="mystery-section-header">
            <span className="section-eyebrow">ELIGE TU MODALIDAD</span>
            <h2 className="section-title">2 Opciones para acompañar tu día a día</h2>
            <p className="section-subtitle">
              Ambos planes están vinculados directamente a nuestro catálogo oficial de Wix con entrega bimestral.
            </p>
          </div>

          {/* Plan Cards Split Showcase */}
          <div className="mystery-split-showcase">
            {/* TIER 1: RITUAL COMPLETO */}
            <div className="mystery-split-card mystery-split-card--featured">
              {/* Plan Badge */}
              <div className="split-card__badge">
                {plans.completo.tag}
              </div>

              {/* Interactive Gallery Area */}
              <div className="split-card__gallery">
                <Link
                  to={`/producto/${plans.completo.slug}`}
                  className="split-card__main-frame split-card__main-frame--link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoToProduct(plans.completo);
                  }}
                  title={`Ver detalles de ${plans.completo.name}`}
                >
                  <img 
                    src={plans.completo.gallery[activeCompletoImg] || plans.completo.gallery[0]} 
                    alt={plans.completo.name}
                    className="split-card__main-img" 
                  />
                  <span className="split-card__tier-tag">✦ Con Vasija de Cerámica</span>
                </Link>
                {/* Thumbnails */}
                {plans.completo.gallery.length > 1 && (
                  <div className="split-card__thumbs">
                    {plans.completo.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`split-card__thumb-btn ${activeCompletoImg === idx ? 'is-active' : ''}`}
                        onClick={() => setActiveCompletoImg(idx)}
                        aria-label={`Ver foto ${idx + 1} de ${plans.completo.name}`}
                      >
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="split-card__body">
                <div className="split-card__header">
                  <div className="split-card__title-row">
                    <h3 className="split-card__title">
                      <Link
                        to={`/producto/${plans.completo.slug}`}
                        className="split-card__title-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleGoToProduct(plans.completo);
                        }}
                      >
                        {plans.completo.name}
                      </Link>
                    </h3>
                    <span className="savings-badge">{plans.completo.savings}</span>
                  </div>
                  <div className="split-card__price-row">
                    <span className="split-card__price">{plans.completo.price}</span>
                    <span className="split-card__period">/ {plans.completo.period}</span>
                  </div>
                  <p className="split-card__desc">{plans.completo.desc}</p>
                </div>

                {/* Dynamic Wix Options (e.g. Color) */}
                {plans.completo.options?.map((opt) => {
                  const currentVal = selectedOptions.completo[opt.label] || opt.choices?.[0]?.value || opt.choices?.[0]?.label;
                  return (
                    <div key={opt.id || opt.label} className="split-card__color-selector">
                      <span className="split-card__color-label">
                        {opt.label} <strong>{currentVal}</strong>
                      </span>
                      <div className="split-card__color-pills">
                        {opt.choices?.map((choice) => {
                          const val = choice.value || choice.label;
                          const isSelected = currentVal === val;
                          const hex = choice.hex || getColorHex(val);
                          return (
                            <button
                              key={val}
                              type="button"
                              className={`split-card__color-btn ${isSelected ? 'is-active' : ''}`}
                              onClick={() => handleOptionChoice('completo', opt.label, choice)}
                              title={choice.label || val}
                            >
                              <span
                                className="split-card__color-dot"
                                style={{ background: hex }}
                              />
                              {choice.label || val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Dynamic Wix Items List */}
                <ul className="mystery-clean-list">
                  {plans.completo.items.map((item, idx) => (
                    <li key={idx} className="clean-list-item">
                      <span className="clean-item-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Action CTA pinned to bottom */}
                <div className="split-card__cta-block">
                  <button
                    type="button"
                    className={`btn mystery-action-btn ${addedPlanId === plans.completo.id ? 'btn--added' : 'btn--gold'}`}
                    onClick={() => handleSubscribe('completo')}
                    id="btn-sub-completo"
                  >
                    {addedPlanId === plans.completo.id ? (
                      <>
                        <span>✓</span>
                        <span>¡Agregado a la Bolsa!</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        <span>Suscribirme al {plans.completo.tierName}</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/producto/${plans.completo.slug}`}
                    className="split-card__product-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGoToProduct(plans.completo);
                    }}
                  >
                    Ver ficha completa del producto →
                  </Link>

                  <p className="mystery-card__footnote">
                    Envío gratis a todo México · Sin plazos forzosos
                  </p>
                </div>
              </div>
            </div>

            {/* TIER 2: RITUAL ESENCIAL */}
            <div className="mystery-split-card">
              {/* Plan Badge */}
              <div className="split-card__badge split-card__badge--muted">
                {plans.esencial.tag}
              </div>

              {/* Interactive Gallery Area */}
              <div className="split-card__gallery">
                <Link
                  to={`/producto/${plans.esencial.slug}`}
                  className="split-card__main-frame split-card__main-frame--link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoToProduct(plans.esencial);
                  }}
                  title={`Ver detalles de ${plans.esencial.name}`}
                >
                  <img 
                    src={plans.esencial.gallery[activeEsencialImg] || plans.esencial.gallery[0]} 
                    alt={plans.esencial.name}
                    className="split-card__main-img" 
                  />
                  <span className="split-card__tier-tag">✦ Kit Recarga (Sin Vasija)</span>
                </Link>
                {/* Thumbnails */}
                {plans.esencial.gallery.length > 1 && (
                  <div className="split-card__thumbs">
                    {plans.esencial.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`split-card__thumb-btn ${activeEsencialImg === idx ? 'is-active' : ''}`}
                        onClick={() => setActiveEsencialImg(idx)}
                        aria-label={`Ver foto ${idx + 1} de ${plans.esencial.name}`}
                      >
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="split-card__body">
                <div className="split-card__header">
                  <div className="split-card__title-row">
                    <h3 className="split-card__title">
                      <Link
                        to={`/producto/${plans.esencial.slug}`}
                        className="split-card__title-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleGoToProduct(plans.esencial);
                        }}
                      >
                        {plans.esencial.name}
                      </Link>
                    </h3>
                    <span className="savings-badge">{plans.esencial.savings}</span>
                  </div>
                  <div className="split-card__price-row">
                    <span className="split-card__price">{plans.esencial.price}</span>
                    <span className="split-card__period">/ {plans.esencial.period}</span>
                  </div>
                  <p className="split-card__desc">{plans.esencial.desc}</p>
                </div>

                {/* Dynamic Wix Options (e.g. Color) */}
                {plans.esencial.options?.map((opt) => {
                  const currentVal = selectedOptions.esencial[opt.label] || opt.choices?.[0]?.value || opt.choices?.[0]?.label;
                  return (
                    <div key={opt.id || opt.label} className="split-card__color-selector">
                      <span className="split-card__color-label">
                        {opt.label} <strong>{currentVal}</strong>
                      </span>
                      <div className="split-card__color-pills">
                        {opt.choices?.map((choice) => {
                          const val = choice.value || choice.label;
                          const isSelected = currentVal === val;
                          const hex = choice.hex || getColorHex(val);
                          return (
                            <button
                              key={val}
                              type="button"
                              className={`split-card__color-btn ${isSelected ? 'is-active' : ''}`}
                              onClick={() => handleOptionChoice('esencial', opt.label, choice)}
                              title={choice.label || val}
                            >
                              <span
                                className="split-card__color-dot"
                                style={{ background: hex }}
                              />
                              {choice.label || val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Dynamic Wix Items List */}
                <ul className="mystery-clean-list">
                  {plans.esencial.items.map((item, idx) => (
                    <li key={idx} className={`clean-list-item ${idx === plans.esencial.items.length - 1 ? 'clean-list-item--muted' : ''}`}>
                      <span className="clean-item-check">{idx === plans.esencial.items.length - 1 ? '✦' : '✓'}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Action CTA pinned to bottom */}
                <div className="split-card__cta-block">
                  <button
                    type="button"
                    className={`btn mystery-action-btn ${addedPlanId === plans.esencial.id ? 'btn--added' : 'btn--gold'}`}
                    onClick={() => handleSubscribe('esencial')}
                    id="btn-sub-esencial"
                  >
                    {addedPlanId === plans.esencial.id ? (
                      <>
                        <span>✓</span>
                        <span>¡Agregado a la Bolsa!</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        <span>Suscribirme al {plans.esencial.tierName}</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/producto/${plans.esencial.slug}`}
                    className="split-card__product-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGoToProduct(plans.esencial);
                    }}
                  >
                    Ver ficha completa del producto →
                  </Link>

                  <p className="mystery-card__footnote">
                    Envío gratis a todo México · Sin plazos forzosos
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="mystery-how-section container">
        <div className="mystery-section-header">
          <span className="section-eyebrow">EL PROCESO</span>
          <h2 className="section-title">¿Cómo funciona tu suscripción?</h2>
          <p className="section-subtitle">
            Diseñamos un sistema sin fricciones, sin llamadas engorrosas y con máxima libertad.
          </p>
        </div>

        <div className="mystery-steps-grid">
          <div className="mystery-step-card">
            <span className="step-num">01</span>
            <h3 className="step-title">Elige tu Ritual</h3>
            <p className="step-desc">
              Selecciona el <strong>{plans.completo.tierName}</strong> si quieres recibir una vasija artesanal nueva o el <strong>{plans.esencial.tierName}</strong> si prefieres recargar tus recipientes.
            </p>
          </div>

          <div className="mystery-step-card">
            <span className="step-num">02</span>
            <h3 className="step-title">Desempaque cada 60 días</h3>
            <p className="step-desc">
              Cada 2 meses llega a tu puerta tu Mystery Box con cera de arena fresca, 2 aromas botánicos de estación y mechas de 15 cm listas para usar.
            </p>
          </div>

          <div className="mystery-step-card">
            <span className="step-num">03</span>
            <h3 className="step-title">Pausa o cancela libremente</h3>
            <p className="step-desc">
              ¿Vas a salir de viaje o tienes cera acumulada? Salta una entrega, cambia de dirección o cancela en cualquier momento con un clic en tu cuenta.
            </p>
          </div>
        </div>
      </section>

      {/* Unboxing Sensory Experience Gallery */}
      <section className="mystery-sensory-section container">
        <div className="mystery-sensory-card">
          <div className="sensory-content">
            <span className="sensory-eyebrow">LA EXPERIENCIA DEL DESEMPAQUE</span>
            <h2 className="sensory-title">El placer de inaugurar un nuevo ciclo cada 2 meses</h2>
            <p className="sensory-text">
              Abrir tu Mystery Box Sutra es en sí mismo una ceremonia. Cada caja llega sellada con papel de seda, notas aromáticas envolventes que escapan al levantar la tapa y materiales 100% compostables y reutilizables.
            </p>
            <div className="sensory-perks">
              <div className="sensory-perk">
                <strong>🕯️ Cera Perlada Vegetal</strong>
                <span>Cero hollín, combustión limpia y reutilización infinita sin residuos de cera vieja.</span>
              </div>
              <div className="sensory-perk">
                <strong>🌿 Aromas de Autor</strong>
                <span>Aceites esenciales y destilados botánicos puros que purifican la atmósfera.</span>
              </div>
              <div className="sensory-perk">
                <strong>🏺 Alfarería de Origen</strong>
                <span>Vasijas modeladas en tornos manuales, horneadas a 1,280°C con texturas minerales.</span>
              </div>
            </div>
          </div>

          <div className="sensory-gallery">
            <div className="gallery-pair">
              <img src={ceraBlancaImg} alt="Vertiendo cera de arena Sutra" />
              <img src={ceraNegraImg} alt="Vela de arena negra encendida" />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mystery-comparison-section container">
        <div className="mystery-section-header">
          <span className="section-eyebrow">TABLA COMPARATIVA</span>
          <h2 className="section-title">Compara ambos rituales</h2>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Contenido & Beneficios</th>
                <th className="th-highlight">{plans.completo.tierName || plans.completo.name}</th>
                <th>{plans.esencial.tierName || plans.esencial.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frecuencia de entrega</td>
                <td className="td-highlight"><strong>Cada 2 meses</strong></td>
                <td><strong>Cada 2 meses</strong></td>
              </tr>
              <tr>
                <td>Vela de cera en Arena Sutra</td>
                <td className="td-highlight">500 gramos incluidos</td>
                <td>500 gramos incluidos</td>
              </tr>
              <tr>
                <td>Vasija artesanal de cerámica</td>
                <td className="td-highlight"><strong>✓ Incluida en cada entrega</strong></td>
                <td>— No incluye vasija (Kit Recarga)</td>
              </tr>
              <tr>
                <td>Aromas botánicos sorpresa</td>
                <td className="td-highlight">2 Aromas (Brumas / Esencias)</td>
                <td>2 Aromas (Brumas / Esencias)</td>
              </tr>
              <tr>
                <td>Mechas largas para velas</td>
                <td className="td-highlight">5 Mechas de 15 cm</td>
                <td>5 Mechas de 15 cm</td>
              </tr>
              <tr>
                <td>Detalles y Coleccionables</td>
                <td className="td-highlight">✓ Tarjeta de intención + Stickers + Cerillos</td>
                <td>✓ Tarjeta de intención bimestral</td>
              </tr>
              <tr>
                <td>Costo de envío</td>
                <td className="td-highlight"><strong>Sin cargo a todo México</strong></td>
                <td><strong>Sin cargo a todo México</strong></td>
              </tr>
              <tr>
                <td>Flexibilidad de cancelación</td>
                <td className="td-highlight">En cualquier momento</td>
                <td>En cualquier momento</td>
              </tr>
              <tr>
                <td>Precio bimestral</td>
                <td className="td-highlight price-cell">
                  <span className="tbl-price">{plans.completo.price}</span>
                  <small className="tbl-save">{plans.completo.savings}</small>
                </td>
                <td className="price-cell">
                  <span className="tbl-price">{plans.esencial.price}</span>
                  <small className="tbl-save">{plans.esencial.savings}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mystery-faq-section container">
        <div className="mystery-section-header">
          <span className="section-eyebrow">RESOLVEMOS TUS DUDAS</span>
          <h2 className="section-title">Preguntas Frecuentes sobre la Suscripción</h2>
        </div>

        <div className="mystery-faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
              >
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating CTA Banner */}
      <section className="mystery-bottom-banner container">
        <div className="bottom-banner-card">
          <div className="banner-copy">
            <h3>¿Listo para sostener tu ritual cada 2 meses?</h3>
            <p>Elige tu modalidad hoy y recibe tu primer desempaque esta misma semana con envío sin cargo.</p>
          </div>
          <div className="banner-actions">
            <button 
              type="button" 
              className="btn btn--gold"
              onClick={() => handleSubscribe('completo')}
            >
              Suscribirme al {plans.completo.tierName} ({plans.completo.price})
            </button>
            <button 
              type="button" 
              className="btn btn--outline"
              onClick={() => handleSubscribe('esencial')}
            >
              {plans.esencial.tierName} ({plans.esencial.price})
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
