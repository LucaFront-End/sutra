import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allProducts } from '../data/shopData';
import './BestSellers.css';

// 4 real flagship best-seller products from allProducts
const featuredIds = ['p-vela-1', 'p-zen-1', 'p-vela-3', 'p-cartas-1'];

export default function BestSellers({ onNavigate, onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const bestSellersList = featuredIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);

  const handleProductClick = (item) => {
    const slug = item.slug || item._wixId || item.id;
    if (onNavigate) onNavigate('product', item);
    navigate(`/producto/${slug}`);
  };

  return (
    <section className="bestsellers" id="shop">
      <div className="bestsellers__container">
        
        <div className="bestsellers__header">
          <span className="section-tag">Sutra Essentials</span>
          <h2>Lo más elegido</h2>
        </div>

        <div className="bestsellers__accordion">
          {bestSellersList.map((item, idx) => {
            const isActive = activeIndex === idx;
            const itemImage = item.img || item.images?.[0]?.src || item.images?.[0];
            
            return (
              <div 
                key={item.id}
                className={`bs-drawer ${isActive ? 'is-open' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Always visible horizontal row */}
                <div 
                  className="bs-drawer__header"
                  onClick={() => handleProductClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="bs-drawer__col-tag">
                    <span className="bs-tag">{item.tag || 'Favorito'}</span>
                  </div>
                  <div className="bs-drawer__col-name">
                    <h3>{item.name}</h3>
                  </div>
                  <div className="bs-drawer__col-price">
                    <span>{item.price}</span>
                  </div>
                </div>

                {/* Expanding Quick Shop Content */}
                <div className="bs-drawer__content-wrapper">
                  <div className="bs-drawer__content">
                    
                    {/* Left: Product Image Showcase */}
                    <div 
                      className="bs-drawer__image"
                      onClick={() => handleProductClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={itemImage} alt={item.name} />
                      <div className="bs-drawer__image-overlay">
                        <span className="emotional-name">{item.emotionalName}</span>
                      </div>
                    </div>
                    
                    {/* Right: Quick Shop UI Panel */}
                    <div className="bs-drawer__shop">
                      <div className="bs-rating">
                        ★★★★★ <span>({item.rating || 4.9}/5) · {item.reviewCount || 38} Reseñas</span>
                      </div>
                      <p className="bs-desc">{item.description}</p>
                      
                      <div className="bs-actions">
                        <button 
                          className="btn-add-to-cart"
                          onClick={() => handleProductClick(item)}
                        >
                          Personalizar & Configurar — {item.price}
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
