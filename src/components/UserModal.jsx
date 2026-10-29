import { useState, useEffect } from 'react';
import { getUserOrders, addCustomerReview } from '../lib/reviewsService';
import './UserModal.css';

export default function UserModal({ isOpen, onClose }) {
  // Main view tab: 'orders' | 'reviews' | 'profile' | 'auth'
  const [activeTab, setActiveTab] = useState('reviews');

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
      const saved = localStorage.getItem('sutra_customer_logged_in');
      return saved === null ? false : saved === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sutra_customer_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  });

  // Orders list
  const [orders, setOrders] = useState([]);

  // Active review form state for a specific order
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [submittedOrderSuccess, setSubmittedOrderSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Auth form state (when logging in / registering)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Load orders from reviewsService
  useEffect(() => {
    if (!isOpen) return;
    const load = () => {
      setOrders(getUserOrders());
    };
    load();

    const handleOrdersChange = () => load();
    window.addEventListener('sutra-orders-updated', handleOrdersChange);
    return () => window.removeEventListener('sutra-orders-updated', handleOrdersChange);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle open review form for an order
  const handleOpenReview = (order) => {
    setReviewingOrder(order);
    setRating(order.reviewRating || 5);
    setReviewTitle(order.reviewTitle || '');
    setReviewComment(order.reviewComment || '');
    setFormError('');
  };

  // Submit review for an order
  const handleSubmitOrderReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setFormError('Por favor escribe tu comentario sobre la compra.');
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
      title: reviewTitle.trim() || 'Excelente producto y experiencia',
      comment: reviewComment.trim(),
      variant: reviewingOrder.productVariant || 'Compra en Línea',
      orderId: reviewingOrder.orderId,
    });

    const targetOrderId = reviewingOrder.orderId;
    setSubmittedOrderSuccess(targetOrderId);
    setReviewingOrder(null);

    // Refresh orders
    setOrders(getUserOrders());

    setTimeout(() => {
      setSubmittedOrderSuccess(null);
    }, 3000);
  };

  // Handle auth submit
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      setIsLoggedIn(true);
      try {
        localStorage.setItem('sutra_customer_logged_in', 'true');
      } catch {}
      if (authName.trim()) {
        setCurrentUser((prev) => ({ ...prev, name: authName.trim(), email: authEmail.trim() }));
      }
      setActiveTab('orders');
    }, 1200);
  };

  const handleSocialAuth = (provider) => {
    setAuthSuccess(true);
    const derivedName = authName.trim() || `Usuario ${provider}`;
    const derivedEmail = authEmail.trim() || `usuario.${provider.toLowerCase()}@sutra.mx`;
    const updatedUser = {
      ...currentUser,
      name: derivedName,
      email: derivedEmail,
      authProvider: provider,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('sutra_customer_profile_v1', JSON.stringify(updatedUser));
      localStorage.setItem('sutra_customer_logged_in', 'true');
    } catch {}
    setTimeout(() => {
      setAuthSuccess(false);
      setIsLoggedIn(true);
      setActiveTab('orders');
    }, 900);
  };

  // Rating label helper
  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Extraordinario · Superó mis expectativas';
      case 4: return 'Muy bueno · Muy satisfecho';
      case 3: return 'Bueno · Cumple su función';
      case 2: return 'Regular';
      case 1: return 'Insatisfecho';
      default: return '';
    }
  };

  // Filter reviewed orders for "Mis Reseñas" tab
  const reviewedOrders = orders.filter((o) => o.hasReview);

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div 
        className={`user-modal-card ${isLoggedIn ? 'is-dashboard' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="user-modal-close" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        {/* Modal Header */}
        <div className="user-modal-header">
          <span className="user-modal-eyebrow">{isLoggedIn ? 'Círculo Sutra' : 'Mi Cuenta Sutra'}</span>
          <h2 className="user-modal-title">
            {isLoggedIn ? `Hola, ${currentUser.name.split(' ')[0]}` : (authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </h2>
          <p className="user-modal-subtitle">
            {isLoggedIn 
              ? 'Gestiona tus compras rituales, pedidos entregados y comparte tus reseñas.' 
              : (authMode === 'login' 
                  ? 'Ingresa a tu cuenta para consultar tus pedidos y dar seguimiento a tus envíos.' 
                  : 'Regístrate para gestionar tus compras rituales y suscripciones.')}
          </p>
        </div>

        {/* Navigation Tabs for logged in user / Auth switch for visitor */}
        {isLoggedIn ? (
          <div className="user-dashboard-nav">
            <button
              type="button"
              className={`dash-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setReviewingOrder(null); }}
            >
              Mis Compras ({orders.length})
            </button>
            <button
              type="button"
              className={`dash-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => { setActiveTab('reviews'); setReviewingOrder(null); }}
            >
              Mis Reseñas ({reviewedOrders.length})
            </button>
            <button
              type="button"
              className={`dash-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setReviewingOrder(null); }}
            >
              Mi Perfil
            </button>
          </div>
        ) : (
          <div className="user-auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Crear Cuenta
            </button>
          </div>
        )}

        {/* ============================================================
            TAB 1: MIS COMPRAS (CON BOTÓN PARA DEJAR RESEÑA)
            ============================================================ */}
        {isLoggedIn && activeTab === 'orders' && (
          <div className="user-orders-view">
            {submittedOrderSuccess && (
              <div className="order-review-success-banner">
                <span>✓</span> ¡Tu reseña ha sido publicada con éxito en la tienda!
              </div>
            )}

            {/* If user clicked to review a specific order */}
            {reviewingOrder ? (
              <div className="order-inline-review-card">
                <div className="inline-review-header">
                  <button 
                    type="button" 
                    className="btn-back-to-orders"
                    onClick={() => setReviewingOrder(null)}
                  >
                    ← Volver a mis compras
                  </button>
                  <span className="order-badge-pill">Pedido {reviewingOrder.orderId}</span>
                </div>

                <div className="inline-review-product-info">
                  <img 
                    src={reviewingOrder.productImg} 
                    alt={reviewingOrder.productName} 
                    className="inline-product-thumb"
                  />
                  <div>
                    <h4>{reviewingOrder.productName}</h4>
                    <p>{reviewingOrder.productVariant}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrderReview} className="inline-review-form">
                  {formError && <div className="modal-error-banner">{formError}</div>}

                  {/* Stars */}
                  <div className="modal-field rating-field">
                    <label>¿Cómo calificarías este producto?</label>
                    <div className="stars-interactive">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-pick ${(hoverRating || rating) >= star ? 'active' : ''}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          aria-label={`${star} estrellas`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="rating-desc-text">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="modal-field">
                    <label>Título de tu reseña</label>
                    <input
                      type="text"
                      placeholder="Ej. Aroma delicioso y cera impecable"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>

                  {/* Comment */}
                  <div className="modal-field">
                    <label>Tu opinión sobre el producto y ritual</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Cuéntanos cómo fue tu experiencia al recibirlo y usarlo en casa..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  <div className="modal-checkbox-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={recommends}
                        onChange={(e) => setRecommends(e.target.checked)}
                      />
                      <span>Recomiendo este producto de Sutra</span>
                    </label>
                  </div>

                  <div className="inline-review-actions">
                    <button
                      type="button"
                      className="btn-cancel-review"
                      onClick={() => setReviewingOrder(null)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-submit-order-review">
                      Publicar Reseña de mi Compra
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="orders-list">
                <p className="orders-intro-text">
                  Selecciona cualquiera de tus compras entregadas para calificarla y dejar tu opinión verificado en la tienda:
                </p>

                {orders.map((ord) => (
                  <div key={ord.orderId} className="user-order-item">
                    <div className="order-item-left">
                      <img 
                        src={ord.productImg} 
                        alt={ord.productName} 
                        className="order-product-thumb"
                      />
                      <div className="order-item-details">
                        <div className="order-top-line">
                          <span className="order-id-badge">#{ord.orderId}</span>
                          <span className="order-date-label">{ord.date}</span>
                          <span className="order-status-delivered">● {ord.status}</span>
                        </div>
                        <h4 className="order-product-title">{ord.productName}</h4>
                        <span className="order-variant-desc">{ord.productVariant}</span>
                        <span className="order-price-val">{ord.price}</span>
                      </div>
                    </div>

                    <div className="order-item-action">
                      {ord.hasReview ? (
                        <div className="order-reviewed-box">
                          <div className="reviewed-stars-row">
                            <span className="reviewed-stars">{'★'.repeat(ord.reviewRating || 5)}</span>
                            <span className="reviewed-badge">✓ Reseña enviada</span>
                          </div>
                          {ord.reviewComment && (
                            <p className="reviewed-snippet">"{ord.reviewComment.slice(0, 75)}..."</p>
                          )}
                          <button
                            type="button"
                            className="btn-edit-order-review"
                            onClick={() => handleOpenReview(ord)}
                          >
                            Editar mi reseña
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-leave-order-review"
                          onClick={() => handleOpenReview(ord)}
                          id={`btn-review-${ord.orderId}`}
                        >
                          ★ Dejar Reseña de mi Compra
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: MIS RESEÑAS PUBLICADAS
            ============================================================ */}
        {isLoggedIn && activeTab === 'reviews' && (
          <div className="user-reviews-history-view">
            <p className="reviews-history-intro">
              Estas son las reseñas que has publicado con tu cuenta verificada en Sutra México:
            </p>

            {reviewedOrders.length === 0 ? (
              <div className="empty-reviews-history">
                <p>Aún no has compartido reseñas de tus compras.</p>
                <button
                  type="button"
                  className="btn-go-to-orders"
                  onClick={() => setActiveTab('orders')}
                >
                  Ver mis compras para calificar
                </button>
              </div>
            ) : (
              <div className="reviewed-history-list">
                {reviewedOrders.map((ord) => (
                  <div key={ord.orderId} className="history-review-card">
                    <div className="history-card-top">
                      <div>
                        <span className="history-order-ref">Pedido #{ord.orderId} · {ord.date}</span>
                        <h4 className="history-product-name">{ord.productName}</h4>
                      </div>
                      <div className="history-stars-gold">
                        {'★'.repeat(ord.reviewRating || 5)}
                      </div>
                    </div>

                    <div className="history-review-body">
                      {ord.reviewTitle && (
                        <strong className="history-review-title">"{ord.reviewTitle}"</strong>
                      )}
                      <p className="history-review-comment">{ord.reviewComment}</p>
                    </div>

                    <div className="history-card-bottom">
                      <span className="history-verified-tag">✓ Publicada como Compra Verificada</span>
                      <button
                        type="button"
                        className="btn-history-edit"
                        onClick={() => {
                          setActiveTab('orders');
                          handleOpenReview(ord);
                        }}
                      >
                        Modificar opinión
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: MI PERFIL
            ============================================================ */}
        {isLoggedIn && activeTab === 'profile' && (
          <div className="user-profile-view">
            <div className="profile-info-grid">
              <div className="profile-info-row">
                <span className="profile-label">Nombre completo:</span>
                <span className="profile-val">{currentUser.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Correo registrado:</span>
                <span className="profile-val">{currentUser.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Teléfono:</span>
                <span className="profile-val">{currentUser.phone}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Dirección de entrega:</span>
                <span className="profile-val">{currentUser.address}</span>
              </div>
              <div className="profile-info-row subscription-row">
                <span className="profile-label">Suscripción activa:</span>
                <span className="profile-val highlight-gold">{currentUser.subscription}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                type="button" 
                className="btn-logout-client"
                onClick={() => {
                  setIsLoggedIn(false);
                  try {
                    localStorage.setItem('sutra_customer_logged_in', 'false');
                  } catch {}
                }}
              >
                Cerrar Sesión / Cambiar de Usuario
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            FALLBACK: AUTH VIEW (LOGIN / REGISTER)
            ============================================================ */}
        {!isLoggedIn && (
          <>
            {authSuccess ? (
              <div className="user-modal-success">
                <div className="user-modal-success-icon">✓</div>
                <h3>{authMode === 'login' ? '¡Bienvenido de vuelta!' : '¡Cuenta creada con éxito!'}</h3>
                <p>Cargando tus compras y pedidos verificados...</p>
              </div>
            ) : (
              <form className="user-modal-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div className="form-group">
                    <label htmlFor="user-name">Nombre completo</label>
                    <input 
                      type="text" 
                      id="user-name" 
                      required 
                      placeholder="Tu nombre completo" 
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="user-email">Correo electrónico</label>
                  <input 
                    type="email" 
                    id="user-email" 
                    required 
                    placeholder="hola@ejemplo.com" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="user-password">Contraseña</label>
                  <input 
                    type="password" 
                    id="user-password" 
                    required 
                    placeholder="••••••••" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="user-modal-btn">
                  {authMode === 'login' ? 'Ingresar a mi Cuenta' : 'Crear mi Cuenta'}
                </button>

                <div className="user-modal-social-divider">
                  <span>o continúa con</span>
                </div>

                <div className="user-modal-social-buttons">
                  <button
                    type="button"
                    className="user-modal-social-btn"
                    onClick={() => handleSocialAuth('Google')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"/>
                      <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.6 6.4C.6 8.3 0 10.6 0 12s.6 3.7 1.6 5.6l3.7-2.8z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z"/>
                    </svg>
                    <span>Continuar con Google</span>
                  </button>

                  <button
                    type="button"
                    className="user-modal-social-btn"
                    onClick={() => handleSocialAuth('Facebook')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                    <span>Continuar con Facebook</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Modal Footer */}
        <div className="user-modal-footer">
          <p>
            Al continuar, aceptas la filosofía de bienestar y privacidad de Sutra México.
          </p>
        </div>
      </div>
    </div>
  );
}
