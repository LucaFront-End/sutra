import { useState, useEffect } from 'react';
import { getUserOrders, addCustomerReview, getAllStoredReviews, voteHelpful } from '../lib/reviewsService';
import './Account.css';

export default function Account({ onNavigate, onAddToCart }) {
  // Main view tab: 'orders' | 'reviews' | 'profile'
  const [activeTab, setActiveTab] = useState('orders');

  const DEFAULT_USER = {
    name: 'Sofía Valenzuela',
    email: 'sofia.valenzuela@sutra.mx',
    phone: '+52 55 4892 1034',
    address: 'Av. Horacio 1420, Polanco, CDMX',
    subscription: 'Suscripción Activa: Ritual Completo (Bimestral)',
  };

  // Customer session state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('sutra_customer_logged_in');
      return savedAuth !== null ? JSON.parse(savedAuth) : true;
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sutra_customer_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Orders list
  const [orders, setOrders] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  // Active review form state for a specific order
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [submittedOrderSuccess, setSubmittedOrderSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Profile edit state
  const [profileForm, setProfileForm] = useState(currentUser);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Auth form state (when logged out)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState('');

  // Load orders & reviews on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = () => {
      setOrders(getUserOrders());
      setAllReviews(getAllStoredReviews());
    };
    load();

    const handleOrdersChange = () => load();
    const handleReviewChange = () => load();

    window.addEventListener('sutra-orders-updated', handleOrdersChange);
    window.addEventListener('sutra-review-added', handleReviewChange);
    return () => {
      window.removeEventListener('sutra-orders-updated', handleOrdersChange);
      window.removeEventListener('sutra-review-added', handleReviewChange);
    };
  }, []);

  // Sync session state to localStorage
  const handleLogin = (userObj) => {
    setIsLoggedIn(true);
    localStorage.setItem('sutra_customer_logged_in', JSON.stringify(true));
    if (userObj) {
      setCurrentUser(userObj);
      setProfileForm(userObj);
      localStorage.setItem('sutra_customer_profile_v1', JSON.stringify(userObj));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('sutra_customer_logged_in', JSON.stringify(false));
  };

  // Handle open review form for an order
  const handleOpenReview = (order) => {
    setReviewingOrder(order);
    setRating(order.reviewRating || 5);
    setReviewTitle(order.reviewTitle || '');
    setReviewComment(order.reviewComment || '');
    setFormError('');
    setTimeout(() => {
      const el = document.getElementById('account-review-composer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Submit review for an order
  const handleSubmitOrderReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setFormError('Por favor comparte tu experiencia en el comentario.');
      return;
    }
    setFormError('');

    addCustomerReview({
      productId: reviewingOrder.productId,
      slug: reviewingOrder.slug,
      productName: reviewingOrder.productName,
      author: currentUser.name,
      authorEmail: currentUser.email,
      rating,
      title: reviewTitle.trim() || 'Experiencia transformadora y artesanal',
      comment: reviewComment.trim(),
      variant: reviewingOrder.productVariant || 'Compra en Línea',
      orderId: reviewingOrder.orderId,
    });

    const targetOrderId = reviewingOrder.orderId;
    setSubmittedOrderSuccess(targetOrderId);
    setReviewingOrder(null);

    // Refresh orders and reviews
    setOrders(getUserOrders());
    setAllReviews(getAllStoredReviews());

    setTimeout(() => {
      setSubmittedOrderSuccess(null);
    }, 4000);
  };

  // Handle profile form save
  const handleProfileSave = (e) => {
    e.preventDefault();
    setCurrentUser(profileForm);
    localStorage.setItem('sutra_customer_profile_v1', JSON.stringify(profileForm));
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  // Handle auth submit
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Por favor completa todos los campos.');
      return;
    }
    setAuthError('');
    setAuthSuccess(true);

    setTimeout(() => {
      setAuthSuccess(false);
      const loggedUser = {
        name: authName.trim() || 'Sofía Valenzuela',
        email: authEmail.trim(),
        phone: currentUser.phone,
        address: currentUser.address,
        subscription: currentUser.subscription,
      };
      handleLogin(loggedUser);
      setActiveTab('orders');
    }, 1000);
  };

  // Demo Login helper
  const handleDemoLogin = () => {
    handleLogin(DEFAULT_USER);
    setActiveTab('orders');
  };

  // Rating label helper
  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Experiencia sublime · Calidad artesanal insuperable';
      case 4: return 'Muy bueno · Muy satisfecho';
      case 3: return 'Bueno · Cumple su función';
      case 2: return 'Regular';
      case 1: return 'Insatisfecho';
      default: return '';
    }
  };

  // Helpful vote
  const handleVoteHelpful = (revId) => {
    voteHelpful(revId);
    setAllReviews(getAllStoredReviews());
  };

  const reviewedOrders = orders.filter((o) => o.hasReview);

  return (
    <div className="account-page">
      {/* Page Header / Breadcrumb */}
      <section className="account-header">
        <div className="account-container">
          <nav className="account-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('/')} className="account-breadcrumb-link">
              Inicio
            </button>
            <span className="account-breadcrumb-sep">/</span>
            <span className="account-breadcrumb-current">Mi Cuenta</span>
          </nav>

          <div className="account-hero">
            <span className="account-eyebrow">
              {isLoggedIn ? '✦ Círculo de Bienestar Sutra' : '✦ Acceso a Clientes'}
            </span>
            <h1 className="account-title">
              {isLoggedIn ? `Mi Santuario Sutra` : 'Acceso a tu Cuenta'}
            </h1>
            <p className="account-subtitle">
              {isLoggedIn
                ? `Bienvenido a tu espacio personal. Gestiona tus compras rituales, pedidos artesanales y comparte tus reseñas con la comunidad.`
                : 'Ingresa a tu cuenta para consultar tus pedidos, rastrear tus envíos y guardar tus reseñas de bienestar.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="account-main">
        <div className="account-container">
          {!isLoggedIn ? (
            /* ============================================================
               1. UNAUTHENTICATED VIEW: LOGIN & REGISTRATION
               ============================================================ */
            <div className="account-auth-wrapper">
              <div className="account-auth-card">
                <div className="account-auth-tabs">
                  <button
                    type="button"
                    className={`account-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    className={`account-auth-tab ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  >
                    Crear Nueva Cuenta
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="account-auth-form">
                  {authError && <div className="account-auth-error">{authError}</div>}
                  {authSuccess && (
                    <div className="account-auth-success">
                      ✓ Acceso autorizado. Cargando tu santuario...
                    </div>
                  )}

                  {authMode === 'register' && (
                    <div className="account-field">
                      <label htmlFor="auth-name">Nombre y Apellido</label>
                      <input
                        id="auth-name"
                        type="text"
                        placeholder="Ej. Sofía Valenzuela"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="account-field">
                    <label htmlFor="auth-email">Correo Electrónico</label>
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="account-field">
                    <div className="account-field-header">
                      <label htmlFor="auth-pass">Contraseña</label>
                      {authMode === 'login' && (
                        <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert('Te hemos enviado un enlace para restablecer tu contraseña a tu correo.'); }} className="account-forgot-link">
                          ¿Olvidaste tu contraseña?
                        </a>
                      )}
                    </div>
                    <input
                      id="auth-pass"
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="account-btn account-btn--primary">
                    {authMode === 'login' ? 'Iniciar Sesión en Sutra' : 'Crear mi Cuenta Sutra'}
                  </button>
                </form>

                <div className="account-auth-divider">
                  <span>o accede de inmediato</span>
                </div>

                {/* Demo Quick Login Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="account-btn account-btn--demo"
                >
                  ✦ Ingresar como cliente demo (Sofía Valenzuela)
                </button>
              </div>

              {/* Account Benefits Aside */}
              <div className="account-benefits-card">
                <h3 className="account-benefits-title">Beneficios del Círculo Sutra</h3>
                <ul className="account-benefits-list">
                  <li>
                    <span className="benefit-icon">📦</span>
                    <div>
                      <strong>Seguimiento de Pedidos</strong>
                      <p>Rastreo detallado de tus piezas artesanales desde nuestro taller hasta tu puerta.</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">✦</span>
                    <div>
                      <strong>Reseñas y Experiencias</strong>
                      <p>Guarda tus sensaciones aromáticas y califica las mezclas para orientar a la comunidad.</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">🌿</span>
                    <div>
                      <strong>Mistery Box & Suscripción</strong>
                      <p>Gestiona la frecuencia y fragancias de tu entrega bimestral sin complicaciones.</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">🕯️</span>
                    <div>
                      <strong>Atención Preferencial</strong>
                      <p>Acceso prioritario a lotes limitados y servicio personalizado vía WhatsApp Concierge.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* ============================================================
               2. AUTHENTICATED DASHBOARD VIEW
               ============================================================ */
            <div className="account-dashboard">
              {/* Profile Overview Bar */}
              <div className="account-profile-bar">
                <div className="account-profile-info">
                  <div className="account-avatar">
                    {currentUser.name ? currentUser.name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="account-user-name">
                      {currentUser.name}
                      <span className="account-verified-tag">✓ Cliente Verificado</span>
                    </div>
                    <div className="account-user-meta">
                      <span>{currentUser.email}</span>
                      <span>·</span>
                      <span>{currentUser.phone}</span>
                    </div>
                    {currentUser.subscription && (
                      <div className="account-subscription-badge">
                        ✦ {currentUser.subscription}
                      </div>
                    )}
                  </div>
                </div>

                <div className="account-profile-actions">
                  <button
                    onClick={handleLogout}
                    className="account-btn account-btn--outline"
                    title="Cerrar sesión actual"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              {/* Dashboard Navigation Tabs */}
              <div className="account-tabs-nav" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'orders'}
                  className={`account-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('orders'); setReviewingOrder(null); }}
                >
                  <span className="tab-icon">📦</span>
                  <span>Mis Compras & Pedidos</span>
                  <span className="tab-count">{orders.length}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'reviews'}
                  className={`account-nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('reviews'); setReviewingOrder(null); }}
                >
                  <span className="tab-icon">★</span>
                  <span>Mis Reseñas de Producto</span>
                  <span className="tab-count">{reviewedOrders.length}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'profile'}
                  className={`account-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('profile'); setReviewingOrder(null); }}
                >
                  <span className="tab-icon">👤</span>
                  <span>Mi Perfil & Envío</span>
                </button>
              </div>

              {/* Success Notification Banner */}
              {submittedOrderSuccess && (
                <div className="account-toast-success">
                  ✦ ¡Gracias por compartir tu reseña! Tu experiencia ha sido guardada y publicada en la comunidad Sutra.
                </div>
              )}

              {/* ============================================================
                 IN-PAGE REVIEW COMPOSER (when reviewing an order)
                 ============================================================ */}
              {reviewingOrder && (
                <div id="account-review-composer" className="account-review-composer">
                  <div className="composer-header">
                    <div>
                      <span className="composer-eyebrow">✦ Tu Experiencia Sutra</span>
                      <h3 className="composer-title">Calificar y Reseñar: {reviewingOrder.productName}</h3>
                      <p className="composer-subtitle">
                        Pedido {reviewingOrder.orderId} · {reviewingOrder.productVariant}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="composer-cancel-btn"
                      onClick={() => setReviewingOrder(null)}
                    >
                      ✕ Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOrderReview} className="composer-form">
                    {formError && <div className="account-auth-error">{formError}</div>}

                    {/* Star Rating Selector */}
                    <div className="rating-select-group">
                      <label className="composer-label">Calificación general:</label>
                      <div className="star-rating-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-select-btn ${(hoverRating || rating) >= star ? 'selected' : ''}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            aria-label={`Calificar con ${star} estrellas`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="star-rating-meaning">
                          {getRatingLabel(hoverRating || rating)}
                        </span>
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="account-field">
                      <label htmlFor="rev-title">Título de tu reseña</label>
                      <input
                        id="rev-title"
                        type="text"
                        placeholder="Ej. La cera perlada transformó mis noches de lectura"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                      />
                    </div>

                    {/* Review Text */}
                    <div className="account-field">
                      <label htmlFor="rev-comment">Tu reseña detallada *</label>
                      <textarea
                        id="rev-comment"
                        rows="4"
                        placeholder="Describe cómo se siente el aroma, la calidad de la combustión, la textura mineral o el empaque..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    {/* Recommends checkbox */}
                    <label className="composer-checkbox-label">
                      <input
                        type="checkbox"
                        checked={recommends}
                        onChange={(e) => setRecommends(e.target.checked)}
                      />
                      <span>Recomiendo este producto artesanal a otros entusiastas de Sutra</span>
                    </label>

                    <div className="composer-actions">
                      <button type="submit" className="account-btn account-btn--primary">
                        Publicar Reseña Verificada
                      </button>
                      <button
                        type="button"
                        className="account-btn account-btn--outline"
                        onClick={() => setReviewingOrder(null)}
                      >
                        Descartar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================
                 TAB CONTENT: 1. MIS COMPRAS & PEDIDOS
                 ============================================================ */}
              {activeTab === 'orders' && (
                <div className="account-orders-section">
                  <div className="section-subhead">
                    <div>
                      <h2 className="section-subhead-title">Historial de Compras</h2>
                      <p className="section-subhead-desc">
                        Consulta el estado de entrega y califica las piezas que ya forman parte de tu hogar.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('/tienda')}
                      className="account-btn account-btn--outline"
                    >
                      Explorar Catálogo →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="account-empty-card">
                      <p>Aún no tienes pedidos registrados en tu cuenta.</p>
                      <button onClick={() => onNavigate('/tienda')} className="account-btn account-btn--primary">
                        Comenzar tu Ritual
                      </button>
                    </div>
                  ) : (
                    <div className="account-orders-list">
                      {orders.map((ord) => (
                        <div key={ord.orderId} className="account-order-card">
                          {/* Order Card Header */}
                          <div className="order-card-header">
                            <div className="order-header-main">
                              <span className="order-id">Pedido {ord.orderId}</span>
                              <span className="order-date">· {ord.date}</span>
                            </div>
                            <div className="order-header-status">
                              <span className={`status-pill status-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                ● {ord.status}
                              </span>
                              <span className="order-total">{ord.total}</span>
                            </div>
                          </div>

                          {/* Order Product Body */}
                          <div className="order-card-body">
                            <div className="order-item">
                              <img
                                src={ord.productImg}
                                alt={ord.productName}
                                className="order-item-img"
                              />
                              <div className="order-item-details">
                                <h4 className="order-item-title">{ord.productName}</h4>
                                <p className="order-item-variant">Presentación: {ord.productVariant}</p>
                                <p className="order-item-qty">Cantidad: {ord.quantity || 1}</p>
                                {ord.trackingNumber && (
                                  <div className="order-tracking-info">
                                    <span>Guía de Envío: <strong>{ord.trackingNumber}</strong></span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Order Review Action */}
                            <div className="order-actions-col">
                              {ord.hasReview ? (
                                <div className="reviewed-badge-box">
                                  <div className="reviewed-stars">
                                    {'★'.repeat(ord.reviewRating || 5)}
                                  </div>
                                  <span className="reviewed-text">Reseña enviada con éxito</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReview(ord)}
                                    className="edit-review-link"
                                  >
                                    Editar reseña
                                  </button>
                                </div>
                              ) : ord.status === 'Entregado' ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(ord)}
                                  className="account-btn account-btn--review"
                                >
                                  ★ Calificar y Dejar Reseña
                                </button>
                              ) : (
                                <span className="order-in-transit-msg">
                                  Disponible para reseñar una vez entregado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                 TAB CONTENT: 2. MIS RESEÑAS
                 ============================================================ */}
              {activeTab === 'reviews' && (
                <div className="account-reviews-section">
                  <div className="section-subhead">
                    <div>
                      <h2 className="section-subhead-title">Mis Reseñas de Producto</h2>
                      <p className="section-subhead-desc">
                        Tus impresiones aromáticas y comentarios compartidos con la comunidad de bienestar.
                      </p>
                    </div>
                  </div>

                  {reviewedOrders.length === 0 ? (
                    <div className="account-empty-card">
                      <p>Aún no has dejado reseñas de tus compras entregadas.</p>
                      <p className="account-empty-sub">
                        Ve a la pestaña <strong>"Mis Compras & Pedidos"</strong> y califica tus productos recibidos.
                      </p>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="account-btn account-btn--primary"
                      >
                        Ver mis compras para reseñar
                      </button>
                    </div>
                  ) : (
                    <div className="account-reviews-grid">
                      {reviewedOrders.map((ord) => (
                        <div key={ord.orderId} className="account-review-item-card">
                          <div className="review-card-top">
                            <div className="review-product-tag">
                              <img src={ord.productImg} alt={ord.productName} className="rev-prod-thumb" />
                              <div>
                                <strong>{ord.productName}</strong>
                                <span>{ord.productVariant}</span>
                              </div>
                            </div>
                            <span className="review-verified-pill">✓ Compra Verificada</span>
                          </div>

                          <div className="review-rating-stars">
                            {'★'.repeat(ord.reviewRating || 5)}
                            <span className="review-rating-number">{ord.reviewRating || 5}.0</span>
                          </div>

                          <h4 className="review-card-title">{ord.reviewTitle || 'Excelente pieza ritual'}</h4>
                          <p className="review-card-body">{ord.reviewComment}</p>

                          <div className="review-card-footer">
                            <span className="review-date">Pedido {ord.orderId}</span>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(ord)}
                              className="edit-review-link"
                            >
                              Editar mi reseña
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All Community Reviews Feed */}
                  <div className="community-reviews-preview">
                    <h3 className="community-reviews-title">Reseñas Recientes en la Comunidad Sutra</h3>
                    <div className="community-reviews-list">
                      {allReviews.slice(0, 4).map((rev) => (
                        <div key={rev.id} className="community-rev-card">
                          <div className="comm-rev-head">
                            <span className="comm-author">{rev.author}</span>
                            <span className="comm-stars">{'★'.repeat(rev.rating)}</span>
                          </div>
                          <strong className="comm-title">{rev.title}</strong>
                          <p className="comm-text">"{rev.comment}"</p>
                          <div className="comm-footer">
                            <span>{rev.variant}</span>
                            <button
                              type="button"
                              className="comm-helpful-btn"
                              onClick={() => handleVoteHelpful(rev.id)}
                            >
                              Útil ({rev.helpfulCount || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                 TAB CONTENT: 3. MI PERFIL & DATOS DE ENVÍO
                 ============================================================ */}
              {activeTab === 'profile' && (
                <div className="account-profile-section">
                  <div className="section-subhead">
                    <div>
                      <h2 className="section-subhead-title">Datos Personales & Dirección de Envío</h2>
                      <p className="section-subhead-desc">
                        Mantén actualizada tu información para asegurar que tus paquetes rituales lleguen con prontitud.
                      </p>
                    </div>
                  </div>

                  {profileSavedToast && (
                    <div className="account-toast-success">
                      ✓ Datos de perfil y envío actualizados exitosamente.
                    </div>
                  )}

                  <form onSubmit={handleProfileSave} className="account-profile-form">
                    <div className="form-grid-2">
                      <div className="account-field">
                        <label htmlFor="prof-name">Nombre Completo</label>
                        <input
                          id="prof-name"
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="account-field">
                        <label htmlFor="prof-email">Correo Electrónico</label>
                        <input
                          id="prof-email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="account-field">
                        <label htmlFor="prof-phone">Teléfono de Contacto</label>
                        <input
                          id="prof-phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="account-field">
                        <label htmlFor="prof-sub">Membresía / Suscripción</label>
                        <input
                          id="prof-sub"
                          type="text"
                          value={profileForm.subscription}
                          onChange={(e) => setProfileForm({ ...profileForm, subscription: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="account-field">
                      <label htmlFor="prof-addr">Dirección de Entrega Habitual</label>
                      <input
                        id="prof-addr"
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="profile-form-actions">
                      <button type="submit" className="account-btn account-btn--primary">
                        Guardar Cambios de Perfil
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
