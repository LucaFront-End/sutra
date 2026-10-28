import { useMemo, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useLegalCMS } from '../hooks/useLegalCMS';
import { LEGAL_POLICIES_CONFIG } from '../data/legalPoliciesData';
import SEO from '../components/SEO';
import './LegalPage.css';

const PATH_OR_SLUG_MAP = {
  // Terms
  '/terminos-y-condiciones': 'terms',
  '/terminos': 'terms',
  'terminos': 'terms',
  'terminos-y-condiciones': 'terms',
  'terms': 'terms',

  // Refund
  '/politica-de-reembolso': 'refund',
  '/politica-de-reembolsos': 'refund',
  '/reembolsos': 'refund',
  '/devoluciones': 'refund',
  'reembolso': 'refund',
  'reembolsos': 'refund',
  'politica-de-reembolso': 'refund',
  'politica-de-reembolsos': 'refund',
  'refund': 'refund',

  // Privacy
  '/politica-de-privacidad': 'privacy',
  '/aviso-de-privacidad': 'privacy',
  '/privacidad': 'privacy',
  'privacidad': 'privacy',
  'aviso-de-privacidad': 'privacy',
  'politica-de-privacidad': 'privacy',
  'privacy': 'privacy',

  // Shipping
  '/politica-de-envios': 'shipping',
  '/politica-de-envio': 'shipping',
  '/envios': 'shipping',
  'envios': 'shipping',
  'politica-de-envios': 'shipping',
  'shipping': 'shipping',
};

export default function LegalPage({ policyKey: propPolicyKey, onNavigate }) {
  const location = useLocation();
  const { slug } = useParams();

  // Resolve active policy key
  const activeKey = useMemo(() => {
    if (propPolicyKey && LEGAL_POLICIES_CONFIG[propPolicyKey]) {
      return propPolicyKey;
    }
    const pathname = location.pathname.toLowerCase().replace(/\/$/, '');
    if (PATH_OR_SLUG_MAP[pathname]) {
      return PATH_OR_SLUG_MAP[pathname];
    }
    if (slug && PATH_OR_SLUG_MAP[slug.toLowerCase()]) {
      return PATH_OR_SLUG_MAP[slug.toLowerCase()];
    }
    return 'terms';
  }, [propPolicyKey, location.pathname, slug]);

  const { config, content, title, lastUpdated, loading, error, allPolicies, isCMSLive } = useLegalCMS(activeKey);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeKey]);

  const formattedDate = useMemo(() => {
    if (!lastUpdated) return 'Octubre de 2026';
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Octubre de 2026';
    }
  }, [lastUpdated]);

  const handlePrint = () => {
    window.print();
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.metaTitle,
    description: config.metaDesc,
    url: `https://www.sutramexico.com${config.path}`,
    publisher: {
      '@type': 'Organization',
      name: 'Sutra México',
      url: 'https://www.sutramexico.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: 'https://www.sutramexico.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Legal & Transparencia',
          item: 'https://www.sutramexico.com/terminos-y-condiciones',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: config.label,
          item: `https://www.sutramexico.com${config.path}`,
        },
      ],
    },
  };

  return (
    <div className="legal-page fade-in">
      <SEO
        title={config.metaTitle}
        description={config.metaDesc}
        canonical={`https://www.sutramexico.com${config.path}`}
        type="website"
        schema={schema}
      />

      {/* Breadcrumbs */}
      <div className="container">
        <nav className="legal-breadcrumbs" aria-label="Miga de pan">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-category">Legal & Transparencia</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{config.label}</span>
        </nav>
      </div>

      {/* Hero Header */}
      <header className="legal-hero">
        <div className="container">
          <div className="legal-hero-inner">
            <span className="legal-tag">✧ {config.tag}</span>
            <h1 className="legal-title">{config.label}</h1>
            <p className="legal-subtitle">
              Sutra México · Transparencia, pureza artesanal y compromiso de confianza en cada envío y ritual.
            </p>

            <div className="legal-meta-row">
              <div className="legal-updated">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Última actualización: {formattedDate}</span>
                {isCMSLive && <span className="legal-cms-badge">● CMS Sincronizado</span>}
              </div>

              <div className="legal-actions">
                <button 
                  onClick={handlePrint} 
                  className="legal-action-btn" 
                  title="Imprimir o guardar como PDF"
                  aria-label="Imprimir política"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Policy Switcher Tabs */}
      <nav className="legal-tabs-wrapper" aria-label="Políticas legales de Sutra">
        <div className="legal-tabs-inner">
          {allPolicies.map((pol) => {
            const isActive = pol.key === activeKey;
            return (
              <Link
                key={pol.key}
                to={pol.path}
                className={`legal-tab-btn ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="tab-icon">
                  {pol.key === 'terms' && '📜'}
                  {pol.key === 'refund' && '🔄'}
                  {pol.key === 'privacy' && '🔒'}
                  {pol.key === 'shipping' && '🚚'}
                </span>
                <span className="tab-label">{pol.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Article Content Container */}
      <main className="legal-content-container">
        <article className="legal-article-card">
          {loading && (
            <div className="legal-skeleton-container">
              <div className="legal-skeleton-line legal-skeleton-title shimmer" />
              <div className="legal-skeleton-line shimmer" style={{ width: '90%' }} />
              <div className="legal-skeleton-line shimmer" style={{ width: '95%' }} />
              <div className="legal-skeleton-line shimmer" style={{ width: '80%' }} />
              <div className="legal-skeleton-line shimmer" style={{ width: '88%', marginTop: '1.5rem' }} />
              <div className="legal-skeleton-line shimmer" style={{ width: '92%' }} />
              <div className="legal-skeleton-line shimmer" style={{ width: '70%' }} />
            </div>
          )}

          {!loading && error && (
            <div className="legal-error-box">
              <span className="error-icon">⚠️</span>
              <h3>No se pudo cargar la política solicitada</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && content && (
            <div
              className="legal-article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Support Assistance Card */}
          <div className="legal-support-box">
            <div className="legal-support-text">
              <h4>¿Tienes alguna duda sobre nuestras políticas o tu pedido?</h4>
              <p>
                Nuestro equipo de atención al cliente en México está disponible para orientarte de lunes a domingo.
              </p>
            </div>
            <div className="legal-support-actions">
              <a 
                href="https://wa.me/5215512345678" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="legal-support-btn secondary"
              >
                <span>💬 WhatsApp Sutra</span>
              </a>
              <a 
                href="mailto:contacto@sutramexico.com" 
                className="legal-support-btn primary"
              >
                <span>✉️ contacto@sutramexico.com</span>
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
