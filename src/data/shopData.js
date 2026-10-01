// Assets imports
import imgVela from '../assets/images/cat-velas.png';
import imgSpray from '../assets/images/cat-sprays.png';
import imgSprayAlt from '../assets/images/sutra-cat-sprays.png';
import imgDifusor from '../assets/images/cat-difusores.png';
import imgDifusorAlt from '../assets/images/sutra-cat-difusores.png';
import imgAceite from '../assets/images/cat-aceites.png';
import imgZen from '../assets/images/category-zen.png';
import imgZenDetalle from '../assets/images/cat-jardin-zen.jpg';
import imgCandleKit from '../assets/images/category-candle.png';
import imgTea from '../assets/images/category-tea.png';
import imgTeaLata from '../assets/images/cat-te-ceremonial.jpg';
import imgCartas from '../assets/images/cartas-rituales.jpg';
import imgCartasMesa from '../assets/images/cartas-rituales-mesa.jpg';
import imgVasijas from '../assets/images/vasijas.jpg';
import imgWhiteWax from '../assets/images/cera-blanca.jpg';
import imgBlackWax from '../assets/images/cera-negra.jpg';
import imgCandleLit from '../assets/images/candle-lit.png';
import imgCandleDark from '../assets/images/candle-dark.png';
import imgBanquetes from '../assets/images/eventos-banquetes.jpg';
import imgLifestyle from '../assets/images/hero-lifestyle.png';
import imgCalma from '../assets/images/sutra-calma.png';
import imgDescanso from '../assets/images/sutra-descanso.png';
import imgEnergia from '../assets/images/sutra-energia.png';
import imgEnfoque from '../assets/images/sutra-enfoque.png';

export const storeCategories = [
  { id: 'all', label: 'Todos los productos' },
  { id: 'velas', label: 'Velas' },
  { 
    id: 'accesorios', 
    label: 'Accesorios',
    subcategories: [
      { id: 'jardin-zen', label: 'Jardín Zen' },
      { id: 'cartas-rituales', label: 'Cartas de rituales' },
      { id: 'vasijas', label: 'Vasijas' }
    ]
  },
  { id: 'aromas', label: 'Aromas' },
  { id: 'te', label: 'Té' }
];

