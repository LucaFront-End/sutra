/**
 * SUTRA MEXICO — Reviews & Verified Purchases Service
 * Manages customer reviews, rating calculations, verified purchases,
 * and user reviews across products and account sections.
 */

const STORAGE_REVIEWS_KEY = 'sutra_customer_reviews_v1';
const STORAGE_ORDERS_KEY = 'sutra_customer_orders_v1';
const STORAGE_USER_KEY = 'sutra_customer_profile_v1';

// Default initial customer orders with real Sutra items
const INITIAL_ORDERS = [
  {
    orderId: 'SUT-8842',
    date: '28 Sep 2026',
    status: 'Entregado',
    productId: 'p-cera-arena',
    slug: 'vela-cera-en-arena-sutra',
    productName: 'Vela de Cera en Arena Sutra',
    productVariant: '500g Cera Perlada + Vasija Cerámica Wabi',
    productImg: 'https://static.wixstatic.com/media/45119e_207796dcf5ba4d4d8fcbc6300445a498~mv2.jpg',
    price: '$790 MXN',
    hasReview: true,
    reviewRating: 5,
    reviewTitle: 'La mejor experiencia de velas que he tenido',
    reviewComment: 'La textura de la arena perlada es mágica y la mecha de madera tiene un crujido sutil que acompaña mis meditaciones matutinas. Es un antes y un después en mi hogar.',
  },
  {
    orderId: 'SUT-7621',
    date: '22 Sep 2026',
    status: 'Entregado',
    productId: 'p-esencia-rosewood',
    slug: 'esencia-madera-rosé-rosewood',
    productName: 'Esencia "Madera Rosé" Rosewood',
    productVariant: 'Frasco Gotero 15 ml',
    productImg: 'https://static.wixstatic.com/media/45119e_a0916ab2abfe4b5e879a34baaf7833a1~mv2.png',
    price: '$299 MXN',
    hasReview: false,
    reviewRating: null,
    reviewTitle: '',
    reviewComment: '',
  },
  {
    orderId: 'SUT-6104',
    date: '10 Sep 2026',
    status: 'Entregado',
    productId: 'p-jardin-zen',
    slug: 'kit-sensorial-jardin-zen',
    productName: 'Kit Sensorial Jardín Zen Sutra',
    productVariant: 'Nogal Macizo + Cartas de Ritual',
    productImg: 'https://static.wixstatic.com/media/45119e_84226d9c7dd54e8cb49f57ebbf794d03~mv2.png',
    price: '$1,690 MXN',
    hasReview: false,
    reviewRating: null,
    reviewTitle: '',
    reviewComment: '',
  },
  {
    orderId: 'SUT-4920',
    date: '15 Ago 2026',
    status: 'Entregado',
    productId: 'p-te-silencio',
    slug: 'te-ceremonial-silencio',
    productName: 'Té Ceremonial "Silencio"',
    productVariant: 'Lata Hermética 80g (Manzanilla & Lavanda)',
    productImg: 'https://static.wixstatic.com/media/45119e_423cfa03eafe4ba389be9d4949a2a9bb~mv2.png',
    price: '$390 MXN',
    hasReview: true,
    reviewRating: 5,
    reviewTitle: 'Mi ritual nocturno indispensable',
    reviewComment: 'La combinación botánica es sumamente delicada. No tiene conservadores ni azúcar, solo flores puras. Ayuda a desacelerar la mente después de un día intenso.',
  },
];

