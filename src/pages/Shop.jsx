import { useState, useEffect } from 'react';
import './Shop.css';

// Reusing premium assets
import imgVela from '../assets/images/cat-velas.png';
import imgSpray from '../assets/images/cat-sprays.png';
import imgDifusor from '../assets/images/cat-difusores.png';
import imgAceite from '../assets/images/cat-aceites.png';

const shopProducts = [
  { id: 'p1', category: 'velas', name: 'Noche Serena', price: '980 MXN', img: imgVela, emotionalName: 'Descanso Profundo' },
  { id: 'p2', category: 'sprays', name: 'Amanecer Dorado', price: '650 MXN', img: imgSpray, emotionalName: 'Despertar' },
  { id: 'p3', category: 'difusores', name: 'Bosque Interior', price: '1,200 MXN', img: imgDifusor, emotionalName: 'Claridad Mental' },
  { id: 'p4', category: 'aceites', name: 'Templo de Humo', price: '550 MXN', img: imgAceite, emotionalName: 'Meditación' },
  { id: 'p5', category: 'velas', name: 'Luz de Luna', price: '980 MXN', img: imgVela, emotionalName: 'Calma Absoluta' },
  { id: 'p6', category: 'sprays', name: 'Lluvia de Verano', price: '650 MXN', img: imgSpray, emotionalName: 'Frescura Renovadora' },
];

export default function Shop({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = filter === 'all' ? shopProducts : shopProducts.filter(p => p.category === filter);

  return (
    <div className="shop-page fade-in">
       <header className="shop-header">
         <span className="shop-tag">La Tienda</span>
         <h1>La Colección</h1>
         <p>Encuentra tu próximo ritual.</p>
       </header>
       
       <div className="shop-layout">
          {/* Aesthetic Minimalist Filters */}
          <aside className="shop-filters">
             <ul>
               <li><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todos los Rituales</button></li>
               <li><button className={filter === 'velas' ? 'active' : ''} onClick={() => setFilter('velas')}>Velas</button></li>
               <li><button className={filter === 'sprays' ? 'active' : ''} onClick={() => setFilter('sprays')}>Home Sprays</button></li>
               <li><button className={filter === 'difusores' ? 'active' : ''} onClick={() => setFilter('difusores')}>Difusores</button></li>
               <li><button className={filter === 'aceites' ? 'active' : ''} onClick={() => setFilter('aceites')}>Aceites</button></li>
             </ul>
          </aside>
          
          {/* Airy Grid */}
          <main className="shop-grid">
             {filtered.map(product => (
               <article className="shop-item" key={product.id} onClick={() => onNavigate('product', product)}>
                 <div className="shop-item-img-wrap">
                   <img src={product.img} alt={product.name} />
                   <div className="shop-item-hover">
                      <button className="btn-quick-view">Ver Ritual</button>
                   </div>
                 </div>
                 <div className="shop-item-info">
                   <span className="shop-item-mood">{product.emotionalName}</span>
                   <h2>{product.name}</h2>
                   <span className="shop-item-price">{product.price}</span>
                 </div>
               </article>
             ))}
          </main>
       </div>
    </div>
  );
}
