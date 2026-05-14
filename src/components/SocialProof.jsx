import React from 'react';
import './SocialProof.css';

// Usamos nuestras imágenes premium generadas para simular el UGC (User Generated Content)
import imgVela from '../assets/images/cat-velas.png';
import imgSpray from '../assets/images/cat-sprays.png';
import imgAceite from '../assets/images/cat-aceites.png';
import imgDifusor from '../assets/images/cat-difusores.png';

const row1 = [
  { id: 'r1-1', img: imgVela, user: '@maca.home', text: '"Paz total antes de dormir"', type: 'video' },
  { id: 'r1-2', img: imgSpray, user: '@ana.vibes', text: '"Imprescindible en mi escritorio"', type: 'photo' },
  { id: 'r1-3', img: imgAceite, user: '@sofia.zen', text: '"Mi ritual de todas las mañanas"', type: 'video' },
  { id: 'r1-4', img: imgDifusor, user: '@valeria.p', text: '"El olor es simplemente adictivo"', type: 'photo' },
];

const row2 = [
  { id: 'r2-1', img: imgAceite, user: '@caro.rituals', text: '"El mejor regalo que me hicieron"', type: 'photo' },
  { id: 'r2-2', img: imgDifusor, user: '@juliet.r', text: '"Convirtió mi cuarto en un spa"', type: 'video' },
  { id: 'r2-3', img: imgVela, user: '@paula.deco', text: '"Dura muchísimo y huele premium"', type: 'photo' },
  { id: 'r2-4', img: imgSpray, user: '@lu.lifestyle', text: '"Lo llevo en la cartera siempre"', type: 'video' },
];

export default function SocialProof() {
  return (
    <section className="social-proof" id="community">
      <div className="social-proof__header">
        <span className="section-tag">La Comunidad</span>
        <h2>Sutra en tu hogar</h2>
      </div>

      <div className="film-strip-container">
        
        {/* STRIP 1: Moves Left */}
        <div className="film-strip strip-left">
          <div className="strip-track">
            {/* Render 3 identical blocks for a seamless mathematical loop */}
            {[1, 2, 3].map((blockIndex) => (
              <div className="strip-block" key={`block1-${blockIndex}`}>
                {row1.map((item) => (
                  <div className="ugc-card" key={`${blockIndex}-${item.id}`}>
                    <img src={item.img} alt="UGC Sutra" className="ugc-bg" />
                    
                    {/* Persistent UI elements */}
                    {item.type === 'video' && <div className="play-icon">▶</div>}
                    <div className="ugc-badge">
                      <span className="ugc-user">{item.user}</span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="ugc-overlay">
                      <p className="ugc-text">{item.text}</p>
                      <button className="btn-ugc-shop">
                        Shop the Ritual <span className="arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* STRIP 2: Moves Right */}
        <div className="film-strip strip-right">
          <div className="strip-track">
            {[1, 2, 3].map((blockIndex) => (
              <div className="strip-block" key={`block2-${blockIndex}`}>
                {row2.map((item) => (
                  <div className="ugc-card" key={`${blockIndex}-${item.id}`}>
                    <img src={item.img} alt="UGC Sutra" className="ugc-bg" />
                    
                    {item.type === 'video' && <div className="play-icon">▶</div>}
                    <div className="ugc-badge">
                      <span className="ugc-user">{item.user}</span>
                    </div>

                    <div className="ugc-overlay">
                      <p className="ugc-text">{item.text}</p>
                      <button className="btn-ugc-shop">
                        Shop the Ritual <span className="arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
