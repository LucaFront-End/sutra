import { useState, useEffect, useRef } from 'react';
import popupImg from '../assets/images/cera-blanca.jpg';
import { submitToContactoGeneral } from '../lib/formsService';
import './DiscountPopup.css';

const STORAGE_KEY = 'sutra_discount_popup_seen';
const SUBSCRIBERS_KEY = 'sutra_subscribers';
const EXPIRY_DAYS = 7;

export default function DiscountPopup({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);

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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormNotice('Por favor ingresa tu correo electrónico para enviarte tu código único.');
      emailInputRef.current?.focus();
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 8) {
      setFormNotice('Por favor ingresa tu número de celular (mínimo 8 dígitos).');
      phoneInputRef.current?.focus();
      return;
    }

    setFormNotice('');
    setIsSubmitting(true);

    try {
      // 1. Submit lead directly to Wix CMS ContactoGeneral
      await submitToContactoGeneral({
        nombre: cleanName || 'Nuevo Miembro Sutra',
        email: cleanEmail,
        telefono: cleanPhone,
        empresa: 'Cupón Único 10% OFF (Enviar por correo)',
        industria: 'Lead Bienvenida / Popup',
        mensaje: `Solicitud de código único de 10% OFF en primera compra. Nombre: ${cleanName || 'No indicado'}. Correo: ${cleanEmail}. Celular: ${cleanPhone}. Enviar código único por correo electrónico.`,
      });

      // 2. Save lead locally
      const existing = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
      existing.push({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        couponType: 'unique_email_code',
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
              Código único enviado a tu correo
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
                Únete a nuestra comunidad. Regístrate y recibirás un <strong>código único de descuento</strong> directamente en tu correo electrónico para tu primera compra.
              </p>

              {formNotice && (
                <div className="sutra-discount-notice" role="status">
                  {formNotice}
                </div>
              )}

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
                    ref={emailInputRef}
                    type="email"
                    required
                    className="sutra-discount-input"
                    placeholder="Tu correo electrónico *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="sutra-discount-input-wrap">
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    required
                    className="sutra-discount-input"
                    placeholder="Tu número de celular / WhatsApp *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>

                <button 
                  type="submit" 
                  className="sutra-discount-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando tu código único...' : 'RECIBIR MI CÓDIGO POR CORREO'}
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
              <div className="sutra-discount-success-icon">✉️</div>
              <div className="sutra-discount-tag">¡Bienvenidx a Sutra!</div>
              <h2 className="sutra-discount-title">
                Tu código único va en <span>camino</span>
              </h2>
              <p className="sutra-discount-desc">
                Hemos registrado tus datos. En breve recibirás tu <strong>código único y personal de 10% OFF</strong> en tu correo electrónico:
              </p>

              <div className="sutra-discount-email-sent-box">
                <div className="sutra-discount-email-row">
                  <span className="sutra-discount-email-badge">✓ Envío programado</span>
                  <strong className="sutra-discount-email-value">{email}</strong>
                  {phone && <span className="sutra-discount-phone-value">📱 {phone}</span>}
                </div>
              </div>

              <p className="sutra-discount-instruction">
                Revisa tu bandeja de entrada (o tu carpeta de promociones / spam) para copiar tu código único y aplicarlo en el checkout.
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
