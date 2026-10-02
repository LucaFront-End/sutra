import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/shopData';
import { useWixProducts } from '../hooks/useWixProducts';
import { parseWixMediaUrl } from '../lib/wixProducts';
import ProductReviews from '../components/ProductReviews';
import './ProductPage.css';

export default function ProductPage({ product: incomingProduct, onNavigate, onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products: wixProducts, loading: wixLoading } = useWixProducts();

  // Resolve product either from incoming prop, or by finding slug in dynamic wixProducts or static data
  const matchedProduct = incomingProduct || (
    slug
      ? (wixProducts || []).find((p) => p.slug === slug || p._wixId === slug || p.id === slug)
        || allProducts.find((p) => p.slug === slug || p.id === slug)
      : null
  ) || (wixProducts && wixProducts.length > 0 ? wixProducts[0] : allProducts[0]);

  const product = matchedProduct;

  // Dynamic gallery images safely parsed whether object or string
  const rawImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.img || '/assets/images/cera-blanca.jpg'];

  const galleryImages = rawImages.map((img, idx) => {
    const rawSrc = typeof img === 'string' ? img : (img?.src || img?.url || product.img);
    const parsedSrc = parseWixMediaUrl(rawSrc);
    return {
      id: img?.id || `gallery-thumb-${idx}`,
      src: parsedSrc,
      label: typeof img === 'object' && img?.label ? img.label : '',
      color: img?.color,
    };
  }).filter((item) => Boolean(item.src));

  const [activeImg, setActiveImg] = useState(() => {
    return galleryImages[0]?.src || parseWixMediaUrl(product.img) || '/assets/images/cera-blanca.jpg';
  });

  // Dynamic options state: { [optionId]: choiceValue }
  const [selectedChoices, setSelectedChoices] = useState(() => {
    const initial = {};
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach((opt) => {
        const defaultChoice = opt.choices?.find((c) => c.isDefault) || opt.choices?.[0];
        if (defaultChoice) {
          initial[opt.id] = defaultChoice.value;
        }
      });
    }
    return initial;
  });

  // When product changes, reset active image and options
  useEffect(() => {
    const currentRaw = (product.images && product.images.length > 0)
      ? product.images
      : [product.img || '/assets/images/cera-blanca.jpg'];

    const firstSrc = parseWixMediaUrl(
      typeof currentRaw[0] === 'string' 
        ? currentRaw[0] 
        : (currentRaw[0]?.src || currentRaw[0]?.url || product.img)
    );

    setActiveImg(firstSrc);

    const initial = {};
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach((opt) => {
        const defaultChoice = opt.choices?.find((c) => c.isDefault) || opt.choices?.[0];
        if (defaultChoice) {
          initial[opt.id] = defaultChoice.value;
        }
      });
    }
    setSelectedChoices(initial);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Calculate dynamic price based on base price + selected options deltas
  const basePrice = product.priceNum || 0;
  let priceDeltaSum = 0;

  if (product.options && Array.isArray(product.options)) {
    product.options.forEach((opt) => {
      const selectedVal = selectedChoices[opt.id];
      const choice = opt.choices?.find((c) => c.value === selectedVal);
      if (choice?.priceDelta) {
        priceDeltaSum += choice.priceDelta;
      }
    });
  }

  const totalPrice = Math.max(0, basePrice + priceDeltaSum);

  // Handle option change
  const handleOptionChange = (optionId, choice) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [optionId]: choice.value,
    }));

    // If choice has an associated image (e.g. Color Blanco vs Negro), switch active image
    if (choice.img) {
      setActiveImg(choice.img);
    }
  };

  // Carousel navigation
  const currentImgIndex = galleryImages.findIndex((img) => img.src === activeImg);
  const handlePrevImg = () => {
    const newIdx = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    const item = galleryImages[newIdx];
    setActiveImg(item.src);
    if (item.color && selectedChoices['color'] !== undefined) {
      setSelectedChoices((prev) => ({ ...prev, color: item.color }));
    }
  };

  const handleNextImg = () => {
    const newIdx = (currentImgIndex + 1) % galleryImages.length;
    const item = galleryImages[newIdx];
    setActiveImg(item.src);
    if (item.color && selectedChoices['color'] !== undefined) {
      setSelectedChoices((prev) => ({ ...prev, color: item.color }));
    }
  };

  const handleThumbnailClick = (imgItem) => {
    setActiveImg(imgItem.src);
    if (imgItem.color && selectedChoices['color'] !== undefined) {
      setSelectedChoices((prev) => ({ ...prev, color: item.color }));
    }
  };

  // Add to cart handler
  const handleAdd = () => {
    // Build human-readable option summary
    const optionLabels = [];
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach((opt) => {
        const val = selectedChoices[opt.id];
        const choice = opt.choices?.find((c) => c.value === val);
        if (choice) {
          optionLabels.push(choice.label);
        }
      });
    }

    const optionsText = optionLabels.length > 0 ? ` (${optionLabels.join(', ')})` : '';

    const customizedItem = {
      ...product,
      id: `${product.id}-${Object.values(selectedChoices).join('-') || 'default'}`,
      _wixId: product._wixId,
      name: `${product.name}${optionsText}`,
      emotionalName: product.emotionalName || 'Ritual Sutra',
      price: `$${totalPrice.toLocaleString()} MXN`,
      priceNum: totalPrice,
      img: activeImg,
      customDetails: selectedChoices,
    };

    if (onAddToCart) {
      onAddToCart(customizedItem);
    }
  };

  // Cross-sell items (pick complementary items dynamically from Wix or catalog)
  const catalogForCross = (wixProducts && wixProducts.length > 0) ? wixProducts : allProducts;
  const complementaryProducts = catalogForCross
    .filter((p) => (p._wixId || p.id) !== (product._wixId || product.id) && p.category !== product.category)
    .slice(0, 2);

  // Dynamic category eyebrow text
  const categoryEyebrow = product.subcategory 
    ? `ACCESORIOS · ${product.subcategory.toUpperCase().replace('-', ' ')}`
    : (product.category ? product.category.toUpperCase() : 'SUTRA MEXICO');

  return (
    <div className="product-page fade-in">
      {/* Top back navigation */}
      <div className="product-nav container">
        <button 
          className="btn-back-shop" 
          onClick={() => {
            if (onNavigate) onNavigate('shop');
            navigate('/tienda');
          }}
        >
          ← Volver a la Tienda
        </button>
      </div>

      <div className="product-layout container">
        {/* ============================================================
            LEFT SIDE: DYNAMIC CAROUSEL GALLERY
            ============================================================ */}
        <div className="product-gallery-collage">
          <div className="carousel-sticky-wrap">
            <div className="carousel-main-frame">
              <span className="collage-badge">
                {product.tag ? `✧ ${product.tag}` : '✧ Ritual Sutra'}
              </span>

              {galleryImages.length > 1 && (
                <>
                  <button 
                    type="button"
                    className="carousel-nav-arrow carousel-nav-arrow--prev" 
                    onClick={handlePrevImg}
                    aria-label="Foto anterior"
                  >
                    ‹
                  </button>
                  <button 
                    type="button"
                    className="carousel-nav-arrow carousel-nav-arrow--next" 
                    onClick={handleNextImg}
                    aria-label="Foto siguiente"
                  >
                    ›
                  </button>
                </>
              )}

              <img 
                src={activeImg} 
                alt={product.name} 
                className="carousel-main-img"
                onError={(e) => {
                  e.target.src = product.img || '/assets/images/cera-blanca.jpg';
                }}
              />
            </div>

            {/* Thumbnails strip */}
            {galleryImages.length > 1 && (
              <div className="carousel-thumbnails-strip">
                {galleryImages.map((imgItem, idx) => {
                  const isActive = imgItem.src === activeImg;
                  return (
                    <button
                      key={imgItem.id || idx}
                      type="button"
                      className={`carousel-thumb-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleThumbnailClick(imgItem)}
                      aria-label={`Ver foto ${idx + 1}`}
                    >
                      <img 
                        src={imgItem.src} 
                        alt={imgItem.label || `Foto ${idx + 1}`} 
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = product.img || '/assets/images/cera-blanca.jpg';
                        }}
                      />
                      {isActive && <span className="thumb-active-dot" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mini Trust Perks */}
            <div className="gallery-mini-perks">
              <span>✦ Envío seguro a todo México</span>
              <span>✦ Creado artesanalmente</span>
              <span>✦ Bienestar sustentable</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT SIDE: PRODUCT DETAILS & DYNAMIC CONFIGURATOR
            ============================================================ */}
        <div className="product-details-panel">
          <div className="pdp-header">
            <span className="pdp-eyebrow">
              {categoryEyebrow}
            </span>
            <h1 className="pdp-title">{product.name}</h1>
            
            <div className="pdp-price-wrap">
              <span className="pdp-price">${totalPrice.toLocaleString()} MXN</span>
              {totalPrice >= 1200 && (
                <span className="pdp-shipping-tag">✓ Envío gratuito</span>
              )}
            </div>

            <a 
              href="#opiniones" 
              className="pdp-rating-summary-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('opiniones')?.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Ver opiniones y reseñas de la comunidad"
            >
              <span className="pdp-stars-gold">★★★★★</span>
              <span className="pdp-rating-num">{product.rating || 4.9}</span>
              <span className="pdp-reviews-count">({product.reviewCount || 38} reseñas)</span>
            </a>

            {/* Rich formatted description or clean fallback */}
            {product.descriptionHtml ? (
              <div 
                className="pdp-description-formatted"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="pdp-description">{product.description}</p>
            )}
          </div>

          {/* Dynamic Options Configurator (If options are defined for this product) */}
          {product.options && product.options.length > 0 && (
            <div className="pdp-configurator-box">
              {product.options.map((opt) => {
                const currentVal = selectedChoices[opt.id];
                const activeChoice = opt.choices?.find((c) => c.value === currentVal) || opt.choices?.[0];

                return (
                  <div key={opt.id} className="config-section">
                    <div className="config-label-row">
                      <span className="config-label">
                        <span>{opt.label}:</span>
                        <strong className="config-current-val">{activeChoice?.label}</strong>
                      </span>
                    </div>

                    {/* 1. COLOR SWATCHES */}
                    {opt.type === 'color' && (
                      <div className="config-pills">
                        {opt.choices.map((choice) => {
                          const isSelected = selectedChoices[opt.id] === choice.value;
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              className={`config-pill ${isSelected ? 'active' : ''}`}
                              onClick={() => handleOptionChange(opt.id, choice)}
                            >
                              <span 
                                className="color-dot" 
                                style={{ backgroundColor: choice.hex || '#E8DED1' }} 
                              />
                              <span>{choice.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. PILLS SELECTOR */}
                    {opt.type === 'pills' && (
                      <div className="config-pills config-pills--wrap">
                        {opt.choices.map((choice) => {
                          const isSelected = selectedChoices[opt.id] === choice.value;
                          const priceLabel = choice.priceDelta 
                            ? ` (${choice.priceDelta > 0 ? '+' : ''}$${choice.priceDelta} MXN)`
                            : '';
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              className={`config-pill ${isSelected ? 'active' : ''}`}
                              onClick={() => handleOptionChange(opt.id, choice)}
                            >
                              <span>{choice.label}{priceLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 3. SELECTOR WITH SENSORY NOTE */}
                    {opt.type === 'select' && (
                      <div>
                        <div className="config-pills config-pills--wrap">
                          {opt.choices.map((choice) => {
                            const isSelected = selectedChoices[opt.id] === choice.value;
                            return (
                              <button
                                key={choice.value}
                                type="button"
                                className={`config-pill ${isSelected ? 'active' : ''}`}
                                onClick={() => handleOptionChange(opt.id, choice)}
                              >
                                <span>{choice.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {activeChoice?.desc && (
                          <div className="aroma-sensory-note">
                            <span className="sensory-icon">✧</span>
                            <p>{activeChoice.desc}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. CARDS SELECTOR (Vessels, Editions, etc.) */}
                    {opt.type === 'cards' && (
                      <div className="vasija-options-grid">
                        {opt.choices.map((choice) => {
                          const isSelected = selectedChoices[opt.id] === choice.value;
                          return (
                            <div
                              key={choice.value}
                              className={`vasija-card ${isSelected ? 'active' : ''}`}
                              onClick={() => handleOptionChange(opt.id, choice)}
                            >
                              <div className="vasija-icon-box">
                                {choice.value === 'sin-vasija' ? '⊘' : '🏺'}
                              </div>
                              <div className="vasija-info">
                                <strong>{choice.label}</strong>
                                {choice.sub && <small>{choice.sub}</small>}
                              </div>
                              <span className="vasija-price-tag">
                                {choice.priceDelta ? `+$${choice.priceDelta} MXN` : 'Incluido'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="pdp-cta-wrap">
            <button
              type="button"
              className="btn-add-to-cart-large"
              onClick={handleAdd}
            >
              Personalizar & Añadir — ${totalPrice.toLocaleString()} MXN
            </button>
          </div>

          {/* Emotional Benefit */}
          {product.benefit && (
            <div className="pdp-pabilos-notice">
              <span>✦</span>
              <p><strong>Por qué este ritual:</strong> {product.benefit}</p>
            </div>
          )}

          {/* Accordion Sections: Ritual Guide & Specifications */}
          <div className="product-accordion">
            {/* Ritual Steps */}
            {product.ritualSteps && (
              <details className="pdp-details" open>
                <summary>Cómo realizar este ritual</summary>
                <div className="details-content">
                  <ol>
                    {product.ritualSteps.map((step) => (
                      <li key={step.step}>
                        <strong>{step.title}:</strong> {step.desc}
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            )}

            {/* Specifications */}
            {product.specs && (
              <details className="pdp-details">
                <summary>Detalles & Especificaciones</summary>
                <div className="details-content">
                  <ul>
                    {product.specs.map((spec, i) => (
                      <li key={i}>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}

            {/* Envíos y Cuidados */}
            <details className="pdp-details">
              <summary>Envíos y Garantía de Bienestar</summary>
              <div className="details-content">
                <p>
                  Envíos express protegidos a todo México en 2 a 4 días hábiles. Empaque 100% sustentable y libre de plásticos vírgenes. Si tu pieza llega con algún detalle, la reemplazamos de inmediato sin costo.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* ============================================================
          COMMUNITY & CUSTOMER REVIEWS
          ============================================================ */}
      <ProductReviews product={product} />

      {/* ============================================================
          BOTTOM: COMPLEMENTARY RITUAL PRODUCTS
          ============================================================ */}
      {complementaryProducts.length > 0 && (
        <section className="product-cross-sell container">
          <h2 className="cross-sell-title">Completa tu Santuario</h2>
          <div className="cross-sell-grid">
            {complementaryProducts.map((cross) => (
              <div
                key={cross._wixId || cross.id}
                className="cross-sell-item"
                onClick={() => {
                  const targetSlug = cross.slug || cross._wixId || cross.id;
                  if (onNavigate) onNavigate('product', cross);
                  navigate(`/producto/${targetSlug}`);
                }}
              >
                <div className="shop-item-img-wrap">
                  <img src={cross.img} alt={cross.name} loading="lazy" />
                </div>
                <div className="shop-item-info">
                  <span className="shop-item-mood">{cross.emotionalName}</span>
                  <h3 className="shop-item-title">{cross.name}</h3>
                  <p className="shop-item-desc">{cross.shortDesc}</p>
                  <div className="shop-item-bottom">
                    <span className="shop-item-price">{cross.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
