import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLandingBySlug } from '../lib/landingService';
import SEO from '../components/SEO';

// Home components to repeat and enrich the experience
import Concept from '../components/Concept';
import Marquee from '../components/Marquee';
import Categories from '../components/Categories';
import Rituals from '../components/Rituals';
import BestSellers from '../components/BestSellers';
import AromaExperience from '../components/AromaExperience';
import SocialProof from '../components/SocialProof';
import Gifts from '../components/Gifts';
import Newsletter from '../components/Newsletter';

import './DynamicLanding.css';

export default function DynamicLanding({ onNavigate, onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    async function loadLanding() {
      setLoading(true);
      setError(false);

      try {
        const data = await getLandingBySlug(slug);
        if (!isMounted) return;

        if (data) {
          setLanding(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('[DynamicLanding] Error cargando landing:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLanding();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="landing-loading-state container">
        <div className="landing-spinner" />
        <p className="landing-loading-text">Cargando ritual y santuario de bienestar...</p>
      </div>
    );
  }

  // Fallback 404 state if slug doesn't exist in Supabase or CSV
  if (error || !landing) {
    return (
      <div className="landing-not-found container">
        <span className="landing-badge">Sutra México</span>
        <h1 className="landing-nf-title">Página no encontrada</h1>
        <p className="landing-nf-desc">
          No pudimos localizar la landing solicitada. Explora nuestro catálogo de velas de arena,
          aromas y accesorios artesanales.
        </p>
        <Link to="/tienda" className="btn-landing-primary">
          Ir a la Tienda Oficial
        </Link>
      </div>
    );
  }

  // Dynamic structured data (LocalBusiness + WebPage + Product schema)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: landing.tituloSeo || landing.tituloPagina,
    description: landing.metadescripcion || landing.excerpt,
    url: `https://www.sutramexico.com/${landing.slug}`,
    about: {
      '@type': 'Thing',
      name: landing.fraseBusqueda || 'Velas de arena',
      description: landing.parrafoSeo || landing.excerpt,
    },
    spatialCoverage: {
      '@type': 'Place',
      name: landing.ciudad || landing.estado || 'México',
      address: {
        '@type': 'PostalAddress',
        addressLocality: landing.ciudad || 'Ciudad de México',
        addressRegion: landing.estado || 'México',
        addressCountry: 'MX',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sutra México',
      url: 'https://www.sutramexico.com',
    },
  };

  const handleCta = (category = 'velas') => {
    if (onNavigate) {
      onNavigate('shop', null, category);
    } else {
      navigate(`/tienda/${category}`);
    }
  };

  return (
    <div className="dynamic-landing-page fade-in">
      {/* 1. Dynamic Head Meta & Canonical from Supabase row */}
      <SEO
        title={landing.tituloSeo}
        description={landing.metadescripcion}
        canonical={`https://www.sutramexico.com/${landing.slug}`}
        type="website"
        schema={schema}
      />

      {/* 2. Custom Dynamic Hero tailored to this Landing's row */}
      <section className="landing-hero">
        <div className="landing-hero__bg" />
        <div className="landing-hero__overlay" />

        <div className="landing-hero__container container">
          {/* Eyebrow badge */}
          <div className="landing-hero__pill">
            <span className="pill-spark">✧</span>
            <span>
              {landing.ciudad
                ? `Colección ${landing.ciudad}, ${landing.estado}`
                : 'Colección Oficial México'}
            </span>
          </div>

          {/* Primary H1: Título de página */}
          <h1 className="landing-hero__title">
            {landing.tituloPagina}
          </h1>

          {/* Lead: Excerpt */}
          <p className="landing-hero__excerpt">
            {landing.excerpt}
          </p>

          {/* Action CTAs */}
          <div className="landing-hero__actions">
            <button
              type="button"
              className="btn-landing-primary"
              onClick={() => handleCta('velas')}
            >
              Comprar Velas en Polvo
            </button>
            <button
              type="button"
              className="btn-landing-secondary"
              onClick={() => handleCta('all')}
            >
              Ver Catálogo Completo
            </button>
          </div>

          {/* Micro value props bar */}
          <div className="landing-hero__props">
            <div className="landing-prop-item">
              <span className="prop-icon">🚚</span>
              <span>
                {landing.ciudad
                  ? `Envíos asegurados a ${landing.ciudad}`
                  : 'Envíos asegurados a todo México'}
              </span>
            </div>
            <div className="landing-prop-divider" />
            <div className="landing-prop-item">
              <span className="prop-icon">🌿</span>
              <span>Cera vegetal perlada 100% pura</span>
            </div>
            <div className="landing-prop-divider" />
            <div className="landing-prop-item">
              <span className="prop-icon">✨</span>
              <span>Reutilizable en cualquier vasija</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Editorial SEO Section: Párrafo SEO amplio & Metainformación */}
      <section className="landing-seo-section">
        <div className="container landing-seo-container">
          <div className="landing-seo-card">
            <div className="landing-seo-card__header">
              <span className="landing-seo-card__tag">
                {landing.fraseBusqueda ? `✦ ${landing.fraseBusqueda.toUpperCase()}` : '✦ RITUALES SUTRA'}
              </span>
              <h2 className="landing-seo-card__title">
                {landing.titulo || landing.tituloPagina}
              </h2>
            </div>

            {landing.parrafoSeo && (
              <div className="landing-seo-card__body">
                <p className="landing-seo-card__paragraph">
                  {landing.parrafoSeo}
                </p>
              </div>
            )}

            <div className="landing-seo-card__footer">
              {landing.ciudad && (
                <div className="landing-meta-chip">
                  <span className="chip-label">Zona:</span>
                  <span className="chip-val">{landing.ciudad}</span>
                </div>
              )}
              {landing.estado && (
                <div className="landing-meta-chip">
                  <span className="chip-label">Estado:</span>
                  <span className="chip-val">{landing.estado}</span>
                </div>
              )}
              {landing.fraseBusqueda && (
                <div className="landing-meta-chip">
                  <span className="chip-label">Búsqueda:</span>
                  <span className="chip-val">{landing.fraseBusqueda}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Home experience repeated with dynamic interactive modules */}
      <Concept />
      <Marquee />
      <Categories onNavigate={onNavigate} />
      <Rituals onNavigate={onNavigate} />
      <BestSellers onNavigate={onNavigate} onAddToCart={onAddToCart} />
      <AromaExperience onNavigate={onNavigate} />
      <SocialProof />
      <Gifts onAddToCart={onAddToCart} />
      <Newsletter />
    </div>
  );
}
