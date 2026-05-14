import { useState } from 'react';
import { newsletterContent } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Newsletter.css';

export default function Newsletter() {
  const ref = useScrollReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      // In production, this connects to Wix Headless CRM
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="newsletter" id="newsletter" ref={ref}>
      <div className="newsletter__bg" />
      <div className="newsletter__container">
        <div className="newsletter__content reveal">
          <span className="newsletter-tag">{newsletterContent.tag}</span>
          <h2 className="newsletter__title reveal reveal-delay-1">{newsletterContent.title}</h2>
          <p className="newsletter__subtitle reveal reveal-delay-2">{newsletterContent.subtitle}</p>
          
          <form className="newsletter__form reveal reveal-delay-3" onSubmit={handleSubmit} id="newsletter-form">
            <div className="newsletter__input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterContent.placeholder}
                className="newsletter__input"
                required
                id="newsletter-email"
                aria-label="Tu correo electrónico"
              />
              <button type="submit" className={`newsletter__btn ${submitted ? 'success' : ''}`} id="newsletter-submit">
                {submitted ? 'Bienvenidx ✓' : newsletterContent.cta}
              </button>
            </div>
            <p className="newsletter__disclaimer">
              Al suscribirte, aceptas nuestra política de privacidad. Sin spam, puro bienestar.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
