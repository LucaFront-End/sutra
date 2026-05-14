import { useState, useEffect, useRef } from 'react';
import { conceptContent } from '../data/content';
import './Concept.css';

export default function Concept() {
  const [isSilent, setIsSilent] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      
      // We trigger the silence exactly when they have suffered enough stress
      if (rect.top <= -400) {
        setIsSilent(true);
      } else {
        setIsSilent(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="concept-wrapper" ref={wrapperRef}>
      <div className={`concept-sticky ${isSilent ? 'is-silent' : ''}`}>
        
        {/* ——— CHAOS / SENSORY OVERLOAD LAYER ——— */}
        <div className="concept__noise">
          
          {/* Fast, oppressive text tracks */}
          <div className="noise-track noise-track-fast">
            REUNIÓN EN 5 MIN • BANDEJA LLENA • FECHA LÍMITE • RESPONDER YA • REUNIÓN EN 5 MIN • BANDEJA LLENA • FECHA LÍMITE • RESPONDER YA •
          </div>
          <div className="noise-track noise-track-reverse">
            CORRE • LLEGAS TARDE • MÁS RÁPIDO • URGENTE • CORRE • LLEGAS TARDE • MÁS RÁPIDO • URGENTE • CORRE • LLEGAS TARDE •
          </div>
          <div className="noise-track noise-track-fast-2">
            NO HAY TIEMPO • LLAMADA PÉRDIDA • PENDIENTE • RUIDO • NO HAY TIEMPO • LLAMADA PÉRDIDA • PENDIENTE • RUIDO •
          </div>

          {/* Aggressive, glitching popups */}
          <div className="noise-pop pop-1">AHORA</div>
          <div className="noise-pop pop-2">URGENTE</div>
          <div className="noise-pop pop-3">RÁPIDO</div>

          {/* Panic Notification Badge */}
          <div className="noise-badge">99+</div>

          {/* ——— CONTEXT ANCHOR (Explains the chaos instantly) ——— */}
          <div className="concept__noise-context">
            <p className="context-label">La Realidad</p>
            <h3>¿Cuándo fue la última vez que tu mente estuvo en silencio?</h3>
          </div>

        </div>

        {/* ——— SILENCE / CURE LAYER ——— */}
        <div className="concept__silence">
          <div className="silence-content">
            <h2 className="concept__title">{conceptContent.title}</h2>
            <p className="concept__text">{conceptContent.text}</p>
            <div className="concept__divider" />
            <p className="concept__quote">{conceptContent.quote}</p>
          </div>
        </div>

        {/* Escape hint button */}
        <div className={`concept__escape-hint ${isSilent ? 'hidden' : ''}`}>
          <span>Sigue bajando para escapar</span>
          <div className="escape-arrow">↓</div>
        </div>

      </div>
    </section>
  );
}
