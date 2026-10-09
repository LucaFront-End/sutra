import { useState, useEffect } from 'react';
import popupImg from '../assets/images/cera-blanca.jpg';
import { submitToContactoGeneral } from '../lib/formsService';
import './DiscountPopup.css';

const COUPON_CODE = 'SUTRA10';
const STORAGE_KEY = 'sutra_discount_popup_seen';
const SUBSCRIBERS_KEY = 'sutra_subscribers';
const EXPIRY_DAYS = 7;

export default function DiscountPopup({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed or used within last EXPIRY_DAYS
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        if (!isNaN(timestamp)) {
          const daysDiff = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
          if (daysDiff < EXPIRY_DAYS) {
            return;
          }
        }
      }
    } catch {
      // In case localStorage is blocked
    }

    // Trigger popup after 3.5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      // 1. Submit lead directly to Wix CMS ContactoGeneral
      await submitToContactoGeneral({
        nombre: cleanName || 'Nuevo Miembro Sutra',
        email: cleanEmail,
        empresa: `Cupón ${COUPON_CODE} (10% OFF)`,
        industria: 'Lead Bienvenida / Popup',
        mensaje: `Registro para 10% OFF en primera compra. Nombre: ${cleanName || 'No indicado'}. Cupón asignado: ${COUPON_CODE}`,
      });

      // 2. Save lead locally
      const existing = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
      existing.push({
        name: cleanName,
        email: cleanEmail,
        coupon: COUPON_CODE,
        date: new Date().toISOString(),
        source: 'welcome_popup_10_off',
      });
      localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(existing));
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (err) {
      console.error('[DiscountPopup Submit Error]', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(COUPON_CODE);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = COUPON_CODE;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy coupon', err);
    }
  };

  const handleShopNow = () => {
    handleClose();
    if (onNavigate) {
      onNavigate('tienda');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="sutra-discount-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-popup-title"
    >
      <div className="sutra-discount-modal">
        {/* Close Button */}
        <button 
          type="button" 
          className="sutra-discount-close" 
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Left Side: Luxury Product Photography */}
        <div className="sutra-discount-media">
          <img 
            src={popupImg} 
            alt="Sutra México Cera de Arena y Velas de Soja" 
            loading="eager"
          />
          <div className="sutra-discount-media-overlay" />
          <div className="sutra-discount-media-badge">
            <div className="sutra-discount-media-badge-icon">10%</div>
            <div className="sutra-discount-media-badge-text">
              <strong>Descuento de Bienvenida</strong>
              Aroma, calma y diseño en tu hogar
            </div>
          </div>
        </div>

        {/* Right Side: Form or Success */}
        <div className="sutra-discount-content">
          {!isSubmitted ? (
            <>
              <div className="sutra-discount-tag">Beneficio Exclusivo</div>
              <h2 id="discount-popup-title" className="sutra-discount-title">
                10% OFF en tu <span>primer ritual</span>
              </h2>
              <p className="sutra-discount-desc">
                Únete a nuestra comunidad. Recibe tu código de descuento instantáneo para tu primera compra y accede a lanzamientos privados.
              </p>

              <form className="sutra-discount-form" onSubmit={handleSubmit}>
                <div className="sutra-discount-input-wrap">
                  <input
                    type="text"
                    className="sutra-discount-input"
                    placeholder="Tu nombre (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className="sutra-discount-input-wrap">
                  <input
                    type="email"
                    required
                    className="sutra-discount-input"
                    placeholder="Tu correo electrónico *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <button 
                  type="submit" 
                  className="sutra-discount-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generando cupón...' : 'OBTENER MI 10% OFF'}
                </button>

                <button 
                  type="button" 
                  className="sutra-discount-skip" 
                  onClick={handleClose}
                >
                  No gracias, prefiero explorar a precio regular
                </button>
              </form>
            </>
          ) : (
            <div className="sutra-discount-success">
              <div className="sutra-discount-success-icon">✦</div>
              <div className="sutra-discount-tag">¡Bienvenidx a Sutra!</div>
              <h2 className="sutra-discount-title">
                Tu 10% OFF está <span>listo</span>
              </h2>
              <p className="sutra-discount-desc">
                Aplica este cupón en el checkout para disfrutar de tu beneficio de bienvenida:
              </p>

              <div className="sutra-discount-coupon-box">
                <span className="sutra-discount-coupon-code">{COUPON_CODE}</span>
                <button 
                  type="button"
                  className={`sutra-discount-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopyCode}
                >
                  {copied ? '¡Copiado! ✓' : 'COPIAR'}
                </button>
              </div>

              <p className="sutra-discount-instruction">
                Válido en cualquier compra en la tienda oficial Sutra México.
              </p>

              <button 
                type="button"
                className="sutra-discount-shop-btn"
                onClick={handleShopNow}
              >
                IR A LA TIENDA AHORA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
