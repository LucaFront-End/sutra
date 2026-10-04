import React from 'react';
import './ProductHowToUse.css';

// Candle steps images
import stepCandle1 from '../assets/images/step-candle-1-pour.jpg';
import stepCandle2 from '../assets/images/step-candle-2-wick.jpg';
import stepCandle3 from '../assets/images/step-candle-3-lit.jpg';
import stepCandle4 from '../assets/images/step-candle-4-refresh.jpg';

// Tea steps images
import stepTea1 from '../assets/images/step-tea-1-water.jpg';
import stepTea2 from '../assets/images/step-tea-2-spoon.jpg';
import stepTea3 from '../assets/images/step-tea-3-steep.jpg';
import stepTea4 from '../assets/images/cat-te-ceremonial.jpg';

// Zen garden steps images (Authentic Sutra Kit Sensorial)
import stepZen1 from '../assets/images/step-zen-1-sand.jpg';
import stepZen2 from '../assets/images/step-zen-2-spheres.jpg';
import stepZen3 from '../assets/images/step-zen-3-patterns.jpg';
import stepZen4 from '../assets/images/step-zen-4-brush.jpg';

// Aroma steps fallback
import stepAroma1 from '../assets/images/step-candle-1-pour.jpg';
import stepAroma2 from '../assets/images/cat-aceites.png';
import stepAroma3 from '../assets/images/step-candle-3-lit.jpg';
import stepAroma4 from '../assets/images/cat-aromas-wide.jpg';

