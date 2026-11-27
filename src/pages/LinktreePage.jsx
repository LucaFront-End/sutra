import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { footerContent } from '../data/content';
import {
  fetchLinktreeItems,
  getCachedLinktreeItems,
} from '../services/linktreeService';
import sutraGoldEmblem from '../assets/logo/trimmed/LOGO-10.png';
import sutraWhiteLogo from '../assets/logo/trimmed/LOGO-08.png';
import './LinktreePage.css';

function PresetVectorSvg({ iconKey }) {
  switch (iconKey) {
    case 'store':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 7h12l1 12H5L6 7Z" />
          <path d="M9 7V6a3 3 0 0 1 6 0v1" />
          <path d="M9.5 11.5h5" />
        </svg>
      );
    case 'box':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7.2v9.6L12 21l8-4.2V7.2L12 3Z" />
          <path d="M4 7.2 12 11.4l8-4.2" />
          <path d="M12 11.4V21" />
          <path d="m8.2 5.1 7.6 4.1" />
        </svg>
      );
    case 'candle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.2c1.8 2 2.4 3.5 2.4 4.8a2.4 2.4 0 1 1-4.8 0c0-1.3.6-2.8 2.4-4.8Z" />
          <path d="M12 10.4v1.8" />
          <path d="M6.5 12.6h11v6.2a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-6.2Z" />
          <path d="M6.5 15.8c2 .7 3.8.7 5.5 0s3.5-.7 5.5 0" />
        </svg>
      );
    case 'mercadolibre':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="12" rx="9" ry="6.5" />
          <path d="M7.5 12.2c1.2-1.4 2.6-1.4 3.8 0l1.4 1.3c1 1 2.5 1 3.8-.3" />
          <path d="M9 10.4c1.2-.9 2.5-.8 3.6.2" />
        </svg>
      );
    case 'amazon':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.5 14.5c2.7 2.2 6.6 2.5 9.8.6" />
          <path d="m15.2 13.7 2.4.8-.6 2.4" />
          <path d="M9.2 11.2 12 5.5l2.8 5.7" />
          <path d="M10.1 9.5h3.8" />
        </svg>
      );
    case 'events':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9 12 3.5Z" />
          <path d="M18.5 16.5v3" />
          <path d="M17 18h3" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 11.8a8 8 0 0 1-11.9 7l-3.9 1 1-3.8A8 8 0 1 1 20 11.8Z" />
          <path d="M9.4 9.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.4.5c.5.9 1.3 1.7 2.2 2.2l.5-.4c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.6.4-1.5.5-2.6.1-1.9-.7-3.6-2.4-4.3-4.3-.4-1.1-.3-2 .1-2.6Z" />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 5.5h5.5A2.5 2.5 0 0 1 13 8v11.5a2 2 0 0 0-2-2H5V5.5Z" />
          <path d="M19 5.5h-5.5A2.5 2.5 0 0 0 11 8v11.5a2 2 0 0 1 2-2h6V5.5Z" />
        </svg>
      );
    case 'instagram':
      return <SocialIconSvg icon="ig" />;
    case 'tiktok':
      return <SocialIconSvg icon="tt" />;
    case 'facebook':
      return <SocialIconSvg icon="fb" />;
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="4" />
          <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
        </svg>
      );
    case 'spotify':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10c2.7-.8 5.8-.6 8.2.7" />
          <path d="M8.8 13c2.1-.6 4.6-.4 6.5.6" />
          <path d="M9.6 15.8c1.5-.4 3.3-.2 4.6.5" />
        </svg>
      );
    case 'sutra':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4.2c1.6 2 2 3.8 1.2 5.4-.4.9-1.2 1.7-1.2 3.4" />
          <path d="M5.5 11.2a6.5 6.5 0 0 0 13 0" />
          <path d="M8.2 19c1.2.6 2.5.8 3.8.8s2.6-.2 3.8-.8" />
        </svg>
      );
  }
}

function SocialIconSvg({ icon }) {
  if (icon === 'ig') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === 'tt') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 4v10.2a3.8 3.8 0 1 1-3.1-3.7" />
        <path d="M14 4c.8 2.4 2.7 4 5 4.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 20v-7h2.4l.4-3h-2.8V8.2c0-.9.3-1.5 1.5-1.5h1.4V4.1c-.4-.1-1.3-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V10H9v3h2.5v7h3Z" />
    </svg>
  );
}

function trackLinktreeClick(item) {
  if (typeof window === 'undefined') return;
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  window.dataLayer.push({
    event: 'linktree_click',
    link_title: item.title,
    link_url: item.destination?.href || 'pending',
  });
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'LinktreeClick', {
      title: item.title,
      url: item.destination?.href || '',
    });
  }
}

function LinktreeVectorImage({ primaryUrl, fallbackUrl, title, iconKey }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const candidates = [primaryUrl, fallbackUrl].filter(Boolean);
  const currentSrc = !imgFailed ? candidates[sourceIndex] || '' : '';

  if (currentSrc) {
    return (
      <img
        src={currentSrc}
        alt={`Icono de ${title}`}
        loading="eager"
        className="sutra-lt-card__img"
        onError={() => {
          if (sourceIndex + 1 < candidates.length) {
            setSourceIndex((prev) => prev + 1);
          } else {
            setImgFailed(true);
          }
        }}
      />
    );
  }

  return <PresetVectorSvg iconKey={iconKey || 'sutra'} />;
}