export const allProducts = [
  // ==================== 1. VELAS ====================
  {
    id: 'p-vela-1',
    category: 'velas',
    name: 'Vela Ritual Noche Serena',
    emotionalName: 'Descanso Profundo',
    tag: 'Best Seller',
    price: '980 MXN',
    priceNum: 980,
    rating: 4.9,
    reviewCount: 46,
    shortDesc: 'Lavanda salvaje, sándalo y cera vegetal pura.',
    description: 'Vela ritual vertida con cera vegetal pura de alta densidad aromática. Combina lavanda francesa seleccionada con sándalo blanco y sutil fondo de vainilla botánica.',
    benefit: 'Baja el ritmo cardíaco, atenúa el estrés del día y prepara tu habitación para un descanso reparador profundo.',
    img: imgWhiteWax,
    images: [
      { id: 'white', src: imgWhiteWax, label: 'Cera Blanca Perlada', color: 'Blanco' },
      { id: 'black', src: imgBlackWax, label: 'Cera Negra Obsidiana', color: 'Negro' },
      { id: 'lit', src: imgCandleLit, label: 'Flama y Calma' },
      { id: 'vessel', src: imgVasijas, label: 'En Vasija Cerámica' },
      { id: 'lifestyle', src: imgBanquetes, label: 'Ambiente Ritual' },
    ],
    options: [
      {
        id: 'color',
        label: 'Color de Cera',
        type: 'color',
        choices: [
          { label: 'Blanco', value: 'Blanco', hex: '#FAF7F2', img: imgWhiteWax },
          { label: 'Negro', value: 'Negro', hex: '#1C1917', img: imgBlackWax },
        ]
      },
      {
        id: 'size',
        label: 'Presentación de Cera',
        type: 'pills',
        choices: [
          { label: '250 gramos', value: '250', priceDelta: -360 },
          { label: '500 gramos', value: '500', priceDelta: 0, isDefault: true },
          { label: '1 Kilo Master', value: '1000', priceDelta: 670 },
        ]
      },
      {
        id: 'aroma',
        label: 'Aroma Pre-cargado',
        type: 'select',
        choices: [
          { label: 'Lavanda Salvaje & Manzanilla', value: 'Lavanda', desc: 'Calma nocturna profunda y descanso emocional.' },
          { label: 'Santal & Amber Ancestral', value: 'Santal', desc: 'Notas amaderadas tibias para meditación y templanza.' },
          { label: 'Bergamota & Flor de Azahar', value: 'Citrico', desc: 'Luz matutina revitalizante y claridad mental.' },
          { label: 'Puro sin aroma', value: 'SinAroma', desc: 'Cera limpia ideal para personas sensibles o cenas.' },
        ]
      },
      {
        id: 'vasija',
        label: 'Contenedor o Vasija',
        type: 'cards',
        choices: [
          { label: 'Sin vasija', value: 'sin-vasija', sub: 'Usa tus recipientes favoritos en casa', priceDelta: 0, isDefault: true },
          { label: 'Vasija Cerámica Gres', value: 'ceramica-gres', sub: 'Modelada a mano en alta temperatura', priceDelta: 450 },
          { label: 'Vasija Wabi-Sabi Barro', value: 'wabi-sabi', sub: 'Acabado mineral volcánico ahumado', priceDelta: 520 },
        ]
      }
    ],
    specs: [
      { label: 'Composición', value: '100% Cera perlada botánica de coco y palma sostenible' },
      { label: 'Duración', value: 'Hasta 120 horas de combustión limpia y reutilizable' },
      { label: 'Incluye', value: 'Cera perlada + 20 mechas de algodón orgánico puro' },
      { label: 'Hecho en', value: 'Artesanalmente en México' },
    ],
    ritualSteps: [
      { step: '01', title: 'Vierte la arena', desc: 'Llena tu vasija preferida con la cera granulada hasta 2 cm del borde.' },
      { step: '02', title: 'Inserta la mecha', desc: 'Coloca una mecha de algodón dejando asomar solo 5 milímetros en la superficie.' },
      { step: '03', title: 'Enciende tu calma', desc: 'Añade 3 gotas de esencia junto a la mecha y enciende para una experiencia infinita.' },
    ]
  },

  {
    id: 'p-vela-2',
    category: 'velas',
    name: 'Vela Ritual Luz de Luna',
    emotionalName: 'Calma Absoluta',
    tag: 'Edición Calma',
    price: '980 MXN',
    priceNum: 980,
    rating: 4.8,
    reviewCount: 31,
    shortDesc: 'Jazmín blanco, madera de cedro y cera pura.',
    description: 'Una atmósfera etérea inspirada en noches serenas. La pureza del jazmín nocturno se entrelaza con maderas sagradas de cedro y notas envolventes de ámbar suave.',
    benefit: 'Despeja la saturación mental, silencia el ruido exterior y crea una sensación de recogimiento intemporal.',
    img: imgVela,
    images: [
      { id: 'main', src: imgVela, label: 'Vela Luz de Luna' },
      { id: 'dark', src: imgCandleDark, label: 'Luz Cálida en Penumbra' },
      { id: 'lit', src: imgCandleLit, label: 'Flama Continua' },
      { id: 'calma', src: imgCalma, label: 'Sensación de Calma' },
    ],
    options: [
      {
        id: 'size',
        label: 'Presentación',
        type: 'pills',
        choices: [
          { label: 'Vela Vaso Vidrio 280g', value: 'vaso-280', priceDelta: 0, isDefault: true },
          { label: 'Vela Vaso Vidrio 450g Grande', value: 'vaso-450', priceDelta: 380 },
          { label: 'Dúo Noche & Luz (2 velas)', value: 'duo', priceDelta: 720 },
        ]
      },
      {
        id: 'wick',
        label: 'Tipo de Mecha',
        type: 'pills',
        choices: [
          { label: 'Mecha de Algodón Puro', value: 'algodon', priceDelta: 0, isDefault: true },
          { label: 'Mecha de Madera Crujiente', value: 'madera', priceDelta: 60 },
        ]
      }
    ],
    specs: [
      { label: 'Cera', value: 'Soya orgánica vegetal libre de parafinas y tóxicos' },
      { label: 'Tiempo de quemado', value: 'Aprox. 65 horas por pieza' },
      { label: 'Contenedor', value: 'Vidrio soplado artesanal ámbar ahumado reutilizable' },
    ],
    ritualSteps: [
      { step: '01', title: 'Apaga pantallas', desc: 'Treinta minutos antes de dormir, reduce las luces del entorno.' },
      { step: '02', title: 'Enciende con intención', desc: 'Visualiza soltar todas las exigencias y tareas pendientes del día.' },
      { step: '03', title: 'Respira 4-7-8', desc: 'Inhala en 4 tiempos, retén 7 y exhala en 8 con el suave aroma envolviéndote.' },
    ]
  },

  {
    id: 'p-vela-3',
    category: 'velas',
    name: 'Kit Ritual Candle Completo',
    emotionalName: 'Llama Serena',
    tag: 'Kit Premium',
    price: '1,590 MXN',
    priceNum: 1590,
    rating: 5.0,
    reviewCount: 68,
    shortDesc: '500g cera perlada, mechas de algodón y vasija.',
    description: 'El set definitivo para dominar el arte de las velas infinitas. Incluye 500g de cera granulada botánica, vasija de cerámica artesanal, 30 mechas de algodón y frasco cuentagotas de esencia aromática.',
    benefit: 'Libertad absoluta para diseñar tu vela tantas veces como desees sin desperdicio ni cera adherida.',
    img: imgCandleKit,
    images: [
      { id: 'kit', src: imgCandleKit, label: 'Kit Completo' },
      { id: 'white', src: imgWhiteWax, label: 'Cera Perlada Blanca' },
      { id: 'black', src: imgBlackWax, label: 'Cera Obsidiana Negra' },
      { id: 'lit', src: imgCandleLit, label: 'Resultado Encendido' },
      { id: 'vessel', src: imgVasijas, label: 'Vasija Cerámica' },
    ],
    options: [
      {
        id: 'color',
        label: 'Color de Cera Incluida',
        type: 'color',
        choices: [
          { label: 'Blanco Perlado', value: 'Blanco', hex: '#FAF7F2', img: imgWhiteWax },
          { label: 'Negro Obsidiana', value: 'Negro', hex: '#1C1917', img: imgBlackWax },
          { label: 'Mix Dúo (250g Blanco + 250g Negro)', value: 'Mix', hex: '#8B7355', img: imgCandleKit, priceDelta: 120 },
        ]
      },
      {
        id: 'aroma',
        label: 'Esencia Botánica',
        type: 'select',
        choices: [
          { label: 'Lavanda & Manzanilla', value: 'Lavanda', desc: 'Calma suave para cerrar el día.' },
          { label: 'Santal & Amber', value: 'Santal', desc: 'Maderas cálidas y resina meditativa.' },
          { label: 'White Tea & Bergamot', value: 'WhiteTea', desc: 'Frescura limpia y luminosa.' },
        ]
      }
    ],
    specs: [
      { label: 'Contenido', value: '500g cera granulada + Vasija cerámica + 30 mechas + Esencia 15ml' },
      { label: 'Rendimiento', value: 'Más de 140 horas de flama continua acumulada' },
      { label: 'Presentación', value: 'Caja rígida de lujo ideal para obsequiar' },
    ],
    ritualSteps: [
      { step: '01', title: 'Arma tu recipiente', desc: 'Coloca la vasija de cerámica en una superficie plana y despejada.' },
      { step: '02', title: 'Vierte y perfuma', desc: 'Añade la cera perlada y distribuye 5 a 8 gotas de la esencia alrededor del centro.' },
      { step: '03', title: 'Enciende y renueva', desc: 'Cuando la apagues, retira la pequeña bolita de cera endurecida y tu vela volverá a ser 100% nueva.' },
    ]
  },

  // ==================== 2. ACCESORIOS ====================
  {
    id: 'p-zen-1',
    category: 'accesorios',
    subcategory: 'jardin-zen',
    name: 'Jardín Zen Artesanal 12"',
    emotionalName: 'Calma Interior',
    tag: 'Pieza Maestra',
    price: '1,690 MXN',
    priceNum: 1690,
    rating: 4.9,
    reviewCount: 39,
    shortDesc: 'Arena de cuarzo, rocas de río y rastrillo de bambú.',
    description: 'Inspirado en los templos secos (karesansui) de Kioto. Bandeja torneada en madera maciza seleccionada, arena fina de cuarzo blanco, piedras de río pulidas y rastrillo artesanal de bambú.',
    benefit: 'Medita activamente trazando ondas en la arena: aquieta el flujo de pensamientos y ancla tu respiración.',
    img: imgZenDetalle,
    images: [
      { id: 'zen-detalle', src: imgZenDetalle, label: 'Jardín Zen en Uso' },
      { id: 'zen-overview', src: imgZen, label: 'Vista Completa' },
      { id: 'lifestyle', src: imgLifestyle, label: 'En Espacio de Trabajo' },
      { id: 'focus', src: imgEnfoque, label: 'Enfoque y Calma' },
    ],
    options: [
      {
        id: 'size',
        label: 'Diámetro de Bandeja',
        type: 'pills',
        choices: [
          { label: '12" Mediano (30 cm)', value: '12', priceDelta: 0, isDefault: true },
          { label: '16" Ceremonial (40 cm)', value: '16', priceDelta: 600 },
        ]
      },
      {
        id: 'wood',
        label: 'Tono de Madera',
        type: 'pills',
        choices: [
          { label: 'Nogal Oscuro Envejecido', value: 'nogal', priceDelta: 0, isDefault: true },
          { label: 'Roble Claro Natural', value: 'roble', priceDelta: 0 },
        ]
      },
      {
        id: 'stones',
        label: 'Selección de Piedras',
        type: 'pills',
        choices: [
          { label: 'Piedras de Río Zen Negras', value: 'rio', priceDelta: 0, isDefault: true },
          { label: 'Cuarzos Minerales en Bruto', value: 'cuarzo', priceDelta: 180 },
        ]
      }
    ],
    specs: [
      { label: 'Material', value: 'Madera maciza de nogal con barniz al agua no tóxico' },
      { label: 'Arena', value: '1.2 kg arena de cuarzo mineral micronizada lavada' },
      { label: 'Herramientas', value: 'Rastrillo de 5 dientes de bambú + nivelador de arena' },
      { label: 'Dimensiones', value: '30 cm de diámetro x 3 cm de profundidad' },
    ],
    ritualSteps: [
      { step: '01', title: 'Nivela la arena', desc: 'Usa el reverso del rastrillo para crear un lienzo blanco completamente liso.' },
      { step: '02', title: 'Ancla las piedras', desc: 'Ubica 3 piedras representando tu mente, tu cuerpo y tu intención de hoy.' },
      { step: '03', title: 'Traza las ondas', desc: 'Dibuja curvas circulares continuas sincronizando cada pase con tu inhalación.' },
    ]
  },

  {
    id: 'p-cartas-1',
    category: 'accesorios',
    subcategory: 'cartas-rituales',
    name: 'Baraja de Rituales Diarios "Pausa"',
    emotionalName: 'Intención y Claridad',
    tag: 'Nuevo',
    price: '780 MXN',
    priceNum: 780,
    rating: 5.0,
    reviewCount: 52,
    shortDesc: '44 cartas con foil dorado y guía de meditación.',
    description: 'Mazo de 44 cartas de alta gramatura impresas en papel de algodón con estampación en foil dorado. Cada carta contiene una micro-práctica de presencia, un mantra y una reflexión consciente.',
    benefit: 'Funciona como tu brújula matutina: extrae una carta cada amanecer para orientar tu estado de ánimo.',
    img: imgCartasMesa,
    images: [
      { id: 'cartas-mesa', src: imgCartasMesa, label: 'Cartas en Atril de Madera' },
      { id: 'cartas-box', src: imgCartas, label: 'Caja Rígida de Colección' },
      { id: 'lifestyle', src: imgLifestyle, label: 'Ritual Matutino' },
      { id: 'calma', src: imgCalma, label: 'Claridad Emocional' },
    ],
    options: [
      {
        id: 'edition',
        label: 'Edición',
        type: 'cards',
        choices: [
          { label: 'Edición Estándar', value: 'estandar', sub: 'Mazo 44 cartas en caja rígida con foil oro', priceDelta: 0, isDefault: true },
          { label: 'Set con Atril de Madera', value: 'atril', sub: 'Incluye atril de nogal para exhibir tu carta diaria en tu escritorio', priceDelta: 280 },
        ]
      }
    ],
    specs: [
      { label: 'Cartas', value: '44 cartas de 350g con tacto sedoso y cantos dorados' },
      { label: 'Guía', value: 'Libreto impreso de 60 páginas con ejercicios de mindfulness' },
      { label: 'Empaque', value: 'Caja magnética rígida con cierre suave' },
    ],
    ritualSteps: [
      { step: '01', title: 'Baraja en silencio', desc: 'Sostén las cartas entre ambas manos y cierra los ojos durante 3 respiraciones.' },
      { step: '02', title: 'Corta y elige', desc: 'Separa el mazo y descubre la carta superior sin juzgar.' },
      { step: '03', title: 'Habita el mensaje', desc: 'Léela en voz alta y permite que guíe tus decisiones a lo largo del día.' },
    ]
  },

  {
    id: 'p-vasijas-1',
    category: 'accesorios',
    subcategory: 'vasijas',
    name: 'Vasija Wabi-Sabi en Cerámica Gres',
    emotionalName: 'Tierra y Espacio',
    tag: 'Artesanal',
    price: '890 MXN',
    priceNum: 890,
    rating: 4.9,
    reviewCount: 27,
    shortDesc: 'Barro volcánico modelado a mano a alta temperatura.',
    description: 'Pieza escultórica modelada y esmaltada a mano por alfareros mexicanos. Horneada a 1,280°C para una resistencia eterna al fuego, al agua y a la cera caliente.',
    benefit: 'Aporta la belleza de la imperfección orgánica (wabi-sabi) a tu mesa, tocador o altar de meditación.',
    img: imgVasijas,
    images: [
      { id: 'vasijas', src: imgVasijas, label: 'Colección de Vasijas' },
      { id: 'lit', src: imgCandleLit, label: 'Con Cera Encendida' },
      { id: 'white', src: imgWhiteWax, label: 'Textura Mineral' },
      { id: 'banquet', src: imgBanquetes, label: 'En Mesa y Evento' },
    ],
    options: [
      {
        id: 'finish',
        label: 'Acabado & Esmalte Mineral',
        type: 'pills',
        choices: [
          { label: 'Gres Blanco Crudo Texturizado', value: 'blanco-gres', priceDelta: 0, isDefault: true },
          { label: 'Barro Volcánico Negro Ahumado', value: 'negro-barro', priceDelta: 0 },
          { label: 'Terracota Cálida Mate', value: 'terracota', priceDelta: 0 },
        ]
      },
      {
        id: 'size',
        label: 'Dimensiones',
        type: 'pills',
        choices: [
          { label: 'Cuenco Mediano (14 cm)', value: '14cm', priceDelta: 0, isDefault: true },
          { label: 'Vasija Profunda Grande (20 cm)', value: '20cm', priceDelta: 390 },
        ]
      }
    ],
    specs: [
      { label: 'Material', value: 'Cerámica gres refractaria de alta temperatura' },
      { label: 'Capacidad', value: 'Hasta 600g de cera granulada en formato mediano' },
      { label: 'Limpieza', value: 'Apta para lavavajillas y fácil retiro de cera con agua tibia' },
    ],
    ritualSteps: [
      { step: '01', title: 'Elige su rincón', desc: 'Colócala donde la luz natural bañe su textura mineral.' },
      { step: '02', title: 'Vierte tu intención', desc: 'Úsala para cera granulada Sutra, incienso de resina o agua de flores.' },
      { step: '03', title: 'Reutilización infinita', desc: 'No acumula cera estropeada; se renueva limpiamente con cada uso.' },
    ]
  },

  // ==================== 3. AROMAS ====================
  {
    id: 'p-aroma-1',
    category: 'aromas',
    name: 'Home Spray Amanecer Dorado',
    emotionalName: 'Despertar Consciente',
    tag: 'Energía',
    price: '650 MXN',
    priceNum: 650,
    rating: 4.8,
    reviewCount: 34,
    shortDesc: 'Bruma ambiental con bergamota y flor de azahar.',
    description: 'Bruma aromática de ambiente formulada con alcohol de caña orgánico y destilados botánicos puros de bergamota de Calabria, azahar de naranjo dulce y ligero fondo de vainilla bourbon.',
    benefit: 'Despierta el optimismo, disipa la pesadez ambiental y revitaliza la energía de tus mañanas.',
    img: imgSpray,
    images: [
      { id: 'spray', src: imgSpray, label: 'Spray Botánico' },
      { id: 'alt', src: imgSprayAlt, label: 'Frasco en Detalle' },
      { id: 'energia', src: imgEnergia, label: 'Vibración y Energía' },
      { id: 'lifestyle', src: imgLifestyle, label: 'En el Hogar' },
    ],
    options: [
      {
        id: 'size',
        label: 'Presentación',
        type: 'pills',
        choices: [
          { label: 'Frasco Vidrio Ámbar 100 ml', value: '100ml', priceDelta: 0, isDefault: true },
          { label: 'Set Dúo (100 ml + Recarga 250 ml)', value: 'duo', priceDelta: 480 },
        ]
      }
    ],
    specs: [
      { label: 'Ingredientes', value: 'Alcohol de caña destilado, aceites esenciales puros, agua de manantial' },
      { label: 'Sin tóxicos', value: '100% libre de ftalatos, parabenos y aerosoles propelentes' },
      { label: 'Rendimiento', value: 'Más de 750 pulverizaciones por frasco' },
    ],
    ritualSteps: [
      { step: '01', title: 'Agita suavemente', desc: 'Permite que los aceites botánicos se emulsionen con el alcohol natural.' },
      { step: '02', title: 'Pulveriza al aire', desc: 'Realiza 3 pulverizaciones hacia arriba en el centro del espacio o sobre linos.' },
      { step: '03', title: 'Inhala luz', desc: 'Cierra los ojos e inhala profundamente llenando tus pulmones de notas cítricas.' },
    ]
  },

  {
    id: 'p-aroma-2',
    category: 'aromas',
    name: 'Difusor Mikado Bosque Interior',
    emotionalName: 'Claridad Mental',
    tag: 'Larga Duración',
    price: '1,200 MXN',
    priceNum: 1200,
    rating: 4.9,
    reviewCount: 41,
    shortDesc: 'Varillas naturales con pino silvestre y cedro.',
    description: 'Difusor continuo con varillas de ratán natural no blanqueadas. Una inmersión olfativa en un bosque milenario con notas de pino silvestre, cedro atlas, musgo húmedo y eucalipto radiata.',
    benefit: 'Sostiene un ambiente de serenidad y concentración sin necesidad de flama ni supervisión constante.',
    img: imgDifusor,
    images: [
      { id: 'difusor', src: imgDifusor, label: 'Difusor Mikado' },
      { id: 'alt', src: imgDifusorAlt, label: 'En Detalle' },
      { id: 'enfoque', src: imgEnfoque, label: 'Concentración y Foco' },
      { id: 'lifestyle', src: imgLifestyle, label: 'Atmósfera Continua' },
    ],
    options: [
      {
        id: 'size',
        label: 'Volumen',
        type: 'pills',
        choices: [
          { label: 'Frasco 200 ml con 8 varillas', value: '200ml', priceDelta: 0, isDefault: true },
          { label: 'Edición Magna 500 ml', value: '500ml', priceDelta: 750 },
        ]
      }
    ],
    specs: [
      { label: 'Duración', value: 'Difusión continua garantizada durante más de 90 días' },
      { label: 'Varillas', value: '8 varillas de ratán de alta capilaridad' },
      { label: 'Botella', value: 'Vidrio boticario de farmacia reutilizable' },
    ],
    ritualSteps: [
      { step: '01', title: 'Coloca las varillas', desc: 'Inserta las varillas de ratán dentro de la botella en forma de abanico.' },
      { step: '02', title: 'Espera la absorción', desc: 'Permite que la madera vegetal se impregne naturalmente durante 24 horas.' },
      { step: '03', title: 'Gira periódicamente', desc: 'Gira las varillas una vez por semana para reavivar la intensidad del bosque.' },
    ]
  },

  {
    id: 'p-aroma-3',
    category: 'aromas',
    name: 'Aceite Esencial Templo de Humo',
    emotionalName: 'Meditación Profunda',
    tag: 'Concentrado',
    price: '550 MXN',
    priceNum: 550,
    rating: 5.0,
    reviewCount: 29,
    shortDesc: 'Sándalo ancestral, mirra y copal blanco mexicano.',
    description: 'Destilado puro grado terapéutico. Una mezcla ceremonial creada a partir de sándalo australiano, mirra sagrada, benjuí y auténtico copal blanco silvestre de Oaxaca.',
    benefit: 'Profundiza las sesiones de meditación, respiración o yoga, favoreciendo una introspección serena.',
    img: imgAceite,
    images: [
      { id: 'aceite', src: imgAceite, label: 'Gotero Ámbar' },
      { id: 'difusor', src: imgDifusor, label: 'Para Difusor Ultrasónico' },
      { id: 'descanso', src: imgDescanso, label: 'Introspección' },
      { id: 'lifestyle', src: imgLifestyle, label: 'Mesa de Meditación' },
    ],
    options: [
      {
        id: 'size',
        label: 'Presentación',
        type: 'pills',
        choices: [
          { label: 'Frasco gotero 15 ml', value: '15ml', priceDelta: 0, isDefault: true },
          { label: 'Frasco gotero 30 ml', value: '30ml', priceDelta: 380 },
        ]
      }
    ],
    specs: [
      { label: 'Pureza', value: '100% Aceite esencial puro sin diluyentes sintéticos' },
      { label: 'Uso recomendado', value: 'Difusores ultrasónicos, quemadores de cerámica o cera Sutra' },
      { label: 'Dosificación', value: '3 a 5 gotas por cada 100 ml de agua' },
    ],
    ritualSteps: [
      { step: '01', title: 'Prepara tu difusor', desc: 'Llena el depósito con agua purificada a temperatura ambiente.' },
      { step: '02', title: 'Añade la alquimia', desc: 'Deja caer de 4 a 6 gotas de Templo de Humo sobre la superficie.' },
      { step: '03', title: 'Siéntate en quietud', desc: 'Observa la niebla ascender y permite que el sándalo ancle tu presencia.' },
    ]
  },

  // ==================== 4. TÉ ====================
  {
    id: 'p-tea-1',
    category: 'te',
    name: 'Ritual Tea "Calma Oriental"',
    emotionalName: 'Pausa Restaurativa',
    tag: 'Mezcla Orgánica',
    price: '480 MXN',
    priceNum: 480,
    rating: 4.9,
    reviewCount: 37,
    shortDesc: 'Manzanilla botánica, lavanda y té blanco puro.',
    description: 'Infusión botánica relajante libre de cafeína. Flores enteras de manzanilla silvestre, capullos de lavanda de Provenza, brotes de té blanco Pai Mu Tan y toques dulces de regaliz natural.',
    benefit: 'Alivia la tensión muscular y estomacal, serenando los sentidos al final de jornadas intensas.',
    img: imgTeaLata,
    images: [
      { id: 'tea-lata', src: imgTeaLata, label: 'Lata de Colección & Taza' },
      { id: 'tea-box', src: imgTea, label: 'Hojas Enteras' },
      { id: 'descanso', src: imgDescanso, label: 'Ritual Nocturno' },
      { id: 'lifestyle', src: imgLifestyle, label: 'Momento de Presencia' },
    ],
    options: [
      {
        id: 'packaging',
        label: 'Presentación',
        type: 'pills',
        choices: [
          { label: 'Lata Hermética Crema & Oro (80g)', value: 'lata-80g', priceDelta: 0, isDefault: true },
          { label: 'Bolsa Kraft Recarga Ecológica (150g)', value: 'recarga-150g', priceDelta: 160 },
          { label: 'Set Completo (Lata + Infusor Pinza Oro)', value: 'set-infusor', priceDelta: 240 },
        ]
      }
    ],
    specs: [
      { label: 'Ingredientes', value: '100% flores y hojas orgánicas seleccionadas a mano' },
      { label: 'Cafeína', value: 'Prácticamente nula (< 1 mg por taza)' },
      { label: 'Rendimiento', value: 'Aprox. 40 tazas por lata de 80g' },
    ],
    ritualSteps: [
      { step: '01', title: 'Calienta el agua', desc: 'Lleva agua purificada a 85°C (retírala justo antes de hervir).' },
      { step: '02', title: 'Infusiona con calma', desc: 'Vierte 2 cucharaditas (2.5g) en tu taza, tapa y espera 5 minutos.' },
      { step: '03', title: 'Sorbo consciente', desc: 'Siente el calor de la taza entre tus manos y bebe con plena atención.' },
    ]
  },

  {
    id: 'p-tea-2',
    category: 'te',
    name: 'Ritual Tea "Despertar Zen"',
    emotionalName: 'Enfoque y Vitalidad',
    tag: 'Cosecha Selección',
    price: '480 MXN',
    priceNum: 480,
    rating: 5.0,
    reviewCount: 43,
    shortDesc: 'Sencha japonés con jazmín y menta fresca.',
    description: 'Té verde sencha orgánico de primavera cultivado en las faldas del monte Fuji. Mezclado sutilmente con jazmín blanco y un toque de menta piperita refrescante.',
    benefit: 'Aporta teanina y antioxidantes que promueven una concentración limpia y sostenida sin provocar taquicardia ni picos de ansiedad.',
    img: imgTea,
    images: [
      { id: 'tea', src: imgTea, label: 'Té Despertar Zen' },
      { id: 'tea-lata', src: imgTeaLata, label: 'Preparación en Cerámica' },
      { id: 'energia', src: imgEnergia, label: 'Vitalidad Limpia' },
      { id: 'lifestyle', src: imgLifestyle, label: 'Enfoque Matutino' },
    ],
    options: [
      {
        id: 'packaging',
        label: 'Presentación',
        type: 'pills',
        choices: [
          { label: 'Lata Hermética 80g', value: 'lata-80g', priceDelta: 0, isDefault: true },
          { label: 'Bolsa Kraft Recarga 150g', value: 'recarga-150g', priceDelta: 160 },
          { label: 'Set con Cuchara Medidora & Infusor Oro', value: 'set-completo', priceDelta: 260 },
        ]
      }
    ],
    specs: [
      { label: 'Origen', value: 'Shizuoka, Japón (Comercio Justo Certificado)' },
      { label: 'Beneficio activo', value: 'L-Teanina pura combinada con cafeína de liberación lenta' },
      { label: 'Tiempo infusión', value: '2 a 3 minutos a 75°C - 80°C' },
    ],
    ritualSteps: [
      { step: '01', title: 'Despierta tus sentidos', desc: 'Huele las hojas secas antes de prepararlas para activar tu mente.' },
      { step: '02', title: 'Infusión breve', desc: 'No dejes reposar más de 3 minutos para evitar que desarrolle amargor.' },
      { step: '03', title: 'Inicia con claridad', desc: 'Bebe como primer acto tras tu respiración matutina y aborda tus tareas con calma.' },
    ]
  }
];

