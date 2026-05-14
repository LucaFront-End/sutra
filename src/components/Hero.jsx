import { useState, useEffect, useRef } from 'react';
import moodDescanso from '../assets/images/sutra-descanso.png';
import moodEnfoque from '../assets/images/sutra-enfoque.png';
import moodCalma from '../assets/images/sutra-calma.png';
import moodEnergia from '../assets/images/sutra-energia.png';
import './Hero.css';

const MOODS = [
  { 
    id: 'descanso', 
    label: 'Descanso', 
    image: moodDescanso, 
    title: 'La paz de la noche.', 
    subtitle: 'Prepara tu mente y cuerpo para un descanso profundo y reparador.',
    overlay: 'rgba(10, 5, 20, 0.85)' /* Super dark violet/black */
  },
  { 
    id: 'enfoque', 
    label: 'Enfoque', 
    image: moodEnfoque, 
    title: 'Claridad mental.', 
    subtitle: 'Despierta tus sentidos y centra tu atención en el presente.',
    overlay: 'rgba(10, 15, 10, 0.8)' /* Super dark green/black */
  },
  { 
    id: 'calma', 
    label: 'Calma', 
    image: moodCalma, 
    title: 'Regresa al centro.', 
    subtitle: 'Encuentra el equilibrio y la quietud en medio del caos.',
    overlay: 'rgba(20, 15, 10, 0.85)' /* Super dark brown/black */
  },
  { 
    id: 'energia', 
    label: 'Energía', 
    image: moodEnergia, 
    title: 'Renueva tu vitalidad.', 
    subtitle: 'Llena tu espacio de luz y notas vibrantes para comenzar el día.',
    overlay: 'rgba(30, 15, 5, 0.75)' /* Dark warm umber */
  }
];

// Magnetic Button Component for that ultra-premium UX feel
function MagneticPill({ children, isActive, onMouseEnter, onMouseLeave, onClick }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Calculate distance from center of button
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25; // 25% magnetic pull
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = (e) => {
    setPosition({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      ref={ref}
      className={`mood-pill ${isActive ? 'mood-pill--active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </button>
  );
}

// Atmospheric Particles customized per mood
function AtmosphericParticles({ mood }) {
  if (!mood) return null;
  
  return (
    <div className={`hero__particles hero__particles--${mood}`}>
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle" style={{ '--i': i, '--rnd': Math.random() }} />
      ))}
    </div>
  );
}

export default function Hero() {
  const [activeMood, setActiveMood] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Track global mouse for subtle parallax background
  const handleGlobalMouseMove = (e) => {
    if (!heroRef.current) return;
    const { innerWidth, innerHeight } = window;
    // Normalized coordinates from -1 to 1
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  return (
    <section 
      className="hero hero-moods" 
      id="hero" 
      ref={heroRef}
      onMouseMove={handleGlobalMouseMove}
    >
      {/* ——— Background Layers with Parallax ——— */}
      <div 
        className="hero__backgrounds"
        style={{
          transform: `translate(${mousePos.x * -1.5}%, ${mousePos.y * -1.5}%) scale(1.05)`
        }}
      >
        {/* Default neutral background */}
        <div className={`hero__bg hero__bg--default ${!activeMood ? 'visible' : ''}`} />
        
        {/* Dynamic mood backgrounds */}
        {MOODS.map(mood => (
          <div 
            key={`bg-${mood.id}`}
            className={`hero__bg ${activeMood === mood.id ? 'visible' : ''}`}
          >
            <img src={mood.image} alt={mood.label} className="hero__bg-img" />
            <div className="hero__bg-overlay" style={{ background: mood.overlay }} />
          </div>
        ))}
      </div>

      {/* ——— Cinematic Text Protection Vignette ——— */}
      {/* This ensures the question is ALWAYS readable regardless of background brightness */}
      <div className="hero__text-protection" />
      <div className="hero__bottom-protection" />

      {/* ——— Atmospheric Particles ——— */}
      <AtmosphericParticles mood={activeMood} />

      {/* ——— Content ——— */}
      <div 
        className={`hero__content container ${isLoaded ? 'hero__content--loaded' : ''}`}
        onMouseLeave={() => setActiveMood(null)}
      >
        
        {/* Main Question */}
        <h1 className={`hero__question ${activeMood ? 'hero__question--shifted' : ''}`}>
          ¿Qué necesitas hoy?
        </h1>

        {/* Magnetic Mood Pills */}
        <div className="hero__pills">
          {MOODS.map(mood => (
            <MagneticPill
              key={mood.id}
              isActive={activeMood === mood.id}
              onMouseEnter={() => setActiveMood(mood.id)}
              onClick={() => window.location.href = '#rituales'}
            >
              {mood.label}
            </MagneticPill>
          ))}
        </div>

        {/* Dynamic Text Reveal */}
        <div className="hero__dynamic-area">
          {MOODS.map(mood => (
            <div 
              key={`text-${mood.id}`}
              className={`hero__dynamic-text ${activeMood === mood.id ? 'visible' : ''}`}
            >
              <h2>{mood.title}</h2>
              <p>{mood.subtitle}</p>
              <a href="#rituales" className="btn btn--outline">Descubrir Ritual</a>
            </div>
          ))}
          
          {/* Helper hint when no mood is selected */}
          <div className={`hero__hint ${!activeMood ? 'visible' : ''}`}>
            Desliza sobre las opciones para explorar
          </div>
        </div>

      </div>

      {/* ——— Scroll indicator ——— */}
      <div className={`hero__scroll-hint ${!activeMood ? 'visible' : ''}`}>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  );
}