function LinktreeVectorIcon({ media, title }) {
  if (media?.type === 'svg' && media.svgMarkup) {
    return (
      <span
        className="sutra-lt-card__svg-inline"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: media.svgMarkup }}
      />
    );
  }

  if (media?.type === 'image' && (media.primaryUrl || media.fallbackUrl)) {
    return (
      <LinktreeVectorImage
        key={`${media.primaryUrl || ''}|${media.fallbackUrl || ''}`}
        primaryUrl={media.primaryUrl}
        fallbackUrl={media.fallbackUrl}
        title={title}
        iconKey={media.iconKey}
      />
    );
  }

  return <PresetVectorSvg iconKey={media?.iconKey || 'sutra'} />;
}

export default function LinktreePage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(() => getCachedLinktreeItems() || []);
  const [loading, setLoading] = useState(() => !getCachedLinktreeItems());
  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 2600);
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await fetchLinktreeItems();
        if (!active) return;
        if (Array.isArray(result?.items) && result.items.length > 0) {
          setLinks(result.items);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const shareOrCopyUrl = async ({ title, text, url }) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Enlace copiado al portapapeles');
        return;
      } catch {
        // Fallback below
      }
    }

    showToast(url);
  };

  const handleSharePage = () => {
    const pageUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/links`
        : 'https://www.sutramexico.com/links';

    shareOrCopyUrl({
      title: 'Sutra México | Enlaces Oficiales',
      text: 'Velas en arena, aromas y rituales de bienestar',
      url: pageUrl,
    });
  };

  const handleShareItem = (item) => {
    if (!item?.destination?.hasUrl) {
      showToast('Enlace próximamente disponible');
      return;
    }
    const targetUrl = item.destination.internalPath
      ? `https://www.sutramexico.com${item.destination.internalPath}`
      : item.destination.href;

    shareOrCopyUrl({
      title: `${item.title} · Sutra México`,
      text: item.excerpt || 'Descubre Sutra México',
      url: targetUrl,
    });
  };

  const handleCardClick = (e, item) => {
    trackLinktreeClick(item);

    if (!item?.destination?.hasUrl) {
      e.preventDefault();
      showToast('Próximamente disponible');
      return;
    }

    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    if (item.destination.internalPath && !hasModifier) {
      e.preventDefault();
      navigate(item.destination.internalPath);
    }
  };

  return (
    <div className="sutra-lt-page">
      <SEO pageKey="links" />

      <div className="sutra-lt-ambient" aria-hidden="true" />

      <div className="sutra-lt-shell">
        <div className="sutra-lt-topbar">
          <button
            type="button"
            className="sutra-lt-share-btn"
            onClick={handleSharePage}
            aria-label="Compartir enlaces de Sutra México"
            title="Compartir página de enlaces"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="6.5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="17.5" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        <header className="sutra-lt-profile">
          <div className="sutra-lt-avatar">
            <img src={sutraGoldEmblem} alt="Sutra México" />
          </div>
          <h1 className="sutra-lt-title">Sutra México</h1>
          <p className="sutra-lt-bio">
            Velas en arena, aromas y rituales de bienestar
          </p>

          <div className="sutra-lt-socials" aria-label="Redes sociales de Sutra México">
            {footerContent.social.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sutra-lt-social-btn"
                aria-label={social.label}
                title={social.label}
              >
                <SocialIconSvg icon={social.icon} />
              </a>
            ))}
          </div>
        </header>

        <nav className="sutra-lt-links" aria-label="Enlaces principales">
          {loading && links.length === 0 ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="sutra-lt-skeleton" aria-hidden="true" />
            ))
          ) : (
            links.map((item) => {
              const isExternal = item.destination.hasUrl && !item.destination.internalPath;
              const href = item.destination.hasUrl ? item.destination.href : '#proximamente';

              return (
                <div
                  key={item.id}
                  className={`sutra-lt-card ${!item.destination.hasUrl ? 'sutra-lt-card--pending' : ''}`}
                >
                  <a
                    href={href}
                    className="sutra-lt-card__anchor"
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => handleCardClick(e, item)}
                  >
                    <span className="sutra-lt-card__vector">
                      <LinktreeVectorIcon media={item.media} title={item.title} />
                    </span>

                    <span className="sutra-lt-card__body">
                      <span className="sutra-lt-card__title">{item.title}</span>
                      {item.excerpt && (
                        <span className="sutra-lt-card__excerpt">{item.excerpt}</span>
                      )}
                    </span>
                  </a>

                  <button
                    type="button"
                    className="sutra-lt-card__more"
                    onClick={() => handleShareItem(item)}
                    aria-label={`Opciones para ${item.title}`}
                    title={`Compartir ${item.title}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="12" cy="6.5" r="1.45" />
                      <circle cx="12" cy="12" r="1.45" />
                      <circle cx="12" cy="17.5" r="1.45" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </nav>

        <footer className="sutra-lt-footer">
          <Link to="/" className="sutra-lt-brand-mark" aria-label="Visitar Sutra México">
            <img src={sutraWhiteLogo} alt="SUTRA" />
            <span className="sutra-lt-brand-domain">sutramexico.com</span>
          </Link>
        </footer>
      </div>

      {toastMsg && (
        <div className="sutra-lt-toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
