import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogArticles, allProducts } from '../data/shopData';
import { useCart } from '../context/CartContext';
import './BlogPost.css';

export default function BlogPost({ onNavigate }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find article by slug or fallback
  const article = blogArticles.find((a) => a.id === slug) || blogArticles[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!article) {
    return (
      <div className="blog-post-page container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Publicación no encontrada</h2>
        <p>El artículo que buscas no existe o ha sido reubicado.</p>
        <button onClick={() => navigate('/blog')} className="blog-back-btn">
          ← Volver al Diario Sutra
        </button>
      </div>
    );
  }

  // Related products tailored to article topic
  const getRelatedProducts = (id) => {
    let ids = ['p-vela-1', 'p-vela-2', 'p-dif-1'];
    if (id === 'arte-de-pausar') ids = ['p-vela-1', 'p-vela-2', 'p-dif-1'];
    else if (id === 'ritual-jardin-zen') ids = ['p-zen-1', 'p-cartas-1', 'p-vela-1'];
    else if (id === 'ceremonia-del-te') ids = ['p-tea-1', 'p-tea-2', 'p-vasija-1'];
    else if (id === 'cartas-de-intencion') ids = ['p-cartas-1', 'p-spray-1', 'p-zen-1'];

    const matches = allProducts.filter((p) => ids.includes(p.id));
    return matches.length > 0 ? matches : allProducts.slice(0, 3);
  };

  const relatedProducts = getRelatedProducts(article.id);
  const otherArticles = blogArticles.filter((a) => a.id !== article.id).slice(0, 3);

  const handleBuyNow = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedId(null), 2200);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Te comparto este ritual de Sutra México: "${article.title}" — ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="blog-post-page fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="blog-post-nav container">
        <div className="blog-post-breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="crumb-sep">/</span>
          <Link to="/blog">Diario Sutra</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{article.category}</span>
        </div>

        <Link to="/blog" className="blog-post-back-link">
          ← Volver a publicaciones
        </Link>
      </div>

      {/* Article Header */}
      <header className="blog-post-header container">
        <span className="blog-post-cat-pill">{article.category}</span>
        <h1 className="blog-post-title">{article.title}</h1>
        <p className="blog-post-lead">{article.excerpt}</p>

        <div className="blog-post-meta-row">
          <div className="blog-author-info">
            <div className="blog-author-avatar">✦</div>
            <div>
              <strong className="blog-author-name">Equipo Editorial Sutra</strong>
              <small className="blog-author-date">
                {article.date} · {article.readTime}
              </small>
            </div>
          </div>

          <div className="blog-share-tools">
            <button
              type="button"
              className="blog-share-btn"
              onClick={handleShareWhatsApp}
              title="Compartir por WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.971.53 1.761.813 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.182-2.585-5.769-5.77-5.771zm3.392 8.234c-.143.403-.717.74-1.026.786-.299.043-.687.072-2.001-.47-1.68-.692-2.756-2.42-2.84-2.532-.083-.112-.68-1.037-.68-1.977 0-.94.492-1.401.667-1.593.175-.192.38-.24.507-.24.127 0 .254.001.365.006.118.006.277-.045.433.332.162.391.554 1.353.603 1.452.049.099.082.215.016.347-.066.132-.099.214-.198.33-.099.116-.208.259-.297.348-.1.099-.204.207-.088.406.116.199.514.848 1.103 1.372.759.675 1.399.884 1.597.983.198.099.314.083.43-.05.116-.133.497-.579.629-.778.132-.199.264-.165.446-.099.182.066 1.157.546 1.355.645.198.099.33.149.379.232.049.083.049.48-.094.883z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.65 0-3.18-.46-4.49-1.258l-.32-.193-2.955.775.789-2.88-.21-.334A8.146 8.146 0 013.818 12c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.182 3.67 8.182 8.182 0 4.512-3.67 8.182-8.182 8.182z" />
              </svg>
              <span>Compartir</span>
            </button>
            <button
              type="button"
              className="blog-share-btn"
              onClick={handleCopyLink}
              title="Copiar enlace"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copiedLink ? '¡Copiado!' : 'Enlace'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Cover Photo */}
      <div className="blog-post-cover container">
        <div className="blog-cover-frame">
          <img src={article.image} alt={article.title} />
          <span className="blog-cover-badge">✦ Ritual Guiado Sutra</span>
        </div>
      </div>

      {/* Two Column Layout: Article Body + Fixed Sticky Right Sidebar of Products */}
      <div className="blog-post-layout container">
        {/* Left Column: Full Editorial Body */}
        <article className="blog-post-article">
          <div className="blog-article-content">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'lead-paragraph' : ''}>
                {paragraph}
              </p>
            ))}

            {/* Editorial Ritual Quote Box */}
            <div className="blog-quote-box">
              <span className="quote-spark">“</span>
              <p className="quote-text">
                El verdadero bienestar no es un destino al que llegas; es el espacio de silencio que
                te permites habitar entre una acción y la siguiente.
              </p>
              <span className="quote-author">— Filosofía Sutra México</span>
            </div>

            {/* Ritual Steps / Guidance */}
            <div className="blog-ritual-guide-box">
              <h3 className="guide-title">
                <span>✦</span> Pasos para integrar este ritual hoy
              </h3>
              <ol className="guide-steps">
                <li>
                  <strong>Prepara tu entorno:</strong> Disminuye las luces artificiales intensas y
                  enciende tu vela o difusor 10 minutos antes de comenzar.
                </li>
                <li>
                  <strong>Desconecta estímulos:</strong> Deja el teléfono en otra habitación o en modo
                  silencio absoluto.
                </li>
                <li>
                  <strong>Ancla tus sentidos:</strong> Siente la temperatura de tu taza o la textura de
                  la arena y respira en 4 tiempos de forma continua.
                </li>
              </ol>
            </div>

            {/* Author Footer Card */}
            <div className="blog-author-bio-card">
              <div className="bio-brand-seal">SUTRA</div>
              <div className="bio-text">
                <h4>Sutra México · Diario Consciente</h4>
                <p>
                  Artículos curados para inspirar pausas conscientes, bienestar botánico y la creación
                  de atmósferas sagradas en tu día a día.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Right Column: FIXED / STICKY STRIP of Products to Buy Now */}
        <aside className="blog-sticky-sidebar">
          <div className="sidebar-sticky-inner">
            <div className="sidebar-header">
              <span className="sidebar-eyebrow">✦ RITUAL RELACIONADO</span>
              <h3 className="sidebar-title">Lleva este ritual a tu hogar</h3>
              <p className="sidebar-sub">Piezas recomendadas para recrear esta experiencia ahora mismo:</p>
            </div>

            <div className="sidebar-products-list">
              {relatedProducts.map((prod) => {
                const isAdded = addedId === prod.id;
                return (
                  <div key={prod.id} className="sidebar-prod-card">
                    <div
                      className="sidebar-prod-media"
                      onClick={() => navigate(`/producto/${prod.id}`)}
                    >
                      <img src={prod.img} alt={prod.name} />
                      <span className="sidebar-prod-tag">{prod.tag || 'Ritual'}</span>
                    </div>

                    <div className="sidebar-prod-details">
                      <span className="sidebar-prod-cat">{prod.category}</span>
                      <h4
                        className="sidebar-prod-name"
                        onClick={() => navigate(`/producto/${prod.id}`)}
                      >
                        {prod.name}
                      </h4>
                      <div className="sidebar-prod-price-row">
                        <span className="sidebar-prod-price">{prod.price}</span>
                      </div>

                      <button
                        type="button"
                        className={`sidebar-buy-now-btn ${isAdded ? 'is-added' : ''}`}
                        onClick={(e) => handleBuyNow(prod, e)}
                        id={`btn-comprar-${prod.id}`}
                      >
                        {isAdded ? (
                          <>
                            <span className="btn-check">✓</span>
                            <span>¡Agregado a la Bolsa!</span>
                          </>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            <span>Comprar ahora</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Trust Perks */}
            <div className="sidebar-trust-box">
              <div className="trust-item">
                <span>🌿</span>
                <small>Cera 100% vegetal sin parafinas</small>
              </div>
              <div className="trust-item">
                <span>📦</span>
                <small>Envío gratis en compras +$1,500 MXN</small>
              </div>
              <div className="trust-item">
                <span>✨</span>
                <small>Hecho artesanalmente en México</small>
              </div>
            </div>

            <button
              type="button"
              className="sidebar-view-all-shop-btn"
              onClick={() => navigate('/tienda')}
            >
              Explorar toda la tienda Sutra →
            </button>
          </div>
        </aside>
      </div>

      {/* ============================================================
          BOTTOM SECTION 1: COMPRA LOS PRODUCTOS DEL ARTÍCULO
          ============================================================ */}
      <section className="blog-bottom-products-section">
        <div className="container">
          <div className="bottom-section-head text-center">
            <span className="bottom-section-tag">✦ El Set del Ritual</span>
            <h2>Elementos esenciales para esta experiencia</h2>
            <p>Piezas puras formuladas para transformar tu atmósfera cotidiana.</p>
          </div>

          <div className="bottom-products-grid">
            {relatedProducts.map((prod) => {
              const isAdded = addedId === prod.id;
              return (
                <div key={prod.id} className="bottom-prod-card">
                  <div
                    className="bottom-prod-img-wrap"
                    onClick={() => navigate(`/producto/${prod.id}`)}
                  >
                    <img src={prod.img} alt={prod.name} />
                    <span className="bottom-prod-badge">{prod.emotionalName || prod.tag}</span>
                  </div>

                  <div className="bottom-prod-content">
                    <span className="bottom-prod-cat">{prod.category}</span>
                    <h3
                      className="bottom-prod-title"
                      onClick={() => navigate(`/producto/${prod.id}`)}
                    >
                      {prod.name}
                    </h3>
                    <p className="bottom-prod-desc">{prod.shortDesc}</p>

                    <div className="bottom-prod-foot">
                      <span className="bottom-prod-price">{prod.price}</span>
                      <button
                        type="button"
                        className={`bottom-prod-btn ${isAdded ? 'is-added' : ''}`}
                        onClick={(e) => handleBuyNow(prod, e)}
                      >
                        {isAdded ? '✓ En el carrito' : 'Comprar ahora'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM SECTION 2: OTROS ARTÍCULOS DEL DIARIO SUTRA
          ============================================================ */}
      <section className="blog-bottom-articles-section">
        <div className="container">
          <div className="bottom-section-head text-center">
            <span className="bottom-section-tag">✦ Sigue Leyendo</span>
            <h2>Otras publicaciones del Diario Sutra</h2>
            <p>Explora más rituales, guías y notas olfativas de nuestra comunidad.</p>
          </div>

          <div className="bottom-articles-grid">
            {otherArticles.map((item) => (
              <article
                key={item.id}
                className="bottom-article-card"
                onClick={() => navigate(`/blog/${item.id}`)}
              >
                <div className="bottom-article-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="bottom-article-pill">{item.category}</span>
                </div>

                <div className="bottom-article-body">
                  <div className="bottom-article-meta">
                    <span>{item.date}</span>
                    <span>·</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3 className="bottom-article-title">{item.title}</h3>
                  <p className="bottom-article-excerpt">{item.excerpt}</p>
                  <div className="bottom-article-cta">
                    <span>Leer ritual</span>
                    <span className="cta-arrow">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="bottom-all-articles-wrap text-center">
            <button
              type="button"
              className="bottom-all-articles-btn"
              onClick={() => navigate('/blog')}
            >
              ← Volver a todos los artículos del Diario
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
