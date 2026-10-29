import { useState, useEffect } from 'react';
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

export default function MysteryBox({ onNavigate }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { products: wixProducts } = useWixProducts();

  const [activeCompletoImg, setActiveCompletoImg] = useState(0);
  const [activeEsencialImg, setActiveEsencialImg] = useState(0);
  const [completoColor, setCompletoColor] = useState('Blanco');
  const [esencialColor, setEsencialColor] = useState('Blanco');
  const [addedPlanId, setAddedPlanId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Dynamically resolve real products from Wix Stores
  const wixCompleto = (wixProducts || []).find(
    (p) => p._wixId === 'a9a00ce4-e102-4b47-8f45-da29e2579106' ||
           p.slug === 'misterybox-ritual-completo-velas-flotantes-y-velas-de-arena' ||
           p.slug?.includes('misterybox-ritual-completo')
  );

  const wixEsencial = (wixProducts || []).find(
    (p) => p._wixId === '6f22920a-ad94-43ca-baf5-4853d9d6dfd5' ||
           p.slug === 'misterybox-esencial' ||
           p.slug?.includes('misterybox-esencial')
  );

  const filterUnique = (arr) => Array.from(new Set(arr.filter(Boolean)));

  const wixCompletoImgs = (wixCompleto?.images || []).map((img) =>
    typeof img === 'string' ? img : img?.src || img?.url
  );
  const wixEsencialImgs = (wixEsencial?.images || []).map((img) =>
    typeof img === 'string' ? img : img?.src || img?.url
  );

  // Use real Wix product media
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

  const plans = {
    completo: {
      id: wixCompleto?._wixId || 'a9a00ce4-e102-4b47-8f45-da29e2579106',
      _wixId: wixCompleto?._wixId || 'a9a00ce4-e102-4b47-8f45-da29e2579106',
      subscriptionOptionId: wixCompleto?.subscriptionOptionId || KNOWN_SUBSCRIPTION_OPTIONS['a9a00ce4-e102-4b47-8f45-da29e2579106'],
      slug: wixCompleto?.slug || 'misterybox-ritual-completo-velas-flotantes-y-velas-de-arena',
      isWixProduct: true,
      name: wixCompleto?.name || 'MisteryBox Ritual Completo | Velas Flotantes y Velas de Arena',
      tierName: 'Ritual Completo',
      tag: 'EXPERIENCIA COMPLETA',
      badge: 'BIMESTRAL',
      price: wixCompleto?.price || '$1,590 MXN',
      priceNum: wixCompleto?.priceNum || 1590,
      period: 'cada 2 meses',
      savings: 'Ahorro $150 MXN',
      desc: wixCompleto?.shortDesc || 'Vasija de cerámica artesanal y curación botánica estacional completa.',
      img: completoGallery[0],
      gallery: completoGallery,
      wixVariants: wixCompleto?.wixVariants || [],
      options: wixCompleto?.options?.length ? wixCompleto.options : defaultWixOptions,
      items: [
        '500g cera en arena botánica pura',
        'Vasija artesanal de cerámica exclusiva',
        '2 Aromas botánicos sorpresa estacionales',
        'Botella de cerillos largos + 5 mechas',
        'Carta ritual y guía de meditación',
      ],
    },
    esencial: {
      id: wixEsencial?._wixId || '6f22920a-ad94-43ca-baf5-4853d9d6dfd5',
      _wixId: wixEsencial?._wixId || '6f22920a-ad94-43ca-baf5-4853d9d6dfd5',
      subscriptionOptionId: wixEsencial?.subscriptionOptionId || KNOWN_SUBSCRIPTION_OPTIONS['6f22920a-ad94-43ca-baf5-4853d9d6dfd5'],
      slug: wixEsencial?.slug || 'misterybox-esencial',
      isWixProduct: true,
      name: wixEsencial?.name || 'MisteryBox Esencial | Velas Flotantes y Velas de Arena',
      tierName: 'Ritual Esencial',
      tag: 'RECARGA',
      badge: 'BIMESTRAL',
      price: wixEsencial?.price || '$690 MXN',
      priceNum: wixEsencial?.priceNum || 690,
      period: 'cada 2 meses',
      savings: 'Ahorro $100 MXN',
      desc: wixEsencial?.shortDesc || 'Recarga periódica de cera y aromas para acompañar tus recipientes.',
      img: esencialGallery[0],
      gallery: esencialGallery,
      wixVariants: wixEsencial?.wixVariants || [],
      options: wixEsencial?.options?.length ? wixEsencial.options : defaultWixOptions,
      items: [
        '500g cera en arena botánica pura',
        '2 Aromas botánicos sorpresa estacionales',
        'Botella de cerillos largos + 5 mechas',
        'Carta ritual y guía de meditación',
        'Sin vasija · Recarga tus recipientes',
      ],
    },
  };

  const handleGoToProduct = (plan) => {
    if (onNavigate) {
      onNavigate('product', plan);
    } else {
      navigate(`/producto/${plan.slug}`);
    }
  };

  const handleSubscribe = (planKey) => {
    const plan = plans[planKey];
    const wixRef = planKey === 'completo' ? wixCompleto : wixEsencial;
    const chosenColor = planKey === 'completo' ? completoColor : esencialColor;

    // Match Wix variantId if available
    const matchedWixVariant = (plan.wixVariants || []).find((v) => {
      const choices = v.choices || {};
      return Object.values(choices).some(
        (val) => String(val).toLowerCase() === chosenColor.toLowerCase()
      );
    });

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
      selectedOptions: { 'Color:': chosenColor },
      selectedVariant: `Color: ${chosenColor} | Entrega bimestral`,
      wixVariants: plan.wixVariants,
      options: plan.options,
      subscription: {
        frequency: 'Cada 2 meses',
        tier: plan.name,
        type: `Color: ${chosenColor}`,
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
                  <small>Vela de Arena + Vasija + 2 Aromas + 5 Mechas</small>
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
                >
                  <img 
                    src={plans.completo.gallery[activeCompletoImg] || plans.completo.gallery[0]} 
                    alt={plans.completo.name}
                    className="split-card__main-img" 
                  />
                  <span className="split-card__tier-tag">✦ Con Vasija de Cerámica</span>
                </Link>
                {/* Thumbnails */}
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
                    <span className="split-card__period">/ cada 2 meses</span>
                  </div>
                  <p className="split-card__desc">{plans.completo.desc}</p>
                </div>

                {/* Wix Color Selector */}
                <div className="split-card__color-selector">
                  <span className="split-card__color-label">Color de Cera: <strong>{completoColor}</strong></span>
                  <div className="split-card__color-pills">
                    {['Blanco', 'Negro'].map((col) => (
                      <button
                        key={col}
                        type="button"
                        className={`split-card__color-btn ${completoColor === col ? 'is-active' : ''}`}
                        onClick={() => {
                          setCompletoColor(col);
                          setActiveCompletoImg(col === 'Negro' && plans.completo.gallery.length > 1 ? 1 : 0);
                        }}
                      >
                        <span
                          className="split-card__color-dot"
                          style={{ background: col === 'Blanco' ? '#FAF7F2' : '#1C1917' }}
                        />
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimalist 1-Line Items List */}
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
                        <span>Suscribirme al Ritual Completo</span>
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
                >
                  <img 
                    src={plans.esencial.gallery[activeEsencialImg] || plans.esencial.gallery[0]} 
                    alt={plans.esencial.name}
                    className="split-card__main-img" 
                  />
                  <span className="split-card__tier-tag">✦ Kit Recarga (Sin Vasija)</span>
                </Link>
                {/* Thumbnails */}
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
                    <span className="split-card__period">/ cada 2 meses</span>
                  </div>
                  <p className="split-card__desc">{plans.esencial.desc}</p>
                </div>

                {/* Wix Color Selector */}
                <div className="split-card__color-selector">
                  <span className="split-card__color-label">Color de Cera: <strong>{esencialColor}</strong></span>
                  <div className="split-card__color-pills">
                    {['Blanco', 'Negro'].map((col) => (
                      <button
                        key={col}
                        type="button"
                        className={`split-card__color-btn ${esencialColor === col ? 'is-active' : ''}`}
                        onClick={() => {
                          setEsencialColor(col);
                          setActiveEsencialImg(col === 'Negro' && plans.esencial.gallery.length > 1 ? 1 : 0);
                        }}
                      >
                        <span
                          className="split-card__color-dot"
                          style={{ background: col === 'Blanco' ? '#FAF7F2' : '#1C1917' }}
                        />
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimalist 1-Line Items List */}
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
                        <span>Suscribirme al Ritual Esencial</span>
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
              Selecciona el <strong>Ritual Completo</strong> si quieres recibir una vasija artesanal nueva o el <strong>Ritual Esencial</strong> si prefieres recargar tus recipientes.
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
                <th className="th-highlight">{plans.completo.name}</th>
                <th>{plans.esencial.name}</th>
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
                <td>— No incluye vasija</td>
              </tr>
              <tr>
                <td>Aromas botánicos sorpresa</td>
                <td className="td-highlight">2 Aromas (Brumas/Esencias)</td>
                <td>2 Aromas (Brumas/Esencias)</td>
              </tr>
              <tr>
                <td>Mechas largas para velas</td>
                <td className="td-highlight">5 Mechas de 15 cm</td>
                <td>5 Mechas de 15 cm</td>
              </tr>
              <tr>
                <td>Carta de Intención Bimestral</td>
                <td className="td-highlight">✓ Incluida</td>
                <td>✓ Incluida</td>
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
              Suscribirme al Ritual Completo ({plans.completo.price})
            </button>
            <button 
              type="button" 
              className="btn btn--outline"
              onClick={() => handleSubscribe('esencial')}
            >
              Ritual Esencial ({plans.esencial.price})
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