// Seed reviews for catalog products
const SEED_REVIEWS = [
  // --- Esencia Madera Rosé Rosewood ---
  {
    id: 'rev-rosewood-1',
    productId: 'p-esencia-rosewood',
    slug: 'esencia-madera-rosé-rosewood',
    author: 'Mariana Elizondo',
    authorInitial: 'M',
    location: 'Ciudad de México',
    rating: 5,
    date: 'Hace 3 días',
    title: 'Un aroma amaderado sumamente elegante',
    comment: 'Puse 6 gotas sobre la cera de arena Sutra y el calor de la mecha expandió una nota de palo de rosa y cedro que duró toda la noche. Nada invasivo, simplemente reconfortante y refinado.',
    verified: true,
    helpfulCount: 14,
    variant: 'Frasco Gotero 15 ml',
  },
  {
    id: 'rev-rosewood-2',
    productId: 'p-esencia-rosewood',
    slug: 'esencia-madera-rosé-rosewood',
    author: 'Carlos Alberto G.',
    authorInitial: 'C',
    location: 'Guadalajara, JAL',
    rating: 5,
    date: 'Hace 1 semana',
    title: 'Fácil de dosificar y dura muchísimo',
    comment: 'Me encanta que al ser gotero concentrado puedo controlar exactamente cuánta intensidad quiero en mi sala. Ya llevo 3 semanas usándolo diario y apenas voy a un tercio del frasco.',
    verified: true,
    helpfulCount: 9,
    variant: 'Frasco Gotero 15 ml',
  },
  {
    id: 'rev-rosewood-3',
    productId: 'p-esencia-rosewood',
    slug: 'esencia-madera-rosé-rosewood',
    author: 'Valeria R.',
    authorInitial: 'V',
    location: 'Monterrey, NL',
    rating: 5,
    date: '18 Sep 2026',
    title: 'Fragancia de spa de lujo en casa',
    comment: 'Compré la cera de arena y esta esencia por recomendación. Se siente la calidad de los aceites esenciales sin notas sintéticas artificiales. Volveré a comprar el dúo.',
    verified: true,
    helpfulCount: 7,
    variant: 'Dúo Esencias (15ml + 15ml)',
  },

  // --- Vela de Cera en Arena Sutra ---
  {
    id: 'rev-cera-1',
    productId: 'p-cera-arena',
    slug: 'vela-cera-en-arena-sutra',
    author: 'Sofía Valenzuela',
    authorInitial: 'S',
    location: 'Puebla, PUE',
    rating: 5,
    date: '28 Sep 2026',
    title: 'Superó todas mis expectativas',
    comment: 'La textura de la arena perlada es mágica y la mecha de madera tiene un crujido sutil que acompaña mis meditaciones matutinas. Es un antes y un después en mi hogar.',
    verified: true,
    helpfulCount: 22,
    variant: '500g Cera Perlada + Vasija Cerámica Wabi',
  },
  {
    id: 'rev-cera-2',
    productId: 'p-cera-arena',
    slug: 'vela-cera-en-arena-sutra',
    author: 'Alejandro M.',
    authorInitial: 'A',
    location: 'Querétaro, QRO',
    rating: 5,
    date: 'Hace 2 semanas',
    title: 'Segura y hermosa',
    comment: 'Si por alguna razón la vasija se voltea, la cera ahoga la llama al instante. Eso me da muchísima tranquilidad teniendo gatos en casa. Además luce como una pieza de museo.',
    verified: true,
    helpfulCount: 16,
    variant: '1 kg Cera Perlada Refill',
  },

  // --- Kit Sensorial Jardín Zen ---
  {
    id: 'rev-zen-1',
    productId: 'p-jardin-zen',
    slug: 'kit-sensorial-jardin-zen',
    author: 'Rodrigo Ponce',
    authorInitial: 'R',
    location: 'Mérida, YUC',
    rating: 5,
    date: '14 Sep 2026',
    title: 'El complemento ideal para mi escritorio de trabajo',
    comment: 'Trazar la arena blanca con el rastrillo de madera entre reuniones me ayuda a bajar el ritmo cardíaco y reiniciar la concentración. La madera de nogal tiene un acabado impecable.',
    verified: true,
    helpfulCount: 11,
    variant: 'Kit Completo Nogal',
  },

  // --- Té Ceremonial Silencio ---
  {
    id: 'rev-te-1',
    productId: 'p-te-silencio',
    slug: 'te-ceremonial-silencio',
    author: 'Daniela Soto',
    authorInitial: 'D',
    location: 'San Miguel de Allende, GTO',
    rating: 5,
    date: '15 Ago 2026',
    title: 'Mi ritual nocturno indispensable',
    comment: 'La combinación botánica es sumamente delicada. No tiene conservadores ni azúcar, solo flores puras. Ayuda a desacelerar la mente después de un día intenso.',
    verified: true,
    helpfulCount: 19,
    variant: 'Lata Hermética 80g',
  },
];

