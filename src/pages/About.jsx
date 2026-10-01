import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import imgLifestyle from '../assets/images/hero-lifestyle.png';
import imgZenDetalle from '../assets/images/jardin-zen-detalle.jpg';
import imgVasijas from '../assets/images/vasijas.jpg';
import imgTeaLata from '../assets/images/cat-te-ceremonial.jpg';
import imgBanquetes from '../assets/images/eventos-banquetes.jpg';

export default function About({ onNavigate }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGo = (path, state) => {
    if (onNavigate) {
      if (path === '/tienda') onNavigate('shop');
      else if (path === '/eventos') onNavigate('events');
      else onNavigate(path);
    }
    navigate(path, { state });
  };

  return (
    <div className="about-page fade-in">
      {/* 1. Hero Manifesto */}
      <section className="about-hero">
        <div className="about-hero__container">
          <span className="about-tag">Filosofía & Origen</span>
          <h1 className="about-title">El lujo de pausar en un mundo apresurado.</h1>
          <p className="about-subtitle">
            Sutra nace de una necesidad urgente y compartida: recuperar la calma cotidiana como un hábito sagrado.
            Diseñamos objetos sensoriales y herramientas de bienestar creadas para que cada respiración cuente.
          </p>
        </div>
      </section>

      {/* 2. Visual Collage & Story */}
      <section className="about-narrative container">
        <div className="about-narrative__grid">
          <div className="narrative-media">
            <img src={imgLifestyle} alt="Sutra Santuario Cotidiano" className="narrative-img-main" />
            <div className="narrative-badge">
              <span>✧ Artesanal · México</span>
            </div>
          </div>
          <div className="narrative-text">
            <span className="section-eyebrow">Nuestra Historia</span>
            <h2 className="narrative-heading">Menos ruido. Más presencia.</h2>
            <p>
              Vivimos inmersos en notificaciones interminables, calendarios saturados y una prisa constante. 
              En medio de esa aceleración, olvidamos que habitar el presente es nuestro derecho más vital.
            </p>
            <p>
              En Sutra concebimos cada objeto no como un artículo decorativo convencional, sino como un puente 
              hacia ti mismo. Desde el suave trazo de un rastrillo sobre arena mineral hasta la flama hipnótica 
              de una mecha de algodón orgánico, todo está concebido para devolverte a tu propio centro.
            </p>
            <div className="narrative-quote-box">
              <p className="quote-text">
                "No se trata de escapar del mundo, sino de regresar a él con mayor serenidad y claridad mental."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Elemental Pillars */}
      <section className="about-pillars">
        <div className="container">
          <div className="pillars-header">
            <span className="about-tag">Los Cuatro Elementos</span>
            <h2 className="pillars-title">Alquimia para los sentidos</h2>
            <p className="pillars-desc">
              Cada creación Sutra dialoga con una fuerza elemental para restablecer la armonía interior.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Fuego */}
            <article className="pillar-card">
              <div className="pillar-icon">🔥</div>
              <h3 className="pillar-name">Fuego · Transformación</h3>
              <p className="pillar-body">
                Velas de cera vegetal perlada de combustión limpia y reutilizable. Flamas continuas que purifican 
                el ambiente y crean un santuario íntimo de descanso al caer la noche.
              </p>
            </article>

            {/* Tierra */}
            <article className="pillar-card">
              <div className="pillar-icon">🌎</div>
              <h3 className="pillar-name">Tierra · Equilibrio</h3>
              <p className="pillar-body">
                Jardines Zen torneados en madera maciza y vasijas wabi-sabi en cerámica de alta temperatura. 
                Texturas minerales que anclan tu cuerpo y pacifican el torrente de pensamientos.
              </p>
            </article>

            {/* Aire */}
            <article className="pillar-card">
              <div className="pillar-icon">🌬️</div>
              <h3 className="pillar-name">Aire · Libertad</h3>
              <p className="pillar-body">
                Esencias botánicas puras y brumas aromaterapéuticas. Moléculas olfativas vivas que viajan directo 
                a tus emociones para despejar la saturación cognitiva.
              </p>
            </article>

            {/* Agua */}
            <article className="pillar-card">
              <div className="pillar-icon">💧</div>
              <h3 className="pillar-name">Agua · Fluidez</h3>
              <p className="pillar-body">
                Ceremonias botánicas de té de hojas enteras y tisanas adaptógenas. El calor reconfortante de la 
                taza en tus manos para soltar la resistencia y habitar el fluir natural.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Artisanal Workshop in Mexico */}
      <section className="about-craft container">
        <div className="craft-grid">
          <div className="craft-text">
            <span className="section-eyebrow">Manos de Maestro</span>
            <h2 className="craft-heading">Artesanía mexicana y devoción por el detalle</h2>
            <p>
              Colaboramos con maestros alfareros y carpinteros tradicionales en México. Cada bandeja de bambú, 
              cada vasija de barro refractario y cada mezcla aromática es creada en pequeñas partidas éticas 
              con dedicación y paciencia.
            </p>
            <ul className="craft-checklist">
              <li>
                <span className="check-icon">✦</span>
                <span><strong>100% Ceras Botánicas:</strong> Cero parafinas, derivados de petróleo o aditivos sintéticos.</span>
              </li>
              <li>
                <span className="check-icon">✦</span>
                <span><strong>Sustentabilidad Circular:</strong> Recipientes rellenables que perduran por generaciones.</span>
              </li>
              <li>
                <span className="check-icon">✦</span>
                <span><strong>Comercio Justo:</strong> Reconocimiento digno a las familias de artesanos que dan vida a Sutra.</span>
              </li>
            </ul>
          </div>
          <div className="craft-gallery">
            <div className="craft-img-wrap img-wrap-1">
              <img src={imgZenDetalle} alt="Detalle Jardín Zen" />
            </div>
            <div className="craft-img-wrap img-wrap-2">
              <img src={imgVasijas} alt="Vasijas Cerámica Artesanal" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Invitation CTA */}
      <section className="about-cta">
        <div className="about-cta__box container">
          <span className="about-tag">Empieza tu Ritual</span>
          <h2 className="about-cta__title">Tu pausa comienza hoy.</h2>
          <p className="about-cta__text">
            Descubre nuestra colección completa o acompáñanos en uno de nuestros próximos talleres presenciales en CDMX.
          </p>
          <div className="about-cta__actions">
            <button className="btn-about-primary" onClick={() => handleGo('/tienda')}>
              Ver Tienda Sutra
            </button>
            <button className="btn-about-secondary" onClick={() => handleGo('/eventos')}>
              Talleres & Eventos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