export const blogArticles = [
  {
    id: 'arte-de-pausar',
    title: 'El arte de pausar: Cómo crear un santuario de descanso en tu hogar',
    category: 'Filosofía Sutra',
    date: 'Octubre 2026',
    readTime: '4 min de lectura',
    excerpt: 'En un mundo que glorifica la prisa constante, detenerte 15 minutos al día no es una pérdida de tiempo: es el acto supremo de autocuidado.',
    content: `Vivimos en una cultura hiperconectada donde el silencio parece una anomalía. Sin embargo, los antiguos rituales nos enseñan que el verdadero descanso no ocurre por accidente; se diseña con intención.\n\nCrear un santuario en tu hogar no requiere remodelar un cuarto entero. Basta con un rincón dedicado: una vela con cera vegetal, una taza de té tibio entre las manos y el compromiso de apagar las pantallas al menos media hora antes de dormir. Cuando enciendes una llama, le das a tu mente una señal física de que el ajetreo exterior ha terminado.`,
    image: imgVela
  },
  {
    id: 'ritual-jardin-zen',
    title: 'Jardines Zen: Meditación activa a través del movimiento de la arena',
    category: 'Rituales',
    date: 'Septiembre 2026',
    readTime: '5 min de lectura',
    excerpt: 'Aprende cómo el trazado de líneas circulares y ondas en la arena puede reducir la sobrecarga mental en minutos.',
    content: `Originarios de los templos budistas en Kioto, los jardines secos (karesansui) fueron concebidos no para contemplar pasivamente, sino como una herramienta de introspección activa.\n\nAl tomar el rastrillo de madera y trazar suavemente ondas en la arena de cuarzo, tu respiración se sincroniza de forma natural con el movimiento. Las piedras representan las islas inmutables de calma interior ante el flujo constante de los pensamientos.`,
    image: imgZenDetalle
  },
  {
    id: 'ceremonia-del-te',
    title: 'La ceremonia del té: Cultivando presencia en cada sorbo',
    category: 'Bienestar Sensorial',
    date: 'Septiembre 2026',
    readTime: '3 min de lectura',
    excerpt: 'El agua caliente, las hojas expandiéndose y el aroma ascendente: un ancla inmediata al momento presente.',
    content: `Beber té no es simplemente hidratarse; es una invitación sensorial completa. Observar el color ámbar que se intensifica en la taza, inhalar el vapor con notas florales y sentir la calidez en las manos transforma un hábito ordinario en un ritual reconfortante.\n\nTe compartimos nuestra guía para preparar infusiones botánicas respetando tiempos y temperaturas para extraer los fitonutrientes y aromas más puros.`,
    image: imgTeaLata
  },
  {
    id: 'cartas-de-intencion',
    title: 'Cartas de rituales: Cómo establecer una brújula emocional matutina',
    category: 'Mindfulness',
    date: 'Agosto 2026',
    readTime: '4 min de lectura',
    excerpt: 'Antes de revisar tu teléfono o tu lista de pendientes, consulta una carta de intención para orientar tu día.',
    content: `Nuestras mañanas suelen estar dictadas por las demandas externas: notificaciones, correos y alarmas. Las cartas de intención Sutra fueron diseñadas para recuperar el control de tu primera hora del día.\n\nAl extraer una carta tras un par de respiraciones conscientes, tu mente adopta una perspectiva receptiva: calma, gratitud, claridad o presencia.`,
    image: imgCartasMesa
  }
];

