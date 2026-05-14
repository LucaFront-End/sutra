import { useEffect, useRef, useState } from 'react';
import { rituals } from '../data/content';
import './Rituals.css';

export default function Rituals() {
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      
      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      
      let progress = -rect.top / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      wrapperRef.current.style.setProperty('--scroll-progress', progress);
      
      // Determine which ritual is active based on scroll progress
      // Total sections = Intro + Number of Rituals
      const totalSections = rituals.length + 1;
      const index = Math.floor(progress * totalSections) - 1;
      setActiveIndex(Math.max(-1, Math.min(rituals.length - 1, index)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="rituals-wrapper" id="rituales" ref={wrapperRef}>
      <div className={`rituals-sticky theme-${activeIndex}`}>
        
        {/* ——— ENVIRONMENTAL BACKGROUNDS (The WOW Factor) ——— */}
        <div className="rituals-environment">
          {/* Sun for Mañana (Theme 0) */}
          <div className={`env-sun ${activeIndex === 0 ? 'active' : ''}`} />
          {/* Moon for Noche (Theme 1) */}
          <div className={`env-moon ${activeIndex === 1 ? 'active' : ''}`} />
          {/* Wind sweeps for Limpieza (Theme 2) */}
          <div className={`env-wind ${activeIndex === 2 ? 'active' : ''}`} />
          {/* Golden Sparkles for Regalo (Theme 3) */}
          <div className={`env-sparkles ${activeIndex === 3 ? 'active' : ''}`} />
          {/* Starry Night for Dormir (Theme 4) */}
          <div className={`env-stars ${activeIndex === 4 ? 'active' : ''}`} />
        </div>

        {/* ——— DYNAMIC GOLDEN THREAD ——— */}
        <div className="rituals-thread-container">
           <div className="rituals-thread-base"></div>
        </div>

        {/* ——— THE HORIZONTAL TRACK ——— */}
        <div className="rituals-track">
          
          <div className="rituals-intro-block">
            <h2>El arte de<br/>tu ritual</h2>
            <p>Convierte la rutina en un momento sagrado. Desliza para explorar cómo transformar tu energía a lo largo del día.</p>
          </div>

          {/* Museum Cards */}
          {rituals.map((ritual, idx) => (
            <div className={`ritual-card ${activeIndex === idx ? 'focused' : ''}`} key={ritual.id}>
              
              {/* Massive Parallax Background Number */}
              <div className="ritual-card__parallax-number">0{idx + 1}</div>
              
              {/* Frosted Glass Content Panel */}
              <div className="ritual-card__glass">
                <div className="ritual-card__header">
                  <span className="ritual-card__time">{ritual.time}</span>
                  <span className="ritual-card__icon">{ritual.icon}</span>
                </div>
                <div className="ritual-card__content">
                  <h3 className="ritual-card__title">{ritual.name}</h3>
                  <p className="ritual-card__desc">{ritual.description}</p>
                  
                  {/* ——— E-COMMERCE CTA ——— */}
                  <div className="ritual-card__shop">
                    <div className="shop-info">
                      <span className="shop-label">Sugerencia</span>
                      <span className="shop-product">Kit Esencial {ritual.time}</span>
                    </div>
                    <button className="btn-ritual-shop">
                      Comprar <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
