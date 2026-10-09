import { useState } from 'react';
import { submitToContactoGeneral } from '../lib/formsService';
import './Gifts.css';

// Usaremos dos de nuestras imágenes de categorías para simular los Bundles de lujo
import imgBundle1 from '../assets/images/category-candle.png'; 
import imgBundle2 from '../assets/images/jardin-zen-detalle.jpg'; 

const bundles = [
  { id: 'b1', name: 'Ritual de Descanso Profundo', price: '2,490 MXN', priceNum: 2490, img: imgBundle1 },
  { id: 'b2', name: 'Set Purificación Zen & Vasija', price: '1,890 MXN', priceNum: 1890, img: imgBundle2 },
];

export default function Gifts({ onAddToCart }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({ to: '', from: '', message: '' });

  const handleFlip = (e) => {
    e.preventDefault();
    if (formData.to && formData.from) {
      setIsFlipped(true);
      submitToContactoGeneral({
        nombre: formData.from,
        email: '',
        telefono: '',
        empresa: `Regalo para: ${formData.to}`,
        industria: 'Dedicatoria de Regalo',
        mensaje: `Dedicatoria personalizada:\nDe: ${formData.from}\nPara: ${formData.to}\nMensaje: ${formData.message || 'Sin mensaje adicional'}`,
      }).catch(() => {});
    }
  };

  const handleAddBundle = (bundle) => {
    if (onAddToCart) {
      onAddToCart({
        id: `gift-${bundle.id}`,
        name: `Pack Regalo: ${bundle.name}`,
        emotionalName: `Dedicatoria para ${formData.to || 'Alguien Especial'}`,
        price: bundle.price,
        priceNum: bundle.priceNum,
        img: bundle.img,
        customDetails: {
          to: formData.to,
          from: formData.from,
          message: formData.message,
        }
      });
    }
  };

  return (
    <section className="gifts-section" id="gifts">
      <div className="gifts__header">
         <span className="section-tag">Gifting</span>
         <h2>Regala momentos, no objetos</h2>
      </div>

      <div className="gifts__scene">
         {/* El Contenedor 3D principal */}
         <div className={`gift-card ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* CARA FRONTAL (La Dedicatoria) */}
            <div className="gift-card__face gift-card__front">
               <div className="card-texture"></div>
               
               <div className="card-content">
                 <h3 className="card-title">Escribe tu dedicatoria</h3>
                 
                 <form onSubmit={handleFlip} className="card-form">
                    <div className="input-group">
                       <label>Para:</label>
                       <input 
                         type="text" 
                         className="handwriting-input" 
                         value={formData.to} 
                         onChange={(e)=>setFormData({...formData, to: e.target.value})}
                         required
                         placeholder="Escribe su nombre..."
                       />
                    </div>
                    
                    <div className="input-group">
                       <label>De:</label>
                       <input 
                         type="text" 
                         className="handwriting-input" 
                         value={formData.from} 
                         onChange={(e)=>setFormData({...formData, from: e.target.value})}
                         required
                         placeholder="Tu nombre..."
                       />
                    </div>
                    
                    <div className="input-group message-group">
                       <label>Mensaje:</label>
                       <textarea 
                         className="handwriting-input" 
                         rows="2"
                         value={formData.message} 
                         onChange={(e)=>setFormData({...formData, message: e.target.value})}
                         placeholder="Que esta luz te acompañe..."
                       ></textarea>
                    </div>
                    
                    <button type="submit" className="btn-seal">
                       Sellar y Elegir Regalo <span className="arrow">→</span>
                    </button>
                 </form>
               </div>
            </div>

            {/* CARA TRASERA (Los Productos) */}
            <div className="gift-card__face gift-card__back">
               <div className="card-texture"></div>
               
               <div className="card-content">
                  <div className="back-header">
                     <h3>Selecciona el Bundle Especial</h3>
                     <p>Para: <span className="handwriting-text">{formData.to}</span></p>
                  </div>
                  
                  <div className="bundles-list">
                    {bundles.map(bundle => (
                      <div className="bundle-item" key={bundle.id}>
                         <img src={bundle.img} alt={bundle.name} className="bundle-img" />
                         <div className="bundle-info">
                            <h4>{bundle.name}</h4>
                            <span className="bundle-price">{bundle.price}</span>
                         </div>
                         <button 
                           type="button"
                           className="btn-add-bundle"
                           onClick={() => handleAddBundle(bundle)}
                         >
                           Añadir
                         </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" className="btn-back" onClick={() => setIsFlipped(false)}>
                     ← Editar Dedicatoria
                  </button>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
}
