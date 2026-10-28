import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storeCategories, allProducts } from '../data/shopData';
import { useWixProducts } from '../hooks/useWixProducts';
import { getTiendaBySlug } from '../lib/landingService';
import SEO from '../components/SEO';
import './Shop.css';
import './DynamicTienda.css';

export default function DynamicTienda({ onNavigate, onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [landing, setLanding] = useState(null);
  const [loadingLanding, setLoadingLanding] = useState(true);
  const [landingError, setLandingError] = useState(false);

  const [filter, setFilter] = useState('all');
  const [subFilter, setSubFilter] = useState(null);

  const { products: wixProducts, loading: wixLoading } = useWixProducts();

  // Load dynamic tienda data from Supabase/CSV
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    async function fetchTienda() {
      setLoadingLanding(true);
      setLandingError(false);

      try {
        const data = await getTiendaBySlug(slug);
        if (!isMounted) return;

        if (data) {
          setLanding(data);
          setLandingError(false);
        } else {
          setLandingError(true);
        }
      } catch (err) {
        console.error('[DynamicTienda] Error al cargar tienda:', err);
        if (isMounted) setLandingError(true);
      } finally {
        if (isMounted) setLoadingLanding(false);
      }
    }

    fetchTienda();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCategoryChange = (catId) => {
    setFilter(catId);
    setSubFilter(null);
  };

  const handleSubcategoryChange = (subId) => {
    setSubFilter(subId);
  };

  const handleProductClick = (product) => {
    if (product.category === 'suscripciones' || product.id?.includes('mystery')) {
      navigate('/mysterybox');
      return;
    }
    const productSlug = product.slug || product._wixId || product.id;
    if (onNavigate) onNavigate('product', product);
    navigate(`/producto/${productSlug}`);
  };

  // Dynamic catalog from Wix Stores / allProducts
  const catalog = (wixProducts && wixProducts.length > 0)
    ? wixProducts
    : allProducts;

  // Filter products logic
  const filteredProducts = catalog.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'accesorios') {
      if (!subFilter) return product.category === 'accesorios';
      return product.category === 'accesorios' && product.subcategory === subFilter;
    }
    if (filter === 'te' || filter === 'tes') {
      return product.category === 'te' || product.category === 'tes';
    }
    return product.category === filter;
  });

  const getCategoryCount = (catId) => {
    if (!catalog || catalog.length === 0) return 0;
    if (catId === 'all') return catalog.length;
    if (catId === 'te' || catId === 'tes') {
      return catalog.filter((p) => p.category === 'te' || p.category === 'tes').length;
    }
    return catalog.filter((p) => p.category === catId).length;
  };

  // Loading state
  if (loadingLanding) {
    return (
      <div className="shop-page fade-in">
        <header className="shop-header">
          <div className="skeleton-line shimmer" style={{ width: '220px', height: '14px', margin: '0 auto 1rem' }} />
          <div className="skeleton-line shimmer" style={{ width: '420px', height: '38px', margin: '0 auto 1rem' }} />
          <div className="skeleton-line shimmer" style={{ width: '500px', height: '20px', margin: '0 auto' }} />
        </header>
        <div className="shop-layout">
          <aside className="shop-filters">
            <div className="skeleton-line shimmer" style={{ width: '100%', height: '240px' }} />
          </aside>
          <main className="shop-grid-area">
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
          </main>
        </div>
      </div>
    );
  }

  // Not found fallback
  if (landingError || !landing) {
    return (
      <div className="shop-page fade-in">
        <div className="dynamic-tienda-not-found container">
          <span className="shop-tag">Sutra México</span>
          <h1 className="shop-title">Tienda Oficial no encontrada</h1>
          <p className="shop-subtitle">
            No pudimos localizar la tienda solicitada. Explora nuestro catálogo general con envíos a todo México.
          </p>
          <Link to="/tienda" className="btn-tienda-primary">
            Ir a la Tienda General
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic Store structured data (Store + WebPage schema)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: landing.tituloPagina || landing.titulo,
    description: landing.metadescripcion || landing.excerpt,
    url: `https://www.sutramexico.com/tiendas/${landing.slug}`,
    telephone: '+52 55 1234 5678',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: landing.ciudad || 'Ciudad de México',
      addressRegion: landing.estado || 'México',
      addressCountry: 'MX',
    },
    currenciesAccepted: 'MXN',
    paymentAccepted: 'Credit Card, Debit Card, MercadoPago, PayPal',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };

  return (
    <div className="shop-page fade-in dynamic-tienda-page">
      <SEO
        title={landing.tituloSeo || landing.tituloPagina}
        description={landing.metadescripcion || landing.excerpt}
        canonical={`https://www.sutramexico.com/tiendas/${landing.slug}`}
        type="website"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav className="dynamic-tienda-breadcrumbs" aria-label="Miga de pan">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/zonas" className="breadcrumb-link">Tiendas Oficiales</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{landing.ciudad || landing.tituloPagina}</span>
      </nav>

      {/* Shop Header adapted with dynamic Tienda Data */}
      <header className="shop-header dynamic-tienda-header">
        <span className="shop-tag">
          ✧ TIENDA OFICIAL SUTRA · {landing.ciudad ? `${landing.ciudad.toUpperCase()} · ${landing.estado?.toUpperCase() || 'MÉXICO'}` : 'MÉXICO'}
        </span>
        <h1 className="shop-title">{landing.tituloPagina || landing.titulo}</h1>
        <p className="shop-subtitle">{landing.excerpt}</p>

        {/* Narrative SEO Context Box */}
        {landing.parrafoSeo && (
          <div className="dynamic-tienda-seo-box">
            <p>{landing.parrafoSeo}</p>
          </div>
        )}
      </header>

      {/* Main Shop Layout identical to /tienda */}
      <div className="shop-layout">
        {/* Minimalist Sidebar Filters */}
        <aside className="shop-filters">
          <span className="filters-heading">Categorías</span>
          <ul className="filters-list">
            {storeCategories.map((cat) => (
              <li key={cat.id} className="filter-item">
                <button
                  className={`filter-btn ${(filter === cat.id || ((cat.id === 'te' || cat.id === 'tes') && (filter === 'te' || filter === 'tes'))) ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span className="filter-btn-label">{cat.label}</span>
                  {!wixLoading && catalog.length > 0 && (
                    <span className="filter-count-badge">({getCategoryCount(cat.id)})</span>
                  )}
                </button>

                {/* Subcategories for Accesorios */}
                {cat.id === 'accesorios' && filter === 'accesorios' && (
                  <ul className="subfilters-list">
                    <li>
                      <button
                        className={`subfilter-btn ${subFilter === null ? 'active' : ''}`}
                        onClick={() => handleSubcategoryChange(null)}
                      >
                        Todos los Objetos de Ritual
                      </button>
                    </li>
                    {cat.subcategories
                      .filter((sub) => catalog.some((p) => p.category === 'accesorios' && p.subcategory === sub.id))
                      .map((sub) => (
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

        {/* Product Grid Area */}
        <main className="shop-grid-area">
          <div className="shop-grid-header">
            <span className="products-count">
              {wixLoading ? (
                'Sincronizando santuario...'
              ) : (
                `Mostrando ${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'} en ${landing.ciudad || 'tienda'}`
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