// Helper to normalize strings for robust comparison
function normalizeStr(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Retrieve all reviews from localStorage or seeds
 */
export function getAllStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
      return [...SEED_REVIEWS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...SEED_REVIEWS];
  } catch (e) {
    console.warn('[ReviewsService] Error accessing localStorage:', e);
    return [...SEED_REVIEWS];
  }
}

/**
 * Get reviews filtered for a specific product
 */
export function getReviewsForProduct(product) {
  if (!product) return [];
  const allReviews = getAllStoredReviews();
  
  const targetId = String(product.id || product._wixId || '').trim();
  const targetSlug = normalizeStr(product.slug || '');
  const targetName = normalizeStr(product.name || '');

  return allReviews.filter((rev) => {
    if (rev.productId && targetId && rev.productId === targetId) return true;
    if (rev.slug && targetSlug && normalizeStr(rev.slug) === targetSlug) return true;
    
    // Fuzzy matching by name keywords (e.g. rosewood, cera arena, copal)
    if (targetName.includes('rosewood') && normalizeStr(rev.slug || rev.title).includes('rosewood')) return true;
    if (targetName.includes('cera') && normalizeStr(rev.slug || rev.title).includes('cera')) return true;
    if (targetName.includes('copal') && normalizeStr(rev.slug || rev.title).includes('copal')) return true;
    if (targetName.includes('zen') && normalizeStr(rev.slug || rev.title).includes('zen')) return true;
    if (targetName.includes('silencio') && normalizeStr(rev.slug || rev.title).includes('silencio')) return true;

    return false;
  });
}

/**
 * Add a new customer review
 */
export function addCustomerReview({
  productId,
  slug,
  productName,
  author,
  authorEmail,
  rating,
  title,
  comment,
  variant = 'Compra en Línea',
  orderId = null,
}) {
  const allReviews = getAllStoredReviews();
  const initial = author ? author.charAt(0).toUpperCase() : 'S';

  const newReview = {
    id: `rev-custom-${Date.now()}`,
    productId: productId || 'p-generic',
    slug: slug || 'producto-sutra',
    productName: productName || 'Producto Sutra',
    author: author || 'Cliente Sutra',
    authorInitial: initial,
    authorEmail: authorEmail || '',
    rating: Number(rating) || 5,
    date: 'Hoy',
    title: title || 'Experiencia maravillosa',
    comment: comment || '',
    verified: true,
    helpfulCount: 1,
    variant,
    orderId,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [newReview, ...allReviews];
  try {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updatedReviews));
  } catch (e) {
    console.error('[ReviewsService] Error saving review:', e);
  }

  // If tied to an order, update the order in localStorage
  if (orderId) {
    markOrderAsReviewed(orderId, newReview);
  }

  // Broadcast event for live UI reactivity across tabs / components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sutra-review-added', { detail: newReview }));
  }

  return newReview;
}

/**
 * Retrieve user orders for "Mis Compras"
 */
export function getUserOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return [...INITIAL_ORDERS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...INITIAL_ORDERS];
  } catch (e) {
    console.warn('[ReviewsService] Error loading orders:', e);
    return [...INITIAL_ORDERS];
  }
}

/**
 * Mark an order as reviewed
 */
export function markOrderAsReviewed(orderId, reviewData) {
  try {
    const orders = getUserOrders();
    const updated = orders.map((ord) => {
      if (ord.orderId === orderId) {
        return {
          ...ord,
          hasReview: true,
          reviewRating: reviewData.rating,
          reviewTitle: reviewData.title,
          reviewComment: reviewData.comment,
        };
      }
      return ord;
    });
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sutra-orders-updated', { detail: updated }));
    }
  } catch (e) {
    console.error('[ReviewsService] Error marking order reviewed:', e);
  }
}

/**
 * Vote helpful on a review
 */
export function voteHelpful(reviewId) {
  const allReviews = getAllStoredReviews();
  const updated = allReviews.map((r) => {
    if (r.id === reviewId) {
      return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
    }
    return r;
  });
  try {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('[ReviewsService] Error updating helpful vote:', e);
  }
  return updated;
}
