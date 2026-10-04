import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import mysteryHeroImg from '../assets/images/mystery-box-hero.jpg';
import mysteryEsencialImg from '../assets/images/mystery-box-esencial.jpg';
import ceraBlancaImg from '../assets/images/cera-blanca.jpg';
import ceraNegraImg from '../assets/images/cera-negra.jpg';
import './MysteryBox.css';

export default function MysteryBox({ onNavigate }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedPlan, setSelectedPlan] = useState('completo');
  const [addedPlanId, setAddedPlanId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const plans = {
    completo: {
      id: 'p-mystery-completo',
      name: 'Sutra Mystery Box · Ritual Completo',
      tierName: 'Ritual Completo',
      tag: 'MÁS ELEGIDO · EXPERIENCIA TOTAL',
      badge: 'BIMESTRAL',
      price: '$990 MXN',
      priceNum: 990,
      period: 'cada 2 meses',
      storeValue: '$1,590 MXN',
      savings: 'Ahorro de $600 MXN',
      desc: 'La experiencia definitiva para iniciar o enriquecer tu santuario con una vasija artesanal nueva y piezas completas cada 2 meses.',
      img: mysteryHeroImg,
      includes: [
        { title: '1 Vela de cera en Arena Sutra', detail: '500g de cera perlada botánica pura de alta duración y quemado infinito' },
        { title: '1 Vasija artesanal de cerámica', detail: 'Pieza escultórica modelada y horneada a mano por alfareros mexicanos' },
        { title: '2 Aromas botánicos sorpresa', detail: 'Selección estacional: 1 Room Mist (100ml) + 1 Esencia concentrada o difusor' },
        { title: '5 Mechas de 15 cm', detail: 'Mechas de algodón orgánico puro y madera crujiente para múltiples encendidos' },
        { title: '1 Carta de Intención Bimestral', detail: 'Micro-práctica de meditación guiada y afirmación para tu espacio' },
      ],
      idealFor: 'Quienes desean la experiencia sensorial completa con vasijas exclusivas coleccionables en cada entrega.',
    },
    esencial: {
      id: 'p-mystery-esencial',
      name: 'Sutra Mystery Box · Ritual Esencial',
      tierName: 'Ritual Esencial',
      tag: 'RECARGA CONSCIENTE',
      badge: 'BIMESTRAL',
      price: '$590 MXN',
      priceNum: 590,
      period: 'cada 2 meses',
      storeValue: '$950 MXN',
      savings: 'Ahorro de $360 MXN',
      desc: 'Ideal para quienes ya cuentan con su vasija favorita en casa y desean recargar su cera de arena, aromas y mechas cada 60 días.',
      img: mysteryEsencialImg,
      includes: [
        { title: '1 Vela de cera en Arena Sutra', detail: '500g de cera perlada botánica de recarga limpia sin residuos' },
        { title: '2 Aromas botánicos sorpresa', detail: '2 esencias o brumas aromáticas con formulaciones de temporada' },
        { title: '5 Mechas de 15 cm', detail: 'Mechas largas de combustión lenta para cortar a la medida deseada' },
        { title: '1 Carta de Intención Bimestral', detail: 'Reflexión y guía consciente para renovar la energía de tu hogar' },
      ],
      idealFor: 'Quienes ya tienen vasijas o recipientes en casa y solo requieren la cera de arena, mechas y nuevos aromas.',
    },
  };

  const handleSubscribe = (planKey) => {
    const plan = plans[planKey];
    const itemToAdd = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      priceNum: plan.priceNum,
      category: 'suscripciones',
      img: plan.img,
      selectedVariant: `Entrega bimestral | Selección Sorpresa Exclusiva${planKey === 'completo' ? ' (Con Vasija)' : ' (Recarga)'}`,
      subscription: {
        frequency: 'Cada 2 meses',
        tier: plan.tierName,
        type: 'Selección Sorpresa Misteriosa',
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
                src={mysteryHeroImg} 
                alt="Sutra Mystery Box Ritual Completo unboxing" 
                className="mystery-hero__img" 
              />
              <div className="mystery-badge-float">
                <span className="badge-spark">✦</span>
                <div>
                  <strong>Kit Bimestral Sutra</strong>
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
              Ambos planes se entregan cada 2 meses con cera vegetal pura, aromas botánicos y mechas largas.
            </p>
          </div>

          {/* Plan Cards Grid */}
          <div className="mystery-cards-grid">
            {/* PLAN 1: RITUAL COMPLETO */}
            <div className={`mystery-card mystery-card--featured ${selectedPlan === 'completo' ? 'is-selected' : ''}`}>
              <div className="mystery-card__badge-ribbon">{plans.completo.tag}</div>

              <div className="mystery-card__media">
                <img src={plans.completo.img} alt={plans.completo.name} />
                <span className="mystery-card__media-tag">Kit con Vasija Cerámica</span>
              </div>

              <div className="mystery-card__body">
                <div className="mystery-card__header">
                  <h3 className="mystery-card__title">{plans.completo.tierName}</h3>
                  <div className="mystery-card__price-row">
                    <span className="mystery-card__price">{plans.completo.price}</span>
                    <span className="mystery-card__period">/ cada 2 meses</span>
                  </div>
                  <div className="mystery-card__savings-tag">
                    <span>Valor regular: {plans.completo.storeValue}</span>
                    <strong className="savings-badge">{plans.completo.savings}</strong>
                  </div>
                </div>

                <p className="mystery-card__desc">{plans.completo.desc}</p>

                {/* What's included checklist */}
                <div className="mystery-includes-box">
                  <h4 className="includes-title">Qué incluye cada 2 meses:</h4>
                  <ul className="includes-list">
                    {plans.completo.includes.map((item, idx) => (
                      <li key={idx} className="includes-item">
                        <span className="item-icon">✓</span>
                        <div className="item-text">
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 100% Surprise Curation Notice */}
                <div className="mystery-curation-box">
                  <div className="mystery-curation-icon">✨</div>
                  <div className="mystery-curation-content">
                    <strong>Experiencia 100% Sorpresa</strong>
                    <p>Curación exclusiva del Maestro Aromático con vasija artesanal nueva y aromas de temporada seleccionados para ti. ¡Sin opciones que elegir, cada entrega es un misterio sensorial!</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn mystery-action-btn ${addedPlanId === plans.completo.id ? 'btn--added' : 'btn--gold'}`}
                  onClick={() => handleSubscribe('completo')}
                  id="btn-sub-completo"
                >
                  {addedPlanId === plans.completo.id ? (
                    <>
                      <span>✓</span>
                      <span>¡Agregado a la Bolsa de Compras!</span>
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

                <p className="mystery-card__footnote">
                  Envío gratis a todo México · Sin contratos forzosos · Cancela en 1 clic
                </p>
              </div>
            </div>

            {/* PLAN 2: RITUAL ESENCIAL */}
            <div className={`mystery-card ${selectedPlan === 'esencial' ? 'is-selected' : ''}`}>
              <div className="mystery-card__badge-ribbon mystery-card__badge-ribbon--muted">
                {plans.esencial.tag}
              </div>

              <div className="mystery-card__media">
                <img src={plans.esencial.img} alt={plans.esencial.name} />
                <span className="mystery-card__media-tag">Kit Recarga (Usa tus vasijas)</span>
              </div>

              <div className="mystery-card__body">
                <div className="mystery-card__header">
                  <h3 className="mystery-card__title">{plans.esencial.tierName}</h3>
                  <div className="mystery-card__price-row">
                    <span className="mystery-card__price">{plans.esencial.price}</span>
                    <span className="mystery-card__period">/ cada 2 meses</span>
                  </div>
                  <div className="mystery-card__savings-tag">
                    <span>Valor regular: {plans.esencial.storeValue}</span>
                    <strong className="savings-badge">{plans.esencial.savings}</strong>
                  </div>
                </div>

                <p className="mystery-card__desc">{plans.esencial.desc}</p>

                {/* What's included checklist */}
                <div className="mystery-includes-box">
                  <h4 className="includes-title">Qué incluye cada 2 meses:</h4>
                  <ul className="includes-list">
                    {plans.esencial.includes.map((item, idx) => (
                      <li key={idx} className="includes-item">
                        <span className="item-icon">✓</span>
                        <div className="item-text">
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 100% Surprise Curation Notice */}
                <div className="mystery-curation-box">
                  <div className="mystery-curation-icon">✨</div>
                  <div className="mystery-curation-content">
                    <strong>Experiencia 100% Sorpresa</strong>
                    <p>Cera en arena botánica y formulaciones aromáticas estacionales sorpresa para recargar tus propios recipientes favoritos.</p>
                  </div>
                </div>

                <div className="mystery-option-note" style={{ marginBottom: '1.75rem' }}>
                  <span className="note-icon">💡</span>
                  <span>No incluye vasija. Ideal para recargar tus propios recipientes y vasijas Sutra.</span>
                </div>

                <button
                  type="button"
                  className={`btn mystery-action-btn ${addedPlanId === plans.esencial.id ? 'btn--added' : 'btn--outline-dark'}`}
                  onClick={() => handleSubscribe('esencial')}
                  id="btn-sub-esencial"
                >
                  {addedPlanId === plans.esencial.id ? (
                    <>
                      <span>✓</span>
                      <span>¡Agregado a la Bolsa de Compras!</span>
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

                <p className="mystery-card__footnote">
                  Envío gratis a todo México · Sin contratos forzosos · Cancela en 1 clic
                </p>
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
                <th className="th-highlight">Ritual Completo</th>
                <th>Ritual Esencial</th>
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
                  <span className="tbl-price">$990 MXN</span>
                  <small className="tbl-save">Ahorras $600 MXN</small>
                </td>
                <td className="price-cell">
                  <span className="tbl-price">$590 MXN</span>
                  <small className="tbl-save">Ahorras $360 MXN</small>
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
              Suscribirme al Ritual Completo ($990 MXN)
            </button>
            <button 
              type="button" 
              className="btn btn--outline"
              onClick={() => handleSubscribe('esencial')}
            >
              Ritual Esencial ($590 MXN)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