export const sutraEvents = [
  {
    id: 'evento-1',
    title: 'Taller de Creación de Velas & Alquimia Botánica',
    type: 'Presencial · CDMX',
    date: 'Sábado 24 de Octubre, 2026',
    time: '11:00 AM - 1:30 PM',
    location: 'Casa Sutra Roma Norte, Ciudad de México',
    spots: '8 lugares disponibles',
    price: '1,250 MXN (Incluye materiales y tu vela terminada)',
    description: 'Aprende a formular y verter tu propia vela con ceras botánicas, mechas de madera y esencias aromáticas personalizadas para tu ritual personal.',
    badge: 'Cupos limitados'
  },
  {
    id: 'evento-2',
    title: 'Ceremonia del Té & Mindfulness Guiado',
    type: 'Online en vivo',
    date: 'Jueves 5 de Noviembre, 2026',
    time: '7:30 PM - 8:45 PM',
    location: 'Sesión Privada Streaming (Te enviamos el kit de té a tu casa)',
    spots: '15 lugares disponibles',
    price: '790 MXN (Incluye kit de cata previo)',
    description: 'Una pausa compartida desde la comodidad de tu hogar. Exploraremos tres variedades de tés botánicos acompañados de respiración guiada para conciliar el descanso.',
    badge: 'Kit incluido'
  },
  {
    id: 'evento-3',
    title: 'Meditación Inmersiva con Sound Healing & Aromaterapia',
    type: 'Presencial · CDMX',
    date: 'Domingo 15 de Noviembre, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Terraza Holística Condesa, Ciudad de México',
    spots: 'Últimos 4 lugares',
    price: '950 MXN',
    description: 'Sesión multisensorial con cuencos de cuarzo tibetanos, brumas aromáticas Sutra y meditación guiada con jardines zen.',
    badge: 'Favorito de la comunidad'
  }
];
