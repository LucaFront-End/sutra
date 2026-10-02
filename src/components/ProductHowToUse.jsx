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

// Zen garden steps images
import stepZen1 from '../assets/images/cat-jardin-zen.jpg';
import stepZen2 from '../assets/images/jardin-zen-detalle.jpg';
import stepZen3 from '../assets/images/category-zen.png';
import stepZen4 from '../assets/images/cartas-rituales-mesa.jpg';

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

  // Determine guide type: 'velas' | 'te' | 'zen' | 'aromas'
  let guideType = 'velas';

  if (category === 'te' || name.includes('té') || name.includes('te') || name.includes('infus')) {
    guideType = 'te';
  } else if (
    category === 'accesorios' ||
    subcategory === 'jardin-zen' ||
    name.includes('zen') ||
    name.includes('jardín') ||
    name.includes('jardin') ||
    name.includes('carta') ||
    name.includes('vasija')
  ) {
    guideType = 'zen';
  } else if (category === 'aromas' && !name.includes('vela')) {
    guideType = 'aromas';
  } else {
    guideType = 'velas';
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
          title: 'LLENA TU CONTENEDOR',
          desc: 'Escoge el contenedor que quieras (cerámica, cristal o cuenco) y llénalo con la cera en arena Sutra®.',
          img: stepCandle1,
          alt: 'Llenar vasija con cera en arena',
        },
        {
          num: '2',
          title: 'AGREGA LA MECHA',
          desc: 'Inserta la mecha en el centro de las perlas de cera, dejando sobresalir únicamente 1 cm.',
          img: stepCandle2,
          alt: 'Insertar mecha en la cera en arena',
        },
        {
          num: '3',
          title: 'ENCIENDE LA VELA',
          desc: 'Enciende la mecha y (opcional) añade unas 5 a 8 gotas de tu esencia Sutra favorita sobre la arena.',
          img: stepCandle3,
          alt: 'Encender vela de cera en arena con llama viva',
        },
        {
          num: '4',
          title: 'REEMPLAZA EL PABILO',
          desc: 'Al consumirse, retira el cono de cera derretida, inserta una nueva mecha y ¡tienes una vela nueva en segundos!',
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
      eyebrow: 'OBJETOS DE RITUAL',
      title: '¿Cómo uso mi jardín zen?',
      subtitle: 'Medita con las manos y aquieta el flujo de pensamientos a través del trazo consciente',
      steps: [
        {
          num: '1',
          title: 'EXTIENDE LA ARENA',
          desc: 'Vierte la arena de cuarzo blanco de manera homogénea sobre la base circular de madera de nogal macizo.',
          img: stepZen1,
          alt: 'Extender arena en la base del jardín zen',
        },
        {
          num: '2',
          title: 'UBICA LOS ELEMENTOS',
          desc: 'Coloca las rocas naturales buscando armonía visual, equilibrio asimétrico y sensación de espacio abierto.',
          img: stepZen2,
          alt: 'Disposición de piedras y rocas en la arena',
        },
        {
          num: '3',
          title: 'TRAZA TUS PATRONES',
          desc: 'Toma el rastrillo de madera y dibuja ondas concéntricas con movimientos lentos y respiración pausada.',
          img: stepZen3,
          alt: 'Trazar patrones zen con rastrillo de madera',
        },
        {
          num: '4',
          title: 'TOMA UNA CARTA RITUAL',
          desc: 'Elige una de las cartas reflexivas Sutra para anclar una intención positiva y presente para tu día.',
          img: stepZen4,
          alt: 'Cartas de rituales y meditación Sutra',
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
