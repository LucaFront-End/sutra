import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLandingBySlug } from '../lib/landingService';
import SEO from '../components/SEO';

// Home components rendered in identical structure
import Hero from '../components/Hero';
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

  return (
    <>
      {/* 1. Dynamic Head Meta & Canonical from Supabase row */}
      <SEO
        title={landing.tituloSeo}
        description={landing.metadescripcion}
        canonical={`https://www.sutramexico.com/${landing.slug}`}
        type="website"
        schema={schema}
      />

      {/* 2. Identical Home component tree with dynamic landing texts adapted */}
      <Hero onNavigate={onNavigate} landing={landing} />
      <Concept landing={landing} />
      <Marquee landing={landing} />
      <Categories onNavigate={onNavigate} />
      <Rituals onNavigate={onNavigate} />
      <BestSellers onNavigate={onNavigate} onAddToCart={onAddToCart} />
      <AromaExperience onNavigate={onNavigate} />
      <SocialProof landing={landing} />
      <Gifts onAddToCart={onAddToCart} />
      <Newsletter landing={landing} />
    </>
  );
}
