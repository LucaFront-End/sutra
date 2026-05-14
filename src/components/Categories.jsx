import { useState } from 'react';
import './Categories.css';
import catVelas from '../assets/images/cat-velas.png';
import catSprays from '../assets/images/cat-sprays.png';
import catAceites from '../assets/images/cat-aceites.png';
import catDifusores from '../assets/images/cat-difusores.png';

const CATEGORIES = [
  { 
    id: 'velas', 
    title: 'Velas Aromáticas', 
    image: catVelas, 
    desc: 'Luz y calidez para tus espacios. Cera de soja vertida a mano con aromas exclusivos.',
    href: '#velas'
  },
  { 
    id: 'sprays', 
    title: 'Home Sprays', 
    image: catSprays, 
    desc: 'Frescura instantánea en el aire. Transforma la energía de tu ambiente con un solo toque.',
    href: '#sprays'
  },
  { 
    id: 'aceites', 
    title: 'Aceites Esenciales', 
    image: catAceites, 
    desc: 'Gotas de bienestar puro. Extractos botánicos puros para equilibrar tu energía.',
    href: '#aceites'
  },
  { 
    id: 'difusores', 
    title: 'Difusores', 
    image: catDifusores, 
    desc: 'Aromaterapia continua y objetos de diseño minimalista para complementar tu ritual.',
    href: '#difusores'
  }
];

export default function Categories() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);

  return (
    <section className="categories-accordion" id="colecciones">
      <div className="accordion-container">
        {CATEGORIES.map((cat) => {
          const isActive = activeId === cat.id;
          
          return (
            <div 
              key={cat.id} 
              className={`accordion-item ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveId(cat.id)}
              onClick={() => { if(isActive) window.location.href = cat.href; }}
            >
              {/* Cinematic Background Image */}
              <div className="accordion-bg">
                <img src={cat.image} alt={cat.title} />
                <div className="accordion-overlay" />
              </div>
              
              <div className="accordion-content">
                {/* Vertical title for inactive state */}
                <div className="title-vertical-wrapper">
                  <h3 className="title-vertical">{cat.title}</h3>
                </div>
                
                {/* Full content for active state */}
                <div className="content-active">
                  <div className="content-active__inner">
                    <h2>{cat.title}</h2>
                    <p>{cat.desc}</p>
                    <button 
                      className="btn btn--outline" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        window.location.href = cat.href; 
                      }}
                    >
                      Explorar Colección
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
