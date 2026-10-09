import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitToContactoGeneral } from '../lib/formsService';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Asesoría de Ritual o Producto',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      await submitToContactoGeneral({
        nombre: formData.name,
        email: formData.email,
        telefono: formData.phone || '',
        empresa: `Asunto: ${formData.subject}`,
        industria: 'Contacto Web / Consulta',
        mensaje: `Motivo: ${formData.subject}\n\nMensaje:\n${formData.message}`,
      });
    } catch (err) {
      console.error('[Contact Submit Error]', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hola equipo Sutra México, me comunico desde la web para solicitar información sobre: ${formData.subject}.`
    );
    window.open(`https://wa.me/5215500000000?text=${text}`, '_blank');
  };

  const faqs = [
    {
      q: '¿Hacen envíos a toda la República Mexicana?',
      a: 'Sí. Realizamos envíos asegurados a cualquier código postal de México a través de DHL y FedEx. En compras superiores a $1,500 MXN el envío es completamente sin cargo.',
    },
    {
      q: '¿Cuánto tiempo tarda en llegar mi pedido?',
      a: 'En la Ciudad de México y área metropolitana la entrega toma entre 24 y 48 horas hábiles. Para el resto del país, el tiempo promedio es de 3 a 5 días hábiles.',
    },
    {
      q: '¿Cuentan con tienda física o showroom?',
      a: 'Operamos como tienda 100% digital con envíos express asegurados a toda la República Mexicana. Todo nuestro catálogo se gestiona en línea con entrega directa a la puerta de tu hogar o negocio.',
    },
    {
      q: '¿Emiten factura fiscal SAT (CFDI 4.0)?',
      a: 'Sí, todas las órdenes individuales y pedidos mayoristas cuentan con facturación fiscal. Puedes ingresar tus datos fiscales al comprar o enviarnos tu constancia de situación fiscal.',
    },
    {
      q: '¿Qué garantía tengo si una pieza llega dañada por paquetería?',
      a: 'Empacamos cada pieza con protección acolchada y materiales compostables. En el improbable caso de que una vasija o cilindro sufra daños en tránsito, te enviamos un reemplazo nuevo sin costo.',
    },
  ];

  return (
    <div className="contact-page fade-in">
      {/* Hero Header */}
      <header className="contact-hero container">
        <span className="contact-eyebrow">ATENCIÓN CONSCIENTE & ASISTENCIA</span>
        <h1 className="contact-title">Estamos aquí para acompañar tu experiencia</h1>
        <p className="contact-lead">
          Ya sea que busques asesoría sobre aromas, el estado de tu orden, o una cotización para
          un evento especial, nuestro equipo te responderá con calidez y dedicación.
        </p>
      </header>

      {/* 4 Direct Contact Channels */}
      <section className="contact-channels-section container">
        <div className="contact-channels-grid">
          {/* WhatsApp */}
          <div className="contact-channel-card contact-channel-card--highlight">
            <div className="channel-icon-wrap channel-icon-wrap--wa">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.971.53 1.761.813 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.182-2.585-5.769-5.77-5.771zm3.392 8.234c-.143.403-.717.74-1.026.786-.299.043-.687.072-2.001-.47-1.68-.692-2.756-2.42-2.84-2.532-.083-.112-.68-1.037-.68-1.977 0-.94.492-1.401.667-1.593.175-.192.38-.24.507-.24.127 0 .254.001.365.006.118.006.277-.045.433.332.162.391.554 1.353.603 1.452.049.099.082.215.016.347-.066.132-.099.214-.198.33-.099.116-.208.259-.297.348-.1.099-.204.207-.088.406.116.199.514.848 1.103 1.372.759.675 1.399.884 1.597.983.198.099.314.083.43-.05.116-.133.497-.579.629-.778.132-.199.264-.165.446-.099.182.066 1.157.546 1.355.645.198.099.33.149.379.232.049.083.049.48-.094.883z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.65 0-3.18-.46-4.49-1.258l-.32-.193-2.955.775.789-2.88-.21-.334A8.146 8.146 0 013.818 12c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.182 3.67 8.182 8.182 0 4.512-3.67 8.182-8.182 8.182z" />
              </svg>
            </div>
            <span className="channel-tag">RESPUESTA INMEDIATA</span>
            <h3 className="channel-title">WhatsApp Concierge</h3>
            <p className="channel-desc">
              Chatea directamente con nuestros asesores para pedidos urgentes o recomendaciones en vivo.
            </p>
            <button type="button" onClick={handleWhatsAppDirect} className="channel-link-btn channel-link-btn--wa">
              Iniciar conversación en WhatsApp →
            </button>
          </div>

          {/* Email */}
          <div className="contact-channel-card">
            <div className="channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span className="channel-tag">CONSULTAS FORMALES</span>
            <h3 className="channel-title">Correo Electrónico</h3>
            <p className="channel-desc">
              Escríbenos para colaboraciones de marca, prensa, seguimiento de envíos o dudas técnicas.
            </p>
            <a href="mailto:hola@sutramexico.com" className="channel-link-btn">
              hola@sutramexico.com →
            </a>
          </div>

          {/* Envíos a Todo México */}
          <div className="contact-channel-card">
            <div className="channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="channel-tag">TIENDA EN LÍNEA</span>
            <h3 className="channel-title">Envíos a Todo México</h3>
            <p className="channel-desc">
              Tienda digital y taller de diseño artesanal. Despachos rápidos y asegurados por DHL y FedEx a cualquier código postal del país.
            </p>
            <span className="channel-link-btn" style={{ cursor: 'default' }}>
              ✦ Envíos gratis desde $1,500 MXN
            </span>
          </div>

          {/* Schedule */}
          <div className="contact-channel-card">
            <div className="channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="channel-tag">HORARIOS DE ATENCIÓN</span>
            <h3 className="channel-title">Tiempos de Servicio</h3>
            <p className="channel-desc">
              <strong>Lun – Vie:</strong> 9:00 AM – 7:00 PM<br />
              <strong>Sábados:</strong> 10:00 AM – 3:00 PM<br />
              <strong>Domingos:</strong> Pausa consciente & descanso
            </p>
            <span className="channel-badge-status">● En línea en horario hábil</span>
          </div>
        </div>
      </section>

      {/* Main Section: Form & Brand Manifesto */}
      <section className="contact-form-section container">
        <div className="contact-form-wrapper">
          <div className="contact-form-col">
            <span className="form-eyebrow">✦ MENSAJE PERSONALIZADO</span>
            <h2 className="form-heading">Envíanos una solicitud</h2>
            <p className="form-subtext">
              Déjanos tus datos y te responderemos en un lapso no mayor a 24 horas hábiles.
            </p>

            {submitted ? (
              <div className="contact-success-box">
                <div className="success-icon">✦</div>
                <h3>¡Mensaje recibido con éxito!</h3>
                <p>
                  Gracias por acercarte a Sutra México, <strong>{formData.name}</strong>. Hemos recibido tu
                  mensaje y uno de nuestros guías se pondrá en contacto a tu correo (
                  <em>{formData.email}</em>) o vía WhatsApp a la brevedad.
                </p>
                <button
                  type="button"
                  className="reset-form-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'Asesoría de Ritual o Producto',
                      message: '',
                    });
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="subject">Motivo de contacto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Asesoría de Ritual o Producto">Asesoría de Ritual o Elección de Aroma</option>
                    <option value="Duda sobre mi Pedido o Envío">Duda sobre mi Pedido o Seguimiento de Envío</option>
                    <option value="Eventos & Banquetes B2B">Eventos, Banquetes o Cera de Arena por Mayor</option>
                    <option value="Regalos Corporativos">Regalos Corporativos y Personalización con Logo</option>
                    <option value="Prensa o Colaboración">Prensa, Alianzas o Colaboraciones de Marca</option>
                    <option value="Otro motivo">Otro motivo de consulta</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Tu nombre y apellido"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Número de WhatsApp (Opcional, para respuesta rápida)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+52 55 0000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">¿En qué podemos acompañarte? *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Cuéntanos los detalles de tu consulta, evento o el ritual que deseas crear..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="form-submit-btn" id="contact-submit-btn" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'Enviando a Sutra...' : 'Enviar mensaje a Sutra'}</span>
                  <span className="submit-arrow">{isSubmitting ? '✦' : '→'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Aside: Brand Seal & Editorial Assurance */}
          <div className="contact-aside-col">
            <div className="aside-card">
              <span className="aside-spark">✦</span>
              <h3 className="aside-title">La Promesa de Sutra</h3>
              <p className="aside-p">
                Creemos que el lujo contemporáneo no reside en el exceso, sino en el cuidado meticuloso de cada
                interacción. Cada consulta es atendida directamente por el equipo que formula y empaqueta tus
                rituales en México.
              </p>

              <div className="aside-perks">
                <div className="aside-perk-row">
                  <span className="perk-check">✓</span>
                  <div>
                    <strong>Atención humana y sin respuestas automáticas vacías</strong>
                    <small>Te asesora un especialista en perfumería y ceras botánicas.</small>
                  </div>
                </div>
                <div className="aside-perk-row">
                  <span className="perk-check">✓</span>
                  <div>
                    <strong>Garantía de tranquilidad absoluta</strong>
                    <small>Cualquier eventualidad con tu envío se resuelve sin fricciones.</small>
                  </div>
                </div>
                <div className="aside-perk-row">
                  <span className="perk-check">✓</span>
                  <div>
                    <strong>Cotizaciones B2B en menos de 2 horas</strong>
                    <small>Cálculo de kilogramos y opciones a la medida de tu presupuesto.</small>
                  </div>
                </div>
              </div>

              <div className="aside-b2b-cta">
                <span>¿Organizas una boda o evento masivo?</span>
                <Link to="/eventos" className="aside-b2b-link">
                  Explora la sección de Eventos & Cera de Arena →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="contact-faq-section container">
        <div className="faq-head text-center">
          <span className="faq-tag">PREGUNTAS FRECUENTES</span>
          <h2 className="faq-title">Respuestas rápidas a inquietudes habituales</h2>
          <p className="faq-sub">Todo lo que necesitas saber sobre envíos, garantías y compras en Sutra.</p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q">{faq.q}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
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
    </div>
  );
}
