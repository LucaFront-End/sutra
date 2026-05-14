import { useState } from 'react';
import { bestSellers } from '../data/content';
import './BestSellers.css';

// Usamos las imágenes premium generadas anteriormente para máximo impacto
import imgZen from '../assets/images/cat-difusores.png';
import imgVelaGrande from '../assets/images/cat-velas.png';
import imgVelaChica from '../assets/images/cat-sprays.png';
import imgCera from '../assets/images/cat-aceites.png';

const premiumImages = [imgZen, imgVelaGrande, imgVelaChica, imgCera];

export default function BestSellers() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bestsellers" id="shop">
      <div className="bestsellers__container">
        
        <div className="bestsellers__header">
          <span className="section-tag">Sutra Essentials</span>
          <h2>Lo más elegido</h2>
        </div>

        <div className="bestsellers__accordion">
          {bestSellers.map((item, idx) => {
            const isActive = activeIndex === idx;
            const itemImage = premiumImages[idx];
            
            return (
              <div 
                key={item.id}
                className={`bs-drawer ${isActive ? 'is-open' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Always visible horizontal row */}
                <div className="bs-drawer__header">
                  <div className="bs-drawer__col-tag">
                    <span className="bs-tag">{item.tag}</span>
                  </div>
                  <div className="bs-drawer__col-name">
                    <h3>{item.name}</h3>
                  </div>
                  <div className="bs-drawer__col-price">
                    <span>${item.price} MXN</span>
                  </div>
                </div>

                {/* Expanding Quick Shop Content */}
                <div className="bs-drawer__content-wrapper">
                  <div className="bs-drawer__content">
                    
                    {/* Left: Product Image Showcase */}
                    <div className="bs-drawer__image">
                      <img src={itemImage} alt={item.name} />
                      <div className="bs-drawer__image-overlay">
                        <span className="emotional-name">{item.emotionalName}</span>
                      </div>
                    </div>
                    
                    {/* Right: Quick Shop UI Panel */}
                    <div className="bs-drawer__shop">
                      <div className="bs-rating">
                        ★★★★★ <span>(4.9/5) - 128 Reviews</span>
                      </div>
                      <p className="bs-desc">{item.description}</p>
                      
                      <div className="bs-actions">
                        <div className="bs-qty">
                          <button aria-label="Decrease">-</button>
                          <span>1</span>
                          <button aria-label="Increase">+</button>
                        </div>
                        <button className="btn-add-to-cart">
                          Añadir al carrito — ${item.price}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