export default function ProductHowToUse({ product }) {
  if (!product) return null;

  const category = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const subcategory = (product.subcategory || '').toLowerCase();

  // Determine guide type: 'velas' | 'aromas' | 'te' | 'zen'
  let guideType = 'velas';

  if (category === 'aromas') {
    guideType = 'aromas';
  } else if (category === 'te') {
    guideType = 'te';
  } else if (category === 'accesorios') {
    guideType = 'zen';
  } else if (category === 'velas') {
    guideType = 'velas';
  } else {
    // Strict pattern matching without false positives (e.g. avoids matching 'te' in 'paquete' or 'aceite')
    const isVela = name.includes('vela') || name.includes('cera') || name.includes('arena') || name.includes('pabilo');
    const isAroma = !isVela && (name.includes('esencia') || name.includes('aroma') || name.includes('spray') || name.includes('bruma') || name.includes('difusor') || name.includes('aceite') || name.includes('gotero'));
    const isTe = !isVela && !isAroma && (/\bté\b/i.test(name) || /\bte\b/i.test(name) || name.includes('infusión') || name.includes('tisana') || name.includes('chawan'));
    const isZen = !isVela && !isAroma && (name.includes('zen') || name.includes('jardín') || name.includes('carta') || name.includes('baraja') || name.includes('vasija'));

    if (isAroma) guideType = 'aromas';
    else if (isTe) guideType = 'te';
    else if (isZen) guideType = 'zen';
    else guideType = 'velas';
  }

  // Configurations for each product type
  const config = {
    velas: {
      eyebrow: 'GUÍA RITUAL SUTRA',
      title: '¿Cómo uso mi vela de arena?',
      subtitle: '4 pasos sencillos para transformar cualquier vasija en una vela sustentable y eterna',
      steps: [
        {
          num: '1',
          title: 'VIERTE LA CERA',
          desc: 'Vierte la cera en arena Sutra® desde su bolsa kraft en tu vasija, cuenco o contenedor favorito.',
          img: stepCandle1,
          alt: 'Verter cera en arena Sutra desde la bolsa kraft en vasija',
        },
        {
          num: '2',
          title: 'INSERTA LA MECHA',
          desc: 'Coloca la mecha en el centro de las perlas de cera, dejando sobresalir únicamente 1 cm.',
          img: stepCandle2,
          alt: 'Insertar mecha en la cera en arena',
        },
        {
          num: '3',
          title: 'GOTAS DE ESENCIA & ENCIENDE',
          desc: 'Añade de 5 a 8 gotas de tu esencia botánica Sutra cerca del pabilo y enciende con fósforo de madera.',
          img: stepCandle3,
          alt: 'Encender vela de cera en arena con esencia botánica',
        },
        {
          num: '4',
          title: 'RENUEVA AL INSTANTE',
          desc: 'Al consumirse, retira el cono de cera solidificada, inserta una nueva mecha y ¡tienes una vela nueva siempre!',
          img: stepCandle4,
          alt: 'Vela renovada y reutilizable con nuevo pabilo',
        },
      ],
    },

    te: {
      eyebrow: 'CEREMONIA BOTÁNICA',
      title: '¿Cómo preparo mi té ceremonial?',
      subtitle: 'Una pausa consciente en 4 pasos para calmar tu mente y despertar tus sentidos',
      steps: [
        {
          num: '1',
          title: 'CALIENTA EL AGUA',
          desc: 'Calienta agua pura a 80°C - 85°C. Evita el hervor agresivo para respetar los aceites botánicos y antioxidantes.',
          img: stepTea1,
          alt: 'Agua caliente a temperatura ideal para té',
        },
        {
          num: '2',
          title: 'MIDE LAS BOTÁNICAS',
          desc: 'Mide 1 cucharada de té (2 a 3 gramos) de flores y hojas puras en tu infusor o tetera de cerámica.',
          img: stepTea2,
          alt: 'Medir té botánico Sutra con cuchara de madera',
        },
        {
          num: '3',
          title: 'INFUSIONA EN PAUSA',
          desc: 'Vierte el agua y deja reposar de 4 a 6 minutos; inhala el vapor aromático mientras desaceleras tu respiración.',
          img: stepTea3,
          alt: 'Infusión de té botánico con vapor',
        },
        {
          num: '4',
          title: 'SIRVE Y DISFRUTA',
          desc: 'Sirve en tu taza o chawan preferido. Saborea cada sorbo en presencia plena para reconectar contigo.',
          img: stepTea4,
          alt: 'Taza de té ceremonial servida',
        },
      ],
    },

    zen: {
      eyebrow: 'OBJETOS RITUALES',
      title: '¿Cómo uso mi jardín zen sensorial?',
      subtitle: 'Medita con las manos y aquieta tu mente a través del contacto táctil y el trazo consciente',
      steps: [
        {
          num: '1',
          title: 'VIERTE LA ARENA DE CUARZO',
          desc: 'Vierte la arena de la botella sobre la base circular de bambú natural y extiéndela creando tu lienzo.',
          img: stepZen1,
          alt: 'Verter arena de cuarzo en la bandeja circular de bambú',
        },
        {
          num: '2',
          title: 'ACOPLA EL SOPORTE Y ESFERAS',
          desc: 'Ubica la media luna con las 4 esferas sensoriales de cerámica artesanal, cada una con su textura ritual.',
          img: stepZen2,
          alt: 'Colocar soporte y esferas sensoriales con texturas',
        },
        {
          num: '3',
          title: 'TRAZA ONDAS Y PATRONES',
          desc: 'Haz rodar las esferas sobre la arena o usa el peine de madera para dibujar surcos fluidos y concéntricos.',
          img: stepZen3,
          alt: 'Rodar esfera sensorial de terracota y trazar ondas con peine',
        },
        {
          num: '4',
          title: 'SUAVIZA Y RENUEVA TU CALMA',
          desc: 'Pasa la brocha de cerdas naturales para suavizar la superficie, soltar tensiones y reiniciar tu práctica.',
          img: stepZen4,
          alt: 'Suavizar arena con la brocha de madera para calma y presencia',
        },
      ],
    },

    aromas: {
      eyebrow: 'ALQUIMIA SENSORIAL',
      title: '¿Cómo uso mi esencia ritual?',
      subtitle: 'Aromatiza tus velas de arena y espacios para crear un santuario de paz',
      steps: [
        {
          num: '1',
          title: 'PREPARA TU VELA O DIFUSOR',
          desc: 'Coloca tu vela de cera en arena Sutra® o llena tu difusor ultrasónico con agua fresca y limpia.',
          img: stepAroma1,
          alt: 'Preparar base para aromatizar',
        },
        {
          num: '2',
          title: 'DOSIFICA EL GOTERO',
          desc: 'Aplica de 5 a 8 gotas de tu esencia Sutra directamente sobre los granos de cera cerca del pabilo.',
          img: stepAroma2,
          alt: 'Dosificar gotas de esencia concentrada',
        },
        {
          num: '3',
          title: 'ENCIENDE O ACTIVA',
          desc: 'Enciende la mecha. El calor liberará gradualmente las notas amaderadas y florales por toda la habitación.',
          img: stepAroma3,
          alt: 'Calor liberando notas de esencia aromática',
        },
        {
          num: '4',
          title: 'RESPIRA Y DISFRUTA',
          desc: 'Cierra los ojos, inhala hondo y permite que la atmósfera limpia te transporte a un estado de calma profunda.',
          img: stepAroma4,
          alt: 'Ambiente perfumado y sereno',
        },
      ],
    },
  };

  const currentGuide = config[guideType];

  return (
    <section className="product-how-to-use-section">
      <div className="how-to-use-container">
        {/* Header */}
        <div className="how-to-use-header">
          <span className="how-to-use-eyebrow">{currentGuide.eyebrow}</span>
          <h2 className="how-to-use-title">{currentGuide.title}</h2>
          <p className="how-to-use-subtitle">{currentGuide.subtitle}</p>
        </div>

        {/* 4 Steps Visual Cards Grid */}
        <div className="how-to-use-grid">
          {currentGuide.steps.map((step, idx) => (
            <div key={idx} className="how-to-use-card">
              <div className="how-to-use-img-wrap">
                <img 
                  src={step.img} 
                  alt={step.alt} 
                  loading="lazy" 
                />
                <span className="step-badge-number">{step.num}</span>
              </div>
              <div className="how-to-use-card-content">
                <h3 className="step-card-title">
                  {step.num}. {step.title}
                </h3>
                <p className="step-card-desc">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
