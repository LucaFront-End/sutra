import { useEffect } from 'react';
import './ProductPage.css';

// Reusing assets for cross-sell
import imgCross1 from '../assets/images/cat-sprays.png';
import imgCross2 from '../assets/images/cat-aceites.png';

export default function ProductPage({ product, onNavigate }) {
  // Fallback in case there is no product in state
  const p = product || {
     name: 'Noche Serena', 
     emotionalName: 'Descanso Profundo', 
     img: imgCross1, // Safe fallback
     price: '980 MXN'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [p]);

  return (
    <div className="product-page fade-in">
       {/* Breadcrumb / Back */}
       <div className="product-nav">
         <button className="btn-back-shop" onClick={() => onNavigate('shop')}>
           ← Volver a la colección
         </button>
       </div>
       
       <div className="product-hero">
          {/* LIFESTYLE IMAGE (Left) */}
          <div className="product-gallery">
             <div className="img-sticky-wrapper">
               <img src={p.img} alt={p.name} className="product-main-img" />
             </div>
          </div>

          {/* DETAILS (Right) */}
          <div className="product-details">
             
             <div className="product-header">
               <span className="product-emotional-name">{p.emotionalName}</span>
               <h1 className="product-title">{p.name}</h1>
               <p className="product-price">{p.price}</p>
             </div>
             
             {/* BENEFICIO EMOCIONAL */}
             <div className="product-benefit">
               <span className="benefit-icon">✧</span>
               <p>Baja el ritmo, apaga la ansiedad y prepara tu espacio para un descanso reparador profundo. Un refugio olfativo para el final del día.</p>
             </div>

             {/* DESCRIPCIÓN SENSORIAL */}
             <div className="product-sensorial">
               <p>Un acorde sedante de lavanda salvaje de la Patagonia, mezclado con la tibieza terrosa del sándalo y un toque sutil de vainilla ahumada. Huele a una noche de lluvia vista desde la seguridad de tu cama.</p>
             </div>
             
             <button className="btn-add-to-cart">
               Añadir al carrito <span className="cart-price">• {p.price}</span>
             </button>

             {/* ACORDEONES (QUÉ INCLUYE, CÓMO USAR, ETC) */}
             <div className="product-accordion">
                <details className="pdp-details" open>
                  <summary>Qué incluye</summary>
                  <div className="details-content">
                    <ul>
                      <li>Vela vertida a mano (250g) en cera de coco</li>
                      <li>Envase de vidrio esmerilado reutilizable</li>
                      <li>Caja rígida premium ideal para regalo</li>
                      <li>Tubito de cristal con cerillos de madera dorados</li>
                    </ul>
                  </div>
                </details>

                <details className="pdp-details">
                  <summary>Cómo usar</summary>
                  <div className="details-content">
                    <p>Enciende la vela 30 minutos antes de dormir. Apaga las luces principales. Cuando la capa superior esté totalmente líquida, apágala suavemente usando un matacandelas para no generar humo. Respira hondo 3 veces antes de cerrar los ojos.</p>
                  </div>
                </details>

                <details className="pdp-details">
                  <summary>Ritual recomendado</summary>
                  <div className="details-content">
                    <p><strong>El Ritual de Desconexión:</strong> Ideal para acompañar la lectura de un libro o tu rutina de skincare nocturna. Pon tu teléfono en modo avión, enciende la vela y deja que la luz ámbar cálida guíe tu mente hacia el sueño.</p>
                  </div>
                </details>

                <details className="pdp-details">
                  <summary>Aromas compatibles</summary>
                  <div className="details-content">
                    <p>Diseñada para hacer <em>layering</em> olfativo. Combina a la perfección con nuestro <strong>Home Spray Bosque Interior</strong>. Pulveriza el spray en tus sábanas y enciende esta vela en la mesa de noche para crear una experiencia inmersiva.</p>
                  </div>
                </details>
             </div>
          </div>
       </div>

       {/* REVIEWS */}
       <section className="product-reviews">
          <div className="reviews-header">
            <h2>Lo que siente nuestra comunidad</h2>
            <div className="overall-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-score">4.9/5 (128 reviews)</span>
            </div>
          </div>
          <div className="reviews-grid">
             <div className="review-card">
               <div className="stars">★★★★★</div>
               <p className="review-text">"Literalmente dejé de tomar pastillas para dormir. Prenderla se volvió mi señal física para decirle al cerebro que el día terminó."</p>
               <span className="review-author">— Ana M.</span>
             </div>
             <div className="review-card">
               <div className="stars">★★★★★</div>
               <p className="review-text">"El olor llena mi cuarto en menos de 5 minutos. Huele exactamente a entrar a un spa en un hotel 5 estrellas en Tulum."</p>
               <span className="review-author">— Valeria S.</span>
             </div>
             <div className="review-card">
               <div className="stars">★★★★★</div>
               <p className="review-text">"El empaque es tan lujoso que me dio pena prenderla la primera vez. Ahora no puedo dormir sin ella."</p>
               <span className="review-author">— Caro D.</span>
             </div>
          </div>
       </section>

       {/* CROSS-SELL */}
       <section className="product-cross-sell">
          <h2>Completa tu ritual</h2>
          <div className="cross-sell-grid">
             <div className="shop-item cross-sell-item" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                <div className="shop-item-img-wrap">
                  <img src={imgCross1} alt="Spray" />
                </div>
                <div className="shop-item-info">
                   <h2>Home Spray Noche Serena</h2>
                   <span className="shop-item-price">650 MXN</span>
                </div>
             </div>
             <div className="shop-item cross-sell-item" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                <div className="shop-item-img-wrap">
                  <img src={imgCross2} alt="Cerillos" />
                </div>
                <div className="shop-item-info">
                   <h2>Cerillos Botánicos</h2>
                   <span className="shop-item-price">250 MXN</span>
                </div>
             </div>
          </div>
       </section>
    </div>
  );
}
