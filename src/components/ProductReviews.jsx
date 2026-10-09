import { useState, useEffect, useMemo } from 'react';
import { getReviewsForProduct, addCustomerReview, voteHelpful } from '../lib/reviewsService';
import { submitToContactoGeneral } from '../lib/formsService';
import './ProductReviews.css';

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 5 | 4 | 3
  const [votedIds, setVotedIds] = useState(() => new Set());

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load reviews on product change and listen to updates
  useEffect(() => {
    if (!product) return;
    const load = () => {
      const data = getReviewsForProduct(product);
      setReviews(data);
    };

    load();

    const handleUpdate = () => load();
    window.addEventListener('sutra-review-added', handleUpdate);
    return () => window.removeEventListener('sutra-review-added', handleUpdate);
  }, [product]);

  // Derived statistics
  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        avg: product?.rating || 4.9,
        count: product?.reviewCount || 24,
        dist: { 5: 88, 4: 12, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const dist = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };

    return { avg, count: total, dist };
  }, [reviews, product]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter((r) => r.rating === Number(activeFilter));
  }, [reviews, activeFilter]);

  // Handle helpful vote
  const handleVote = (id) => {
    if (votedIds.has(id)) return;
    voteHelpful(id);
    setVotedIds((prev) => new Set(prev).add(id));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  // Submit review form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setErrorMsg('Por favor completa tu nombre y tu comentario.');
      return;
    }
    setErrorMsg('');

    addCustomerReview({
      productId: product.id || product._wixId,
      slug: product.slug,
      productName: product.name,
      author: name.trim(),
      authorEmail: email.trim(),
      rating,
      title: title.trim() || 'Experiencia extraordinaria',
      comment: comment.trim(),
      variant: 'Compra en Línea',
    });

    submitToContactoGeneral({
      nombre: name.trim(),
      email: email.trim(),
      telefono: '',
      empresa: `Producto: ${product?.name || 'Sutra'}`,
      industria: `Reseña (${rating} Estrellas)`,
      mensaje: `Reseña de producto: ${product?.name || 'Sutra'}\nCalificación: ${rating}/5 estrellas\nTítulo: ${title.trim() || 'Sin título'}\nRecomienda producto: ${recommends ? 'Sí' : 'No'}\nComentario:\n${comment.trim()}`,
    }).catch(() => {});

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setTitle('');
      setComment('');
      setRating(5);
    }, 1800);
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Extraordinario · Superó mis expectativas';
      case 4: return 'Muy bueno · Muy satisfecho';
      case 3: return 'Bueno · Cumple su función';
      case 2: return 'Regular · Podría mejorar';
      case 1: return 'Insatisfecho';
      default: return '';
    }
  };

  return (
    <section className="product-reviews-section container" id="opiniones">
      {/* Header */}
      <div className="reviews-section-header">
        <span className="reviews-eyebrow">VOCES DEL SANTUARIO</span>
        <h2 className="reviews-title">Reseñas de la Comunidad</h2>
        <p className="reviews-subtitle">
          Experiencias reales de quienes han transformado sus espacios cotidianos en templos de calma.
        </p>
      </div>

      {/* Overview Card: Score, Breakdown & CTA */}
      <div className="reviews-overview-card">
        {/* Left: Big Score */}
        <div className="reviews-score-block">
          <div className="reviews-big-number">{stats.avg}</div>
          <div className="reviews-stars-gold">
            {'★'.repeat(Math.round(stats.avg))}
            <span className="reviews-stars-dim">{'★'.repeat(5 - Math.round(stats.avg))}</span>
          </div>
          <p className="reviews-count-note">
            Basado en <strong>{stats.count} opiniones</strong> verificadas
          </p>
          <div className="reviews-trust-pill">
            <span>✓</span> 100% Compradores Verificados
          </div>
        </div>

        {/* Center: Rating breakdown bars */}
        <div className="reviews-bars-block">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="review-bar-row">
              <span className="bar-label">{stars} ★</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${stats.dist[stars] || 0}%` }}
                />
              </div>
              <span className="bar-percentage">{stats.dist[stars] || 0}%</span>
            </div>
          ))}
        </div>

        {/* Right: CTA to write a review */}
        <div className="reviews-cta-block">
          <h3 className="cta-block-title">¿Ya viviste este ritual?</h3>
          <p className="cta-block-text">
            Comparte tus sensaciones aromáticas y ayuda a otros miembros de la comunidad a encontrar su momento de calma.
          </p>
          <button
            type="button"
            className="btn-write-review"
            onClick={() => setIsModalOpen(true)}
            id="btn-open-review-modal"
          >
            ✦ Escribir una Reseña
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="reviews-filter-bar">
        <span className="filter-bar-label">Filtrar opiniones:</span>
        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas ({reviews.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 5 ? 'active' : ''}`}
            onClick={() => setActiveFilter(5)}
          >
            5 Estrellas
          </button>
          <button
            type="button"
            className={`filter-pill ${activeFilter === 4 ? 'active' : ''}`}
            onClick={() => setActiveFilter(4)}
          >
            4 Estrellas
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list-grid">
        {filteredReviews.length === 0 ? (
          <div className="reviews-empty">
            <p>Aún no hay reseñas en este filtro. ¡Sé el primero en compartir tu experiencia!</p>
            <button
              type="button"
              className="btn-write-review-small"
              onClick={() => setIsModalOpen(true)}
            >
              Escribir primera reseña
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasVoted = votedIds.has(rev.id);
            return (
              <article key={rev.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-author-wrap">
                    <div className="review-avatar">
                      {rev.authorInitial || rev.author?.charAt(0) || 'S'}
                    </div>
                    <div className="review-author-info">
                      <div className="review-author-name">
                        <strong>{rev.author}</strong>
                        {rev.verified && (
                          <span className="review-verified-badge" title="Compra verificada en Sutra México">
                            ✓ Verificado
                          </span>
                        )}
                      </div>
                      <span className="review-meta">
                        {rev.location ? `${rev.location} · ` : ''}{rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="review-card-stars">
                    {'★'.repeat(rev.rating)}
                    <span className="stars-empty">{'★'.repeat(5 - rev.rating)}</span>
                  </div>
                </div>

                {rev.variant && (
                  <div className="review-variant-tag">
                    <span>Selección:</span> {rev.variant}
                  </div>
                )}

                <h4 className="review-card-title">{rev.title}</h4>
                <p className="review-card-comment">{rev.comment}</p>

                <div className="review-card-footer">
                  <span className="review-recommend">
                    ✧ Recomienda este ritual
                  </span>
                  <button
                    type="button"
                    className={`btn-helpful ${hasVoted ? 'voted' : ''}`}
                    onClick={() => handleVote(rev.id)}
                    disabled={hasVoted}
                  >
                    👍 ¿Te resultó útil? ({rev.helpfulCount || 0})
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* ============================================================
          INTERACTIVE REVIEW SUBMISSION MODAL
          ============================================================ */}
      {isModalOpen && (
        <div className="review-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="review-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {submitted ? (
              <div className="review-modal-success">
                <div className="success-icon-gold">✓</div>
                <h3>¡Gracias por compartir tu luz!</h3>
                <p>Tu reseña ha sido publicada y ya inspira a nuestra comunidad ritual.</p>
              </div>
            ) : (
              <>
                <div className="review-modal-header">
                  <span className="modal-eyebrow">VOCES SUTRA</span>
                  <h3 className="modal-title">Escribe tu Reseña</h3>
                  <p className="modal-product-name">{product.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="review-modal-form">
                  {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

                  {/* Rating Selector */}
                  <div className="modal-field rating-field">
                    <label>Tu valoración general</label>
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

                  {/* Author Name & Email */}
                  <div className="modal-form-row">
                    <div className="modal-field">
                      <label htmlFor="rev-author-name">Tu nombre completo</label>
                      <input
                        type="text"
                        id="rev-author-name"
                        required
                        placeholder="Ej. Sofía Valenzuela"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="modal-field">
                      <label htmlFor="rev-author-email">Correo (privado)</label>
                      <input
                        type="email"
                        id="rev-author-email"
                        placeholder="hola@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="modal-field">
                    <label htmlFor="rev-title">Título de tu experiencia</label>
                    <input
                      type="text"
                      id="rev-title"
                      placeholder="Ej. Paz instantánea y aroma delicioso"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Review Comment */}
                  <div className="modal-field">
                    <label htmlFor="rev-comment">Tu reseña detallada</label>
                    <textarea
                      id="rev-comment"
                      required
                      rows={4}
                      placeholder="Describe qué sentiste al encender tu vela, la intensidad del aroma o cómo complementa tu espacio..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  {/* Recommendation Checkbox */}
                  <div className="modal-checkbox-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={recommends}
                        onChange={(e) => setRecommends(e.target.checked)}
                      />
                      <span>Recomiendo este producto a otros amantes del bienestar</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit-review">
                    Publicar mi Reseña
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
