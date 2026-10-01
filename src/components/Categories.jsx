import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';
import catCeraArena from '../assets/images/cat-cera-arena.jpg';
import catSprays from '../assets/images/cat-sprays.png';
import catZen from '../assets/images/cat-jardin-zen.jpg';
import catTea from '../assets/images/cat-te-ceremonial.jpg';

const CATEGORIES = [
  { 
    id: 'velas', 
    title: 'Velas & Cera de Arena', 
    image: catCeraArena, 
    desc: 'Luz limpia y calidez sin límites. Cera perlada vegetal reutilizable con aromas puros.',
  },
  { 
    id: 'accesorios', 
    title: 'Accesorios & Jardín Zen', 
    image: catZen, 
    desc: 'Jardines zen en nogal macizo, cartas de intención diaria y vasijas de barro horneadas.',
  },
  { 
    id: 'aromas', 
    title: 'Aromas & Brumas', 
    image: catSprays, 
    desc: 'Home sprays botánicos, difusores mikado de ratán y aceites esenciales terapéuticos.',
  },
  { 
    id: 'te', 
    title: 'Tés & Ceremonias', 
    image: catTea, 
    desc: 'Blends botánicos orgánicos de hojas enteras para cultivar pausas conscientes y descanso.',
  }
];

export default function Categories({ onNavigate }) {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const navigate = useNavigate();

  const handleSelectCategory = (catId) => {
    if (onNavigate) {
      onNavigate('shop', null, catId);
    }
    navigate(`/tienda/${catId}`);
  };

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
              onClick={() => handleSelectCategory(cat.id)}
              style={{ cursor: 'pointer' }}
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
                      type="button"
                      className="btn btn--outline" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleSelectCategory(cat.id);
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
