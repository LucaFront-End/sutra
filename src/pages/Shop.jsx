import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeCategories } from '../data/shopData';
import { useWixProducts } from '../hooks/useWixProducts';
import './Shop.css';

export default function Shop({ onNavigate, initialCategory = 'all', initialSubcategory = null, onAddToCart }) {
  const { category: routeCat, subcategory: routeSub } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState(routeCat || initialCategory || 'all');
  const [subFilter, setSubFilter] = useState(routeSub || initialSubcategory || null);
  const { products: wixProducts, loading: wixLoading } = useWixProducts();

  // Sync state if route parameters change
  useEffect(() => {
    if (routeCat) {
      setFilter(routeCat);
      setSubFilter(routeSub || null);
    } else if (initialCategory) {
      setFilter(initialCategory);
      setSubFilter(initialSubcategory);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [routeCat, routeSub, initialCategory, initialSubcategory]);

  const handleCategoryChange = (catId) => {
    setFilter(catId);
    setSubFilter(null);
    if (catId === 'all') {
      navigate('/tienda');
    } else {
      navigate(`/tienda/${catId}`);
    }
  };

  const handleSubcategoryChange = (subId) => {
    setSubFilter(subId);
    if (!subId) {
      navigate('/tienda/accesorios');
    } else {
      navigate(`/tienda/accesorios/${subId}`);
    }
  };

  const handleProductClick = (product) => {
    const slug = product.slug || product._wixId || product.id;
    if (onNavigate) onNavigate('product', product);
    navigate(`/producto/${slug}`);
  };

  // Strictly dynamic catalog from Wix Stores — no fallback flashing!
  const catalog = wixProducts || [];

  // Filter products logic
  const filteredProducts = catalog.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'accesorios') {
      if (!subFilter) return product.category === 'accesorios';
      return product.category === 'accesorios' && product.subcategory === subFilter;
    }
    return product.category === filter;
  });

  const getCategoryTitle = () => {
    if (filter === 'all') return 'La Colección Completa';
    if (filter === 'velas') return 'Velas & Rituales de Fuego';
    if (filter === 'accesorios') {
      if (subFilter === 'jardin-zen') return 'Accesorios · Jardín Zen';
      if (subFilter === 'cartas-rituales') return 'Accesorios · Cartas de Rituales';
      if (subFilter === 'vasijas') return 'Accesorios · Vasijas & Cerámica';
      return 'Accesorios & Herramientas Zen';
    }
    if (filter === 'aromas') return 'Aromas & Brumas Botánicas';
    if (filter === 'te') return 'Tés & Ceremonias de Presencia';
    return 'La Colección';
  };

  return (
    <div className="shop-page fade-in">
      <header className="shop-header">
        <span className="shop-tag">Tienda Sutra</span>
        <h1 className="shop-title">{getCategoryTitle()}</h1>
        <p className="shop-subtitle">
          Objetos y esencias creados para transformar momentos ordinarios en pausas extraordinarias.
        </p>
      </header>

      <div className="shop-layout">
        {/* Minimalist Sidebar Filters */}
        <aside className="shop-filters">
          <span className="filters-heading">Categorías</span>
          <ul className="filters-list">
            {storeCategories.map((cat) => (
              <li key={cat.id} className="filter-item">
                <button
                  className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>

                {/* Subcategories for Accesorios */}
                {cat.id === 'accesorios' && filter === 'accesorios' && (
                  <ul className="subfilters-list">
                    <li>
                      <button
                        className={`subfilter-btn ${subFilter === null ? 'active' : ''}`}
                        onClick={() => handleSubcategoryChange(null)}
                      >
                        Todos los accesorios
                      </button>
                    </li>
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          className={`subfilter-btn ${subFilter === sub.id ? 'active' : ''}`}
                          onClick={() => handleSubcategoryChange(sub.id)}
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <main className="shop-grid-area">
          <div className="shop-grid-header">
            <span className="products-count">
              {wixLoading ? (
                'Sincronizando santuario...'
              ) : (
                `Mostrando ${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`
              )}
            </span>
          </div>

          {wixLoading ? (
            <div className="shop-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="shop-skeleton-card">
                  <div className="skeleton-img-box shimmer" />
                  <div className="skeleton-info">
                    <div className="skeleton-line skeleton-tag shimmer" />
                    <div className="skeleton-line skeleton-title shimmer" />
                    <div className="skeleton-line skeleton-desc shimmer" />
                    <div className="skeleton-line skeleton-price shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <article 
                  className="shop-item" 
                  key={product._wixId || product.id}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="shop-item-img-wrap">
                    {product.tag && <span className="product-badge">{product.tag}</span>}
                    <img 
                      src={product.img || product.images?.[0]?.src || product.images?.[0]} 
                      alt={product.name} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/assets/images/cera-blanca.jpg';
                      }}
                    />
                    <div className="shop-item-hover">
                      <button 
                        className="btn-quick-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        Ver Ritual
                      </button>
                      {onAddToCart && (
                        <button 
                          className="btn-quick-add"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                        >
                          + Añadir
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="shop-item-info">
                    <span className="shop-item-mood">{product.emotionalName || 'Ritual Sutra'}</span>
                    <h3 className="shop-item-title">{product.name}</h3>
                    <p className="shop-item-desc">{product.shortDesc || product.description}</p>
                    <div className="shop-item-bottom">
                      <span className="shop-item-price">{product.price || `$${product.priceNum} MXN`}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!wixLoading && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No se encontraron productos en esta categoría.</p>
              <button onClick={() => handleCategoryChange('all')}>Ver todos los productos</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
