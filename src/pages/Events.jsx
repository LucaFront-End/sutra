import { useState, useEffect } from 'react';
import './Events.css';

// Assets
import imgBanquetes from '../assets/images/eventos-banquetes.jpg';
import imgWhiteWax from '../assets/images/cera-blanca.jpg';
import imgBlackWax from '../assets/images/cera-negra.jpg';
import imgCandleLit from '../assets/images/candle-lit.png';
import imgVasijas from '../assets/images/vasijas.jpg';

export default function Events({ onNavigate, onAddToCart }) {
  // Calculator state
  const [tablesCount, setTablesCount] = useState(20);
  const [candlesPerTable, setCandlesPerTable] = useState(3);
  const [durationHours, setDurationHours] = useState(6);

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    ciudad: '',
    tipoNegocio: 'Wedding Planner',
    tipoRequerimiento: 'cera-granulada',
    colorCera: 'Blanca Perlada',
    volumenAprox: '15 kg (Pack Banquetero)',
    fechaEvento: '',
    detalles: '',
    whatsapp: '',
    email: '',
    facturaSat: true,
    urgente: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [folioNumber, setFolioNumber] = useState('');
  const [activeSector, setActiveSector] = useState('wedding');

  const toggleSector = (id) => {
    setActiveSector(prev => prev === id ? null : id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculation formulas
  const totalCandles = tablesCount * candlesPerTable;
  // Avg 120g of granulated wax per glass cylinder/vessel setup
  const totalKg = Math.max(1, Math.round((totalCandles * 0.12 * 10) / 10));
  const totalWicks = totalCandles * 2; // Extra wicks for adjustments
  // Cost traditional vs Sutra
  const tradCost = totalCandles * 120; // 120 MXN per disposable pillar candle
  const sutraCost = totalKg * 340; // 340 MXN per bulk kg for wholesale
  const savings = Math.max(0, tradCost - sutraCost);

  // Business types for Step 1
  const businessTypes = [
    { id: 'Wedding Planner', icon: '💍', label: 'Wedding Planner', desc: 'Bodas & celebraciones' },
    { id: 'Catering / Banquetera', icon: '🍽️', label: 'Catering / Banquetera', desc: 'Montajes masivos' },
    { id: 'Hotel / Resort', icon: '🏨', label: 'Hotel / Resort / Spa', desc: 'Hospitalidad & terrazas' },
    { id: 'Restaurante / Bar', icon: '🍸', label: 'Restaurante / Rooftop', desc: 'Mesas & ambiente' },
    { id: 'Corporativo / Empresa', icon: '🏢', label: 'Corporativo / Oficinas', desc: 'Regalos VIP & galas' },
    { id: 'Decoración / Otro', icon: '✦', label: 'Diseño Floral / Otro', desc: 'Ambientación & floral' },
  ];

  // Requirements for Step 2
  const requirementTypes = [
    { id: 'cera-granulada', label: 'Cera Granulada por Kilos', desc: 'Cera en sacos y pabilos para rellenar tus recipientes' },
    { id: 'cilindros-completos', label: 'Cera + Cilindros de Cristal', desc: 'Kits completos con cristalería templada listos para mesa' },
    { id: 'corporativo', label: 'Regalos Corporativos con Logo', desc: 'Cajas rituales personalizadas con tu marca empresarial' },
    { id: 'muestras', label: 'Kit de Muestras para Planner', desc: 'Set de pruebas técnicas para mostrar a tus clientes' },
  ];

  // Wax colors
  const waxColors = [
    { id: 'Blanca Perlada', label: 'Blanca Perlada', badge: '⚪', desc: 'Clásica para bodas y recepciones finas' },
    { id: 'Negra Obsidiana', label: 'Negra Obsidiana', badge: '⚫', desc: 'Minimalismo y dramatismo nocturno' },
    { id: 'Mixta (Blanca & Negra)', label: 'Combinación Dual', badge: '🌓', desc: 'Mezcla y gradientes de autor' }
  ];

  // Quick volume chips
  const volumeChips = [
    '5 kg (~40 mesas)',
    '15 kg (Pack Banquetero)',
    '30 kg (Gran Escala)',
    '50+ kg (Industrial)',
    'Aún no sé, asesorarme'
  ];

  // Validation handlers
  const validateStep1 = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'Ingresa tu nombre y apellido.';
    if (!formData.empresa.trim()) errors.empresa = 'Ingresa el nombre de tu empresa o marca.';
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.volumenAprox && !formData.detalles) {
      errors.volumenAprox = 'Selecciona o escribe un volumen estimado.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'Ingresa tu número de WhatsApp para contacto.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setStepErrors({});
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
      const generatedFolio = `SUTRA-B2B-${Math.floor(1000 + Math.random() * 9000)}`;
      setFolioNumber(generatedFolio);
      setFormSubmitted(true);
    }
  };

  const generateWhatsAppMessage = () => {
    const text = encodeURIComponent(
      `*Solicitud de Cotización B2B — Sutra México*\n` +
      `-----------------------------------------\n` +
      `✦ *Nombre:* ${formData.nombre}\n` +
      `✦ *Empresa:* ${formData.empresa} (${formData.ciudad || 'México'})\n` +
      `✦ *Sector:* ${formData.tipoNegocio}\n` +
      `✦ *Requerimiento:* ${formData.tipoRequerimiento}\n` +
      `✦ *Color Cera:* ${formData.colorCera}\n` +
      `✦ *Volumen Estimado:* ${formData.volumenAprox || formData.detalles || 'A convenir'}\n` +
      `✦ *Fecha Evento:* ${formData.fechaEvento || 'Próximamente'}\n` +
      `✦ *Factura SAT:* ${formData.facturaSat ? 'Sí, requerida' : 'No requerida'}\n` +
      `✦ *Email:* ${formData.email}\n` +
      `✦ *WhatsApp:* ${formData.whatsapp}\n` +
      `-----------------------------------------\n` +
      `Hola equipo Sutra, solicito catálogo mayorista y cotización oficial para nuestro próximo montaje.`
    );
    return `https://wa.me/5215500000000?text=${text}`;
  };

  const handleQuoteFromCalc = () => {
    setFormData(prev => ({
      ...prev,
      volumenAprox: `${totalKg} kg (${totalCandles} velas)`,
      detalles: `Calculado desde la herramienta: ${tablesCount} mesas × ${candlesPerTable} velas por mesa (${durationHours} horas)`
    }));
    setCurrentStep(1);
    const formEl = document.getElementById('cotizador');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPack = (pack) => {
    setFormData(prev => ({
      ...prev,
      tipoRequerimiento: 'cera-granulada',
      volumenAprox: `${pack.kg} - ${pack.name}`,
      detalles: `Pack seleccionado: ${pack.name} (${pack.price})`
    }));
    setCurrentStep(1);
    const formEl = document.getElementById('cotizador');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const industries = [
    {
      id: 'wedding',
      icon: '💍',
      tag: 'Bodas de Autor & Romance',
      title: 'Wedding Planners',
      shortTitle: 'Bodas',
      headline: 'Montajes románticos de ensueño sin arruinar un solo mantel',
      desc: 'Crea pasillos de ceremonia y centros de mesa impecables que duran encendidos toda la fiesta. Sin cera derramada en mantelería fina ni llamas que se apagan con la brisa de jardín o playa.',
      badge: 'Cero Riesgo de Derrame',
      image: imgBanquetes,
      imageBadge: 'Montaje en Recepción de Bodas',
      perks: [
        'No mancha mantelería importada, sedas ni vestidos de novia',
        'Autoextinguible al instante si un invitado derriba un cilindro',
        '8+ horas de llama pura sin generar humo negro ni hollín'
      ],
      waText: 'Hola equipo Sutra, me gustaría cotizar cera de arena para eventos de Wedding Planning y Bodas.'
    },
    {
      id: 'catering',
      icon: '🍽️',
      tag: 'Banquetería & Alta Producción',
      title: 'Catering & Banqueteras',
      shortTitle: 'Banquetes',
      headline: '50 mesas listas en minutos con hasta 60% de ahorro de insumos',
      desc: 'Montajes a gran escala en tiempo récord: solo vierte la cera de arena en cualquier cristalería. Al terminar el evento, retiras la mecha usada y el 90% restante vuelve intacto al saco para tu próxima fiesta.',
      badge: 'Montaje en Minutos',
      image: imgWhiteWax,
      imageBadge: 'Cera Granulada en Cristalería',
      perks: [
        'Ahorro del 60% frente al desecho constante de velas de pilar',
        'Cero raspado de parafina pegada al desmontar la vajilla',
        'Reutilizable evento tras evento sin pérdida de calidad estética'
      ],
      waText: 'Hola equipo Sutra, me gustaría cotizar cera de arena para montajes de Catering y Banquetes masivos.'
    },
    {
      id: 'hoteles-restaurantes',
      icon: '🏨',
      tag: 'Hospitalidad & Gastronomía',
      title: 'Hoteles, Restaurantes & Rooftops',
      shortTitle: 'Restaurantes',
      headline: 'Iluminación cálida y recambios en 5 segundos entre turno y turno',
      desc: 'Centros de mesa que se renuevan en 5 segundos para el siguiente comensal. Ideal para lobbies, spas, terrazas al aire libre y cenas de autor sin olores a petróleo que interfieran con la comida.',
      badge: 'Ahorro & Recambio Rápido',
      image: imgBlackWax,
      imageBadge: 'Atmósfera Nocturna & Rooftops',
      perks: [
        'Recambio de mecha en 5 segundos entre reservaciones',
        'Sin olores sintéticos que alteren la experiencia gastronómica',
        'Resistente a corrientes de aire en terrazas y rooftops'
      ],
      waText: 'Hola equipo Sutra, me gustaría cotizar cera de arena para iluminación de Hotel / Restaurante / Rooftop.'
    },
    {
      id: 'oficinas',
      icon: '🏢',
      tag: 'Corporativo & Bienestar',
      title: 'Oficinas & Eventos Corporativos',
      shortTitle: 'Corporativo',
      headline: 'Galas empresariales, activación olfativa y regalos VIP con tu marca',
      desc: 'Diseño integral para celebraciones corporativas, cenas de gala y espacios de bienestar. Personalizamos cajas rituales y recipientes con el logo de tu empresa para directivos, socios y clientes VIP.',
      badge: 'Regalos & Activaciones VIP',
      image: imgVasijas,
      imageBadge: 'Piezas Artesanales & Regalos VIP',
      perks: [
        'Regalos corporativos de alta gama con grabado de tu logo',
        'Activaciones olfativas para congresos y lanzamientos de marca',
        'Facturación fiscal SAT inmediata y 100% deducible de impuestos'
      ],
      waText: 'Hola equipo Sutra, me gustaría cotizar soluciones para Eventos Corporativos y Regalos VIP.'
    }
  ];

  const b2bPacks = [
    {
      id: 'pack-5kg',
      name: 'Pack Evento Boutique',
      kg: '5 Kilogramos',
      wicks: '150 Pabilos Orgánicos',
      yield: 'Aprox. 35 - 45 centros de mesa',
      price: '$1,950 MXN',
      pricePerKg: '$390 MXN / kg',
      ideal: 'Eventos íntimos, cenas privadas y restaurantes pequeños.',
      features: [
        '5 kg de Cera Granulada Blanca Perlada',
        '150 pabilos de algodón de combustión limpia',
        '2 esencias concentradas (Lavanda & Sándalo)',
        'Guía digital de montaje y rendimiento'
      ]
    },
    {
      id: 'pack-15kg',
      name: 'Pack Banquetero & Wedding',
      kg: '15 Kilogramos',
      wicks: '450 Pabilos Orgánicos',
      yield: 'Aprox. 120 - 150 centros de mesa',
      price: '$5,100 MXN',
      pricePerKg: '$340 MXN / kg',
      tag: 'Más elegido por Wedding Planners',
      popular: true,
      ideal: 'Bodas de 100 a 250 invitados, salones y empresas de catering.',
      features: [
        '15 kg de Cera Granulada (a elegir Blanca o Negra)',
        '450 pabilos orgánicos listos para usar',
        'Kit de 4 esencias aromáticas botánicas',
        'Asesoría técnica y calculadora de montajes',
        'Envío gratuito a todo México'
      ]
    },
    {
      id: 'pack-30kg',
      name: 'Pack Gran Escala & Hotelero',
      kg: '30 Kilogramos',
      wicks: '900 Pabilos Orgánicos',
      yield: 'Aprox. 250 - 350 centros de mesa',
      price: '$9,300 MXN',
      pricePerKg: '$310 MXN / kg',
      ideal: 'Hoteles, temporadas altas de bodas y banqueteras de gran escala.',
      features: [
        '30 kg de Cera Granulada de alta pureza',
        '900 pabilos orgánicos cortados',
        'Selección aromática premium completa',
        'Facturación fiscal deducible para empresas',
        'Atención prioritaria y reposición garantizada'
      ]
    }
  ];

  return (
    <div className="b2b-events-page fade-in">
      {/* ============================================================
          HERO SECTION B2B
          ============================================================ */}
      <section className="b2b-hero">
        <div className="b2b-hero__container container">
          <div className="b2b-hero__content">
            <span className="b2b-eyebrow">Sutra B2B · Velas de Arena & Cera Granulada</span>
            <h1 className="b2b-hero__title">
              La nueva era de la iluminación para eventos y hospitalidad.
            </h1>
            <p className="b2b-hero__subtitle">
              Diseñada exclusivamente para empresas de catering, banqueteras, wedding planners, hoteles, restaurantes y oficinas. Cero manteles arruinados, montajes en minutos y hasta un 60% de ahorro frente a velas tradicionales.
            </p>

            <div className="b2b-hero__actions">
              <a href="#cotizador" className="b2b-btn-primary">
                Solicitar Cotización Mayorista
              </a>
              <a href="#calculadora" className="b2b-btn-secondary">
                Calcular mi Evento ↓
              </a>
            </div>

            <div className="b2b-hero__metrics">
              <div className="b2b-metric">
                <strong>0%</strong>
                <span>Cera derretida o pegada</span>
              </div>
              <div className="b2b-metric-divider" />
              <div className="b2b-metric">
                <strong>Hasta 60%</strong>
                <span>Ahorro vs. velas de pilar</span>
              </div>
              <div className="b2b-metric-divider" />
              <div className="b2b-metric">
                <strong>100%</strong>
                <span>Reutilizable para tu próximo evento</span>
              </div>
            </div>
          </div>

          <div className="b2b-hero__media">
            <div className="b2b-media-frame">
              <img src={imgBanquetes} alt="Montaje de velas de arena en banquete de bodas" />
              <div className="b2b-media-badge">
                <span className="badge-spark">✦</span>
                <div>
                  <strong>Montaje con Cera de Arena Sutra</strong>
                  <small>Bodas · Banquetes · Rooftops · Hoteles</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON: TRADICIONAL VS SUTRA (VISUAL & FOTOGRAFÍAS)
          ============================================================ */}
      <section className="b2b-comparison-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">El Problema de la Cera Tradicional</span>
            <h2>Por qué los profesionales migran a las Velas de Arena</h2>
            <p className="section-subtext">Compara la experiencia operativa y financiera entre la parafina rígida de pilar y la tecnología granulada Sutra.</p>
          </div>

          {/* Visual Stat Comparison Bar */}
          <div className="b2b-comp-stats-banner">
            <div className="comp-stat-col comp-stat-col--bad">
              <span className="comp-stat-pill comp-stat-pill--bad">Velas Tradicionales</span>
              <strong className="comp-stat-huge">Hasta 70%</strong>
              <span className="comp-stat-desc">Desperdicio de cera y parafina por evento</span>
            </div>
            <div className="comp-stat-divider">
              <span>VS</span>
            </div>
            <div className="comp-stat-col comp-stat-col--good">
              <span className="comp-stat-pill comp-stat-pill--gold">✦ Velas de Arena Sutra</span>
              <strong className="comp-stat-huge comp-stat-huge--gold">100%</strong>
              <span className="comp-stat-desc">Cera recuperable lista para el próximo evento</span>
            </div>
          </div>

          <div className="b2b-comparison-grid">
            {/* Tradicionales con Media */}
            <div className="comp-card comp-card--bad">
              <div className="comp-media-header comp-media-header--bad">
                <img src={imgCandleLit} alt="Velas tradicionales con goteo y túnel" />
                <div className="comp-media-caption-bar comp-media-caption-bar--bad">
                  <span className="comp-caption-icon">✕</span>
                  <span>Cera de Parafina Rígida de Pilar</span>
                </div>
              </div>

              <div className="comp-card-badge">Limitaciones de Velas Convencionales</div>
              <ul className="comp-list">
                <li>
                  <span className="cross">✕</span>
                  <div>
                    <strong>Arruinan manteles y vajillas</strong>
                    <p>La parafina caliente gotea sobre mantelería costosa y deja marcas de grasa imposibles de remover.</p>
                  </div>
                </li>
                <li>
                  <span className="cross">✕</span>
                  <div>
                    <strong>Desperdicio económico del 50% al 70%</strong>
                    <p>Una vela a medio consumir se ve usada, con túneles feos y se tiene que desechar para el siguiente montaje.</p>
                  </div>
                </li>
                <li>
                  <span className="cross">✕</span>
                  <div>
                    <strong>Peligro ante caídas y viento</strong>
                    <p>Si un invitado o la brisa derriba el cilindro, la parafina se expande con fuego vivo.</p>
                  </div>
                </li>
                <li>
                  <span className="cross">✕</span>
                  <div>
                    <strong>Horas de limpieza y raspado</strong>
                    <p>Tu equipo pasa horas despegando cera fría de cilindros de vidrio y candelabros con navajas y agua caliente.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Sutra Granulada con Media */}
            <div className="comp-card comp-card--good">
              <div className="comp-media-header comp-media-header--good">
                <img src={imgWhiteWax} alt="Cera de arena Sutra en vaso de cristal" />
                <div className="comp-media-caption-bar comp-media-caption-bar--good">
                  <span className="comp-caption-icon">✦</span>
                  <span>Cera de Arena Granulada Sutra</span>
                </div>
              </div>

              <div className="comp-card-badge comp-card-badge--gold">✦ Ventajas de Autor Sutra</div>
              <ul className="comp-list">
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Cero cera pegada ni manchas</strong>
                    <p>No se adhiere a las paredes del recipiente ni mancha tus manteles. Al apagar, la cera circundante se mantiene seca y limpia.</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>100% Reutilizable para el siguiente evento</strong>
                    <p>Solo retiras la mecha usada con la pequeña perla endurecida. El 90% restante vuelve al saco para tu próxima fiesta.</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Autoextinguible & Máxima Seguridad</strong>
                    <p>Si el cilindro se vuelca accidentalmente, la cera granulada se desparrama y ahoga la llama en 1 segundo.</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Montaje express en cualquier recipiente</strong>
                    <p>Vierte la cantidad deseada en cilindros, copas o vasijas de cualquier tamaño y altura. Listo en segundos.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTORS / INDUSTRIES (ACORDEÓN VISUAL + BOTÓN A WHATSAPP)
          ============================================================ */}
      <section className="b2b-industries-section" id="sectores">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">Sectores & Profesionales</span>
            <h2>Soluciones a la medida de tu operación</h2>
            <p className="section-subtext">Toca cada sector para explorar la solución a tu medida y cotiza de inmediato vía WhatsApp con nuestro equipo comercial.</p>
          </div>

          <div className="sector-accordion">
            {industries.map((ind) => {
              const isOpen = activeSector === ind.id;
              return (
                <div 
                  key={ind.id} 
                  className={`sector-accordion-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button 
                    type="button"
                    className="sector-accordion-trigger"
                    onClick={() => toggleSector(ind.id)}
                    aria-expanded={isOpen}
                    id={`sector-trigger-${ind.id}`}
                  >
                    <div className="sector-trigger-left">
                      <span className="sector-icon">{ind.icon}</span>
                      <div className="sector-trigger-titles">
                        <span className="sector-trigger-tag">{ind.tag}</span>
                        <h3 className="sector-trigger-title">{ind.title}</h3>
                      </div>
                    </div>
                    <div className="sector-trigger-right">
                      <span className="sector-badge">{ind.badge}</span>
                      <span className="sector-chevron">{isOpen ? '−' : '+'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="sector-accordion-body">
                      <div className="sector-body-grid">
                        {/* Columna Izquierda: Contenido, Perks y Botón WhatsApp */}
                        <div className="sector-body-content">
                          <h4 className="sector-headline">{ind.headline}</h4>
                          <p className="sector-desc">{ind.desc}</p>

                          <div className="sector-perks-list">
                            {ind.perks.map((perk, i) => (
                              <div key={i} className="sector-perk-item">
                                <span className="sector-perk-check">✓</span>
                                <span>{perk}</span>
                              </div>
                            ))}
                          </div>

                          <div className="sector-actions">
                            <a 
                              href={`https://wa.me/5215500000000?text=${encodeURIComponent(ind.waText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sector-wa-btn"
                              id={`wa-cotizar-${ind.id}`}
                            >
                              <svg className="sector-wa-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.971.53 1.761.813 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.182-2.585-5.769-5.77-5.771zm3.392 8.234c-.143.403-.717.74-1.026.786-.299.043-.687.072-2.001-.47-1.68-.692-2.756-2.42-2.84-2.532-.083-.112-.68-1.037-.68-1.977 0-.94.492-1.401.667-1.593.175-.192.38-.24.507-.24.127 0 .254.001.365.006.118.006.277-.045.433.332.162.391.554 1.353.603 1.452.049.099.082.215.016.347-.066.132-.099.214-.198.33-.099.116-.208.259-.297.348-.1.099-.204.207-.088.406.116.199.514.848 1.103 1.372.759.675 1.399.884 1.597.983.198.099.314.083.43-.05.116-.133.497-.579.629-.778.132-.199.264-.165.446-.099.182.066 1.157.546 1.355.645.198.099.33.149.379.232.049.083.049.48-.094.883z"/>
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.65 0-3.18-.46-4.49-1.258l-.32-.193-2.955.775.789-2.88-.21-.334A8.146 8.146 0 013.818 12c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.182 3.67 8.182 8.182 0 4.512-3.67 8.182-8.182 8.182z"/>
                              </svg>
                              <span>Cotizar {ind.shortTitle} vía WhatsApp</span>
                              <span className="sector-wa-arrow">→</span>
                            </a>

                            <button 
                              type="button" 
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  tipoNegocio: ind.title,
                                  detalles: `Interés en soluciones para ${ind.title}`
                                }));
                                setCurrentStep(1);
                                const formEl = document.getElementById('cotizador');
                                if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="sector-form-link"
                            >
                              O llena el formulario formal ↓
                            </button>
                          </div>
                        </div>

                        {/* Columna Derecha: Fotografía Editorial */}
                        <div className="sector-body-media">
                          <div className="sector-media-frame">
                            <img src={ind.image} alt={ind.headline} loading="lazy" />
                            <div className="sector-media-overlay">
                              <span className="sector-media-badge">
                                <span className="sector-media-spark">✦</span>
                                {ind.imageBadge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          INTERACTIVE CALCULATOR
          ============================================================ */}
      <section className="b2b-calc-section" id="calculadora">
        <div className="container">
          <div className="calc-wrapper">
            <div className="calc-left">
              <span className="calc-tag">Calculadora de Evento</span>
              <h2>¿Cuánta cera de arena necesitas para tu próximo evento?</h2>
              <p>
                Calcula al instante los kilogramos de cera granulada, pabilos recomendados y tu ahorro estimado frente a velas tradicionales.
              </p>

              <div className="calc-controls">
                <div className="calc-control-group">
                  <div className="calc-label-row">
                    <span>Número de mesas o montajes:</span>
                    <strong>{tablesCount} mesas</strong>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={tablesCount} 
                    onChange={(e) => setTablesCount(Number(e.target.value))}
                    className="calc-range"
                  />
                  <div className="calc-range-marks">
                    <span>5 mesas</span>
                    <span>50 mesas</span>
                    <span>100 mesas</span>
                  </div>
                </div>

                <div className="calc-control-group">
                  <div className="calc-label-row">
                    <span>Velas o cilindros por mesa:</span>
                    <strong>{candlesPerTable} velas por mesa</strong>
                  </div>
                  <div className="calc-pills">
                    {[1, 2, 3, 5, 8].map((qty) => (
                      <button 
                        key={qty}
                        type="button"
                        className={`calc-pill ${candlesPerTable === qty ? 'active' : ''}`}
                        onClick={() => setCandlesPerTable(qty)}
                      >
                        {qty} {qty === 1 ? 'vela' : 'velas'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="calc-control-group">
                  <div className="calc-label-row">
                    <span>Duración estimada del evento:</span>
                    <strong>{durationHours} horas</strong>
                  </div>
                  <div className="calc-pills">
                    {[4, 6, 8, 12].map((hrs) => (
                      <button 
                        key={hrs}
                        type="button"
                        className={`calc-pill ${durationHours === hrs ? 'active' : ''}`}
                        onClick={() => setDurationHours(hrs)}
                      >
                        {hrs} horas
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-right">
              <div className="calc-summary-card">
                <span className="calc-summary-eyebrow">Estimación Recomendada</span>
                <div className="calc-metric-highlight">
                  <span className="metric-val">{totalKg} kg</span>
                  <span className="metric-desc">de Cera Granulada Sutra ({totalCandles} velas totales)</span>
                </div>

                <div className="calc-details-list">
                  <div className="calc-detail-row">
                    <span>Pabilos orgánicos requeridos:</span>
                    <strong>{totalWicks} unidades</strong>
                  </div>
                  <div className="calc-detail-row">
                    <span>Costo estimado en velas tradicionales:</span>
                    <strong className="text-strike">${tradCost.toLocaleString()} MXN</strong>
                  </div>
                  <div className="calc-detail-row highlight-row">
                    <span>Inversión con Sutra (Mayorista):</span>
                    <strong className="text-gold">${sutraCost.toLocaleString()} MXN</strong>
                  </div>
                  <div className="calc-savings-box">
                    <span>✦ Tu ahorro aproximado:</span>
                    <strong>${savings.toLocaleString()} MXN</strong>
                    <small>Y recuperas hasta el 85% de la cera para tu siguiente montaje.</small>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleQuoteFromCalc} 
                  className="calc-cta-btn"
                  style={{ border: 'none', width: '100%', cursor: 'pointer' }}
                >
                  Cotizar estos {totalKg} kg con descuento
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          B2B PACKS & PRICING
          ============================================================ */}
      <section className="b2b-packs-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">Packs Mayoristas</span>
            <h2>Formatos listos para surtir tu operación</h2>
            <p className="section-subtext">Precios directos de fábrica con entrega inmediata en Ciudad de México y envíos a toda la República.</p>
          </div>

          <div className="b2b-packs-grid">
            {b2bPacks.map((pack) => (
              <div key={pack.id} className={`b2b-pack-card ${pack.popular ? 'is-popular' : ''}`}>
                {pack.tag && <span className="pack-popular-badge">{pack.tag}</span>}
                <div className="pack-header">
                  <h3 className="pack-name">{pack.name}</h3>
                  <span className="pack-kg">{pack.kg}</span>
                  <span className="pack-yield">{pack.yield}</span>
                </div>

                <div className="pack-price-box">
                  <span className="pack-price">{pack.price}</span>
                  <span className="pack-price-per-kg">{pack.pricePerKg}</span>
                </div>

                <p className="pack-ideal"><strong>Ideal para:</strong> {pack.ideal}</p>

                <ul className="pack-features">
                  {pack.features.map((feat, i) => (
                    <li key={i}>
                      <span className="feat-check">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  type="button"
                  onClick={() => handleSelectPack(pack)} 
                  className={`pack-btn ${pack.popular ? 'pack-btn--highlight' : ''}`}
                  style={{ border: 'none', width: '100%', cursor: 'pointer' }}
                >
                  Solicitar este Pack
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          B2B CONTACT / MULTI-STEP QUOTE FORM
          ============================================================ */}
      <section className="b2b-form-section" id="cotizador">
        <div className="container">
          <div className="b2b-form-layout">
            <div className="b2b-form-info">
              <span className="form-tag">Atención Especializada B2B</span>
              <h2>Cotizador Concierge para Eventos</h2>
              <p>
                Diseñado para coordinadores y empresarios que buscan transformar la atmósfera de sus montajes con el máximo rendimiento y cero riesgos.
              </p>

              <div className="b2b-perks-list">
                <div className="perk-item">
                  <span>✦</span>
                  <p><strong>Factura Fiscal deducible (SAT):</strong> Emitimos factura electrónica CFDI válida ante el SAT en todos tus pedidos empresariales.</p>
                </div>
                <div className="perk-item">
                  <span>✦</span>
                  <p><strong>Kit de Muestras para Planners:</strong> Si organizas bodas o banquetes recurrentes, solicita tu muestra de cera granulada y mechas de prueba.</p>
                </div>
                <div className="perk-item">
                  <span>✦</span>
                  <p><strong>Despacho Prioritario:</strong> Envíos express asegurados a toda la República y entregas el mismo día en CDMX para urgencias de montaje.</p>
                </div>
              </div>

              <div className="b2b-whatsapp-box">
                <span>¿Tienes una urgencia de montaje esta semana?</span>
                <a 
                  href="https://wa.me/5215500000000?text=Hola,%20tengo%20un%20evento%20próximo%20y%20necesito%20cotización%20urgente%20de%20velas%20de%20arena%20Sutra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  💬 Chat Directo con Asesor B2B
                </a>
              </div>
            </div>

            <div className="b2b-form-card">
              {formSubmitted ? (
                <div className="form-success-state">
                  <div className="success-icon">✓</div>
                  <span className="success-folio-badge">Folio Oficial: {folioNumber}</span>
                  <h3>¡Cotización Solicitada con Éxito!</h3>
                  <p>
                    Estimado/a <strong>{formData.nombre}</strong>, hemos registrado la solicitud para <strong>{formData.empresa}</strong>. Tu cotización detallada y catálogo mayorista han sido preparados.
                  </p>

                  <div className="success-summary-box">
                    <div className="success-row">
                      <span>Sector:</span>
                      <strong>{formData.tipoNegocio}</strong>
                    </div>
                    <div className="success-row">
                      <span>Requerimiento:</span>
                      <strong>{formData.volumenAprox || 'Volumen estándar'} ({formData.colorCera})</strong>
                    </div>
                    <div className="success-row">
                      <span>Contacto:</span>
                      <strong>{formData.whatsapp} · {formData.email}</strong>
                    </div>
                  </div>

                  <div className="success-actions">
                    <a 
                      href={generateWhatsAppMessage()} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="b2b-submit-btn"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span>💬 Continuar por WhatsApp con este Folio</span>
                    </a>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormSubmitted(false);
                        setCurrentStep(1);
                      }} 
                      className="b2b-secondary-btn"
                    >
                      Hacer otra cotización
                    </button>
                  </div>
                </div>
              ) : (
                <div className="multistep-container">
                  {/* Stepper Header */}
                  <div className="multistep-header">
                    <div className="multistep-progress-bar">
                      <div 
                        className="multistep-progress-fill" 
                        style={{ width: currentStep === 1 ? '16%' : currentStep === 2 ? '50%' : '100%' }}
                      />
                    </div>
                    <div className="multistep-steps">
                      <button 
                        type="button"
                        className={`step-btn ${currentStep === 1 ? 'is-active' : ''} ${currentStep > 1 ? 'is-completed' : ''}`}
                        onClick={() => setCurrentStep(1)}
                      >
                        <span className="step-circle">{currentStep > 1 ? '✓' : '1'}</span>
                        <span className="step-label">1. Tu Perfil</span>
                      </button>

                      <button 
                        type="button"
                        className={`step-btn ${currentStep === 2 ? 'is-active' : ''} ${currentStep > 2 ? 'is-completed' : ''}`}
                        onClick={() => {
                          if (validateStep1()) setCurrentStep(2);
                        }}
                      >
                        <span className="step-circle">{currentStep > 2 ? '✓' : '2'}</span>
                        <span className="step-label">2. Tu Evento</span>
                      </button>

                      <button 
                        type="button"
                        className={`step-btn ${currentStep === 3 ? 'is-active' : ''}`}
                        onClick={() => {
                          if (validateStep1() && validateStep2()) setCurrentStep(3);
                        }}
                      >
                        <span className="step-circle">3</span>
                        <span className="step-label">3. Cotización</span>
                      </button>
                    </div>
                  </div>

                  {/* STEP 1: TU PERFIL Y SECTOR */}
                  {currentStep === 1 && (
                    <div className="step-pane fade-in">
                      <div className="step-pane-head">
                        <span className="step-indicator">Paso 1 de 3</span>
                        <h3 className="step-title">¿Cuál es el perfil de tu empresa o proyecto?</h3>
                        <p className="step-desc">Selecciona tu industria para ajustar la escala de precios y formatos adecuados.</p>
                      </div>

                      <div className="sector-grid">
                        {businessTypes.map((biz) => (
                          <div 
                            key={biz.id}
                            className={`sector-card ${formData.tipoNegocio === biz.id ? 'is-selected' : ''}`}
                            onClick={() => setFormData({ ...formData, tipoNegocio: biz.id })}
                          >
                            <span className="sector-icon">{biz.icon}</span>
                            <div className="sector-info">
                              <strong>{biz.label}</strong>
                              <small>{biz.desc}</small>
                            </div>
                            <div className="sector-radio">
                              {formData.tipoNegocio === biz.id && <span className="radio-dot" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="form-grid-2" style={{ marginTop: '1.5rem' }}>
                        <div className="b2b-input-group">
                          <label>Nombre y Apellido *</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Sofía Martínez"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className={stepErrors.nombre ? 'has-error' : ''}
                          />
                          {stepErrors.nombre && <span className="field-error">{stepErrors.nombre}</span>}
                        </div>

                        <div className="b2b-input-group">
                          <label>Empresa o Nombre Comercial *</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Lumina Bodas & Eventos"
                            value={formData.empresa}
                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                            className={stepErrors.empresa ? 'has-error' : ''}
                          />
                          {stepErrors.empresa && <span className="field-error">{stepErrors.empresa}</span>}
                        </div>
                      </div>

                      <div className="b2b-input-group">
                        <label>Ciudad / Estado de tu Operación</label>
                        <input 
                          type="text" 
                          placeholder="Ej. CDMX, Monterrey, Guadalajara, Cancún..."
                          value={formData.ciudad}
                          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        />
                      </div>

                      <div className="step-nav-actions">
                        <div />
                        <button 
                          type="button" 
                          className="b2b-submit-btn step-btn-next" 
                          onClick={handleNextStep}
                        >
                          Continuar: Especificar Evento →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DETALLES DEL EVENTO */}
                  {currentStep === 2 && (
                    <div className="step-pane fade-in">
                      <div className="step-pane-head">
                        <span className="step-indicator">Paso 2 de 3</span>
                        <h3 className="step-title">Detalles del montaje y volumen</h3>
                        <p className="step-desc">Elige la solución, color de cera granulada y volumen estimado para tu cotización.</p>
                      </div>

                      {/* Requerimiento selector */}
                      <div className="b2b-input-group">
                        <label>Tipo de Solución Requerida</label>
                        <div className="requirement-options">
                          {requirementTypes.map((req) => (
                            <div 
                              key={req.id}
                              className={`req-pill ${formData.tipoRequerimiento === req.id ? 'is-selected' : ''}`}
                              onClick={() => setFormData({ ...formData, tipoRequerimiento: req.id })}
                            >
                              <strong>{req.label}</strong>
                              <small>{req.desc}</small>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Color de cera */}
                      <div className="b2b-input-group">
                        <label>Color de Cera Granulada Preferida</label>
                        <div className="wax-color-selector">
                          {waxColors.map((color) => (
                            <div 
                              key={color.id}
                              className={`wax-color-card ${formData.colorCera === color.id ? 'is-selected' : ''}`}
                              onClick={() => setFormData({ ...formData, colorCera: color.id })}
                            >
                              <span className="color-badge">{color.badge}</span>
                              <div className="color-info">
                                <strong>{color.label}</strong>
                                <small>{color.desc}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Volumen aproximado */}
                      <div className="b2b-input-group">
                        <label>Volumen o Kilos Estimados</label>
                        <div className="volume-chips-wrap">
                          {volumeChips.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`volume-chip ${formData.volumenAprox === chip ? 'is-selected' : ''}`}
                              onClick={() => setFormData({ ...formData, volumenAprox: chip })}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                        {stepErrors.volumenAprox && <span className="field-error">{stepErrors.volumenAprox}</span>}
                      </div>

                      <div className="form-grid-2">
                        <div className="b2b-input-group">
                          <label>Fecha Estimada del Evento</label>
                          <input 
                            type="date" 
                            value={formData.fechaEvento}
                            onChange={(e) => setFormData({ ...formData, fechaEvento: e.target.value })}
                          />
                        </div>

                        <div className="b2b-input-group">
                          <label>Mesas aproximadas o especificaciones</label>
                          <input 
                            type="text" 
                            placeholder="Ej. 25 mesas de 10 personas"
                            value={formData.detalles}
                            onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="step-nav-actions">
                        <button 
                          type="button" 
                          className="b2b-secondary-btn" 
                          onClick={handlePrevStep}
                        >
                          ← Volver al Perfil
                        </button>
                        <button 
                          type="button" 
                          className="b2b-submit-btn step-btn-next" 
                          onClick={handleNextStep}
                        >
                          Continuar: Contacto & Resumen →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CONTACTO Y RESUMEN */}
                  {currentStep === 3 && (
                    <form onSubmit={handleSubmit} className="step-pane fade-in">
                      <div className="step-pane-head">
                        <span className="step-indicator">Paso 3 de 3</span>
                        <h3 className="step-title">Datos de contacto para enviarte la cotización</h3>
                        <p className="step-desc">Recibirás la propuesta comercial formal en PDF y escala de mayoreo.</p>
                      </div>

                      {/* Live Quote Summary Card */}
                      <div className="quote-summary-card">
                        <div className="quote-summary-header">
                          <span className="summary-title">Resumen de tu Solicitud Mayorista</span>
                          <span className="summary-tag">B2B Concierge</span>
                        </div>

                        <div className="quote-summary-grid">
                          <div className="summary-item">
                            <span className="summary-lbl">Organizador / Empresa:</span>
                            <strong>{formData.nombre || 'Sin nombre'} · {formData.empresa || 'Empresa'}</strong>
                          </div>
                          <div className="summary-item">
                            <span className="summary-lbl">Sector:</span>
                            <strong>{formData.tipoNegocio}</strong>
                          </div>
                          <div className="summary-item">
                            <span className="summary-lbl">Cera & Tonalidad:</span>
                            <strong>{formData.colorCera}</strong>
                          </div>
                          <div className="summary-item">
                            <span className="summary-lbl">Volumen Solicitado:</span>
                            <strong className="text-gold">{formData.volumenAprox || formData.detalles || 'A convenir'}</strong>
                          </div>
                        </div>

                        <div className="quote-perks-row">
                          <span>✓ Facturación CFDI</span>
                          <span>✓ Pabilos de Algodón Incluidos</span>
                          <span>✓ Asesoría Técnica de Montaje</span>
                        </div>
                      </div>

                      <div className="form-grid-2" style={{ marginTop: '1.5rem' }}>
                        <div className="b2b-input-group">
                          <label>WhatsApp Corporativo / Teléfono *</label>
                          <input 
                            type="tel" 
                            placeholder="+52 55 ..."
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className={stepErrors.whatsapp ? 'has-error' : ''}
                          />
                          {stepErrors.whatsapp && <span className="field-error">{stepErrors.whatsapp}</span>}
                          <small className="field-hint">Respuesta y confirmación en menos de 2 horas hábiles.</small>
                        </div>

                        <div className="b2b-input-group">
                          <label>Correo Electrónico Empresarial *</label>
                          <input 
                            type="email" 
                            placeholder="contacto@empresa.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={stepErrors.email ? 'has-error' : ''}
                          />
                          {stepErrors.email && <span className="field-error">{stepErrors.email}</span>}
                          <small className="field-hint">Para enviarte el catálogo formal en PDF.</small>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="b2b-checkbox-group">
                        <label className="checkbox-row">
                          <input 
                            type="checkbox" 
                            checked={formData.facturaSat}
                            onChange={(e) => setFormData({ ...formData, facturaSat: e.target.checked })}
                          />
                          <span>Requiero factura fiscal con validez SAT (CFDI deducible)</span>
                        </label>

                        <label className="checkbox-row">
                          <input 
                            type="checkbox" 
                            checked={formData.urgente}
                            onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
                          />
                          <span>Montaje urgente (evento programado para los próximos 7 a 10 días)</span>
                        </label>
                      </div>

                      <div className="step-nav-actions" style={{ marginTop: '1.75rem' }}>
                        <button 
                          type="button" 
                          className="b2b-secondary-btn" 
                          onClick={handlePrevStep}
                        >
                          ← Modificar Proyecto
                        </button>

                        <button 
                          type="submit" 
                          className="b2b-submit-btn step-btn-next"
                        >
                          Solicitar Cotización Mayorista Oficial →
                        </button>
                      </div>

                      <div className="form-alt-action">
                        <span>¿Prefieres atención inmediata?</span>
                        <a 
                          href={generateWhatsAppMessage()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alt-whatsapp-link"
                        >
                          💬 Enviar esta cotización directo a WhatsApp
                        </a>
                      </div>

                      <p className="privacy-guarantee">Tus datos están estrictamente protegidos. Solo contacto profesional.</p>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ B2B
          ============================================================ */}
      <section className="b2b-faq-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">Dudas Frecuentes</span>
            <h2>Preguntas de organizadores y profesionales</h2>
          </div>

          <div className="faq-grid">
            <details className="faq-item" open>
              <summary>¿Cuánta cera de arena rinde para un florero o cilindro estándar?</summary>
              <p>En promedio, un cilindro de vidrio de 15 cm de alto por 8 cm de diámetro requiere entre 100g y 130g de cera de arena. Con 1 kg de cera Sutra puedes montar entre 8 y 10 centros de mesa individuales.</p>
            </details>

            <details className="faq-item">
              <summary>¿Qué pasa exactamente cuando termina el evento?</summary>
              <p>Al apagar la llama, solo se endurece un pequeño botón de cera de 2 a 3 cm alrededor de la mecha. Retiras ese residuo con la punta de los dedos y el 90% restante de la cera permanece como polvo granular seco y limpio, listo para vaciarse a tu saco y reutilizarse en el próximo evento.</p>
            </details>

            <details className="faq-item">
              <summary>¿Realmente no mancha los manteles de lino fino?</summary>
              <p>Totalmente. A diferencia de las velas convencionales que se licúan por completo y gotean por los costados, la cera de arena Sutra permanece contenida. Si se llega a caer un poco de polvo de arena seco sobre el mantel, basta con aspirarlo o sacudirlo; no deja marcas de grasa ni mancha la tela.</p>
            </details>

            <details className="faq-item">
              <summary>¿Emiten factura fiscal para mi empresa?</summary>
              <p>Sí. Emitimos factura CFDI con validez ante el SAT en todos nuestros pedidos para personas morales y físicas. Te la enviamos de manera automática tras confirmar tu compra.</p>
            </details>

            <details className="faq-item">
              <summary>¿Hacen envíos a toda la República Mexicana?</summary>
              <p>Sí, realizamos envíos asegurados por paquetería express a todo México (CDMX, Guadalajara, Monterrey, Cancún, Los Cabos, San Miguel de Allende, etc.). En packs a partir de 15 kg el envío es completamente gratis.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
