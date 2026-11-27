import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/shopData';
import { useWixProducts } from '../hooks/useWixProducts';
import {
  parseWixMediaUrl,
  formatDescriptionHtml,
  VELA_DE_ARENA_SKU,
  VELA_DE_ARENA_WIX_ID,
  VELA_DE_ARENA_CANONICAL_SLUG,
} from '../lib/wixProducts';
import { trackViewItem } from '../services/dataLayerService';
import ProductReviews from '../components/ProductReviews';
import ProductHowToUse from '../components/ProductHowToUse';
import SEO from '../components/SEO';
import { getProductSEO } from '../data/seoConfig';
import './ProductPage.css';

const VELA_DE_ARENA_RAW_DESCRIPTION =
  '<p>Kit de Vela en polvo + Contenedor + Esencias | Ritual Sutra</p><p>Crea una vela diferente cada vez con la Vela de Arena Sutra. Su cera vegetal en polvo te permite transformar prácticamente cualquier recipiente adecuado en una vela, cambiar su diseño cuando quieras y crear ambientes únicos en casa, eventos, restaurantes, hoteles o espacios de bienestar.</p><p>📦 Incluye: 500 g de cera de Arena · 5 pabilos o mechas · 1 Aroma opcional · Botesito con Cerillos largos · Disponible en color blanco o negro</p>';

const ENCENDEDOR_WIX_ID = '74ddbed9-4167-490b-9544-769a935ae79a';
const ENCENDEDOR_SKU = 'S-AEN-001';
const ENCENDEDOR_FALLBACK_PRODUCT = {
  id: ENCENDEDOR_WIX_ID,
  _wixId: ENCENDEDOR_WIX_ID,
  sku: ENCENDEDOR_SKU,
  slug: 'encendedor-eléctrico-de-plasma-negro-grafito-sutra',
  wixSlug: 'encendedor-eléctrico-de-plasma-negro-grafito-sutra',
  name: 'Encendedor Eléctrico de Plasma Negro Grafito – Sutra',
  emotionalName: 'Ritual Sutra',
  category: 'accesorios',
  price: '$385 MXN',
  priceNum: 385,
  img: 'https://static.wixstatic.com/media/45119e_38ab930c00e1484cba470cd795690d4c~mv2.png',
};

const SUTRA_AROMA_MEDIA = [
  { match: /manzanilla|abrazo/i, img: 'https://static.wixstatic.com/media/45119e_a55e6b41fba5423b94079a6d83594173~mv2.png' },
  { match: /mandarina.*toronja|amanecer/i, img: 'https://static.wixstatic.com/media/45119e_5e27bea406904aa58137f6a397639f34~mv2.png' },
  { match: /ylang|deseo/i, img: 'https://static.wixstatic.com/media/45119e_9e0f9019f01e4a34a1e0011c584f9b21~mv2.png' },
  { match: /copal|limpia/i, img: 'https://static.wixstatic.com/media/45119e_1cea18a09df44703897b7b7af038eade~mv2.png' },
  { match: /mandarina|luz alegre/i, img: 'https://static.wixstatic.com/media/45119e_382c858566db4ac0ad8b81620c16bfff~mv2.png' },
  { match: /rosewood|madre rose|madera rose/i, img: 'https://static.wixstatic.com/media/45119e_a0916ab2abfe4b5e879a34baaf7833a1~mv2.png' },
  { match: /toronja|menta clara|mente clara/i, img: 'https://static.wixstatic.com/media/45119e_ec75ceffb47d40cd9023b9cd83a00ca9~mv2.png' },
  { match: /lavanda|noche serena/i, img: 'https://static.wixstatic.com/media/45119e_cf5a919e806c4c1dbac6219d1648d45b~mv2.png' },
  { match: /patchouli|raiz/i, img: 'https://static.wixstatic.com/media/45119e_1fa84aa50de547beac9d4321fb63d568~mv2.png' },
  { match: /naranja|sol interior/i, img: 'https://static.wixstatic.com/media/45119e_44cf3af8c8dc4e8abbb6c8a849f19703~mv2.png' },
  { match: /incienso|templo/i, img: 'https://static.wixstatic.com/media/45119e_23e71e74391842f1915d2ee54205d74b~mv2.png' },
];

function resolveAromaVisual(choice) {
  const rawLabel = String(choice?.label || choice?.value || '').trim();
  const imgEntry = SUTRA_AROMA_MEDIA.find((entry) => entry.match.test(rawLabel));
  const quotedMatch = rawLabel.match(/^"([^"]+)"\s*(.*)$/);
  const ritualName = quotedMatch ? quotedMatch[1].trim() : rawLabel;
  const botanicalNote = quotedMatch && quotedMatch[2] ? quotedMatch[2].trim() : 'Esencia botánica';

  return {
    img: choice?.img || imgEntry?.img || '',
    ritualName,
    botanicalNote,
  };
}

function resolveVasijaVisual(choice) {
  const rawLabel = String(choice?.label || choice?.value || '').trim();
  const norm = rawLabel.toLowerCase();

  let img = choice?.img || '';
  let finishNote = 'Contenedor reutilizable';
  let tint = '#D4C5A9';

  if (norm.includes('dorada')) {
    img = img || 'https://static.wixstatic.com/media/45119e_a442d8897f69409ca6067c4af521237b~mv2.png';
    finishNote = 'Acabado dorado metálico';
    tint = '#D4A76A';
  } else if (norm.includes('grande negra') || norm.includes('negra')) {
    img = img || 'https://static.wixstatic.com/media/45119e_a3c4fe32e4214ab3a9d4ae1a12719c63~mv2.png';
    finishNote = 'Cerámica negra mate';
    tint = '#2B2520';
  } else if (norm.includes('grande blanca')) {
    img = img || 'https://static.wixstatic.com/media/45119e_4d297947c09f44409795834c69b2fa1c~mv2.png';
    finishNote = 'Cerámica blanca grande';
    tint = '#F2EDE4';
  } else if (norm.includes('chica blanca')) {
    img = img || 'https://static.wixstatic.com/media/45119e_452226efbfee4dc1b03ee36a6948a0b5~mv2.png';
    finishNote = 'Cerámica blanca chica';
    tint = '#F5F0E8';
  } else if (norm.includes('tacita')) {
    finishNote = 'Formato tacita artesanal';
    tint = '#D9CFC1';
  } else if (norm.includes('bambu') || norm.includes('bambú')) {
    finishNote = 'Bambú natural orgánico';
    tint = '#C8A97E';
  }

  return {
    img,
    label: rawLabel,
    finishNote,
    tint,
  };
}

function VesselThumbnail({ img, label, tint }) {
  const [failed, setFailed] = useState(false);

  if (img && !failed) {
    return (
      <img
        src={img}
        alt={label}
        className="lumii-choice-thumb"
        loading="eager"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="lumii-vessel-svg-wrap" style={{ '--vessel-tint': tint }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 10h14l-1.3 6.8a3.2 3.2 0 0 1-3.1 2.5H9.4a3.2 3.2 0 0 1-3.1-2.5L5 10Z" />
        <ellipse cx="12" cy="10" rx="7" ry="1.8" />
        <path d="M12 4.2c1.2 1.4 1.5 2.5.9 3.6" />
      </svg>
    </span>
  );
}

const VELA_DE_ARENA_FALLBACK = {
  id: VELA_DE_ARENA_WIX_ID,
  _wixId: VELA_DE_ARENA_WIX_ID,
  sku: VELA_DE_ARENA_SKU,
  slug: VELA_DE_ARENA_CANONICAL_SLUG,
  wixSlug: 'copia-de-kit-de-velas-de-arena-2-esencias-contenedor-dorado',
  name: 'Vela de Arena Sutra',
  emotionalName: 'Ritual Sutra',
  price: '$690 MXN',
  priceNum: 690,
  category: 'velas',
  shortDesc: '500 g de cera de arena vegetal, 5 pabilos, aroma opcional y cerillos largos.',
  description: 'Kit de Vela en polvo + Contenedor + Esencias | Ritual Sutra. Crea una vela diferente cada vez con la Vela de Arena Sutra.',
  descriptionHtml: formatDescriptionHtml(VELA_DE_ARENA_RAW_DESCRIPTION, ''),
  img: 'https://static.wixstatic.com/media/45119e_0103574325954391bd4cda1a23be17dd~mv2.png',
  images: [
    {
      id: 'wix-img-0',
      src: 'https://static.wixstatic.com/media/45119e_0103574325954391bd4cda1a23be17dd~mv2.png',
      label: '',
    },
    {
      id: 'wix-img-1',
      src: 'https://static.wixstatic.com/media/45119e_6f31282f3a9b421dad79be68ffeb1a4b~mv2.png',
      label: '',
    },
  ],
  options: [
    {
      id: 'color:',
      label: 'Color:',
      type: 'color',
      optKind: 'color',
      choices: [
        {
          label: 'Blanco',
          value: 'Blanco',
          hex: '#FAF7F2',
          isDefault: true,
          img: 'https://static.wixstatic.com/media/45119e_0103574325954391bd4cda1a23be17dd~mv2.png',
        },
        {
          label: 'Negro',
          value: 'Negro',
          hex: '#1C1917',
          isDefault: false,
          img: 'https://static.wixstatic.com/media/45119e_6f31282f3a9b421dad79be68ffeb1a4b~mv2.png',
        },
      ],
    },
    {
      id: 'aroma-1:',
      label: 'Aroma 1:',
      type: 'select',
      optKind: 'aroma',
      choices: [
        { label: '"Abrazo de Calma" Manzanilla', value: '"Abrazo de Calma" Manzanilla', isDefault: false },
        { label: '"Amanecer Vivo" Mandarina-Toronja', value: '"Amanecer Vivo" Mandarina-Toronja', isDefault: false },
        { label: '"Deseo Dorado" Ylang-Ylang', value: '"Deseo Dorado" Ylang-Ylang', isDefault: false },
        { label: '"Limpia Aura" Copal', value: '"Limpia Aura" Copal', isDefault: false },
        { label: '"Luz Alegre" Mandarina', value: '"Luz Alegre" Mandarina', isDefault: false },
        { label: '"Madre Rose" Rosewood', value: '"Madre Rose" Rosewood', isDefault: false },
        { label: '"Menta Clara" Toronja', value: '"Menta Clara" Toronja', isDefault: false },
        { label: '"Noche Serena" Lavanda', value: '"Noche Serena" Lavanda', isDefault: false },
        { label: '"Raiz Profunda" Patchouli', value: '"Raiz Profunda" Patchouli', isDefault: false },
        { label: '"Sol Interior" Naranja', value: '"Sol Interior" Naranja', isDefault: false },
        { label: '"Templo Interior" Incienso', value: '"Templo Interior" Incienso', isDefault: false },
        { label: 'Sin Aroma', value: 'Sin Aroma', isDefault: true },
      ],
    },
    {
      id: 'vasija',
      label: 'Vasija',
      type: 'pills',
      optKind: 'vasija',
      choices: [
        { label: 'Sin Vasija', value: 'Sin Vasija', isDefault: true },
        { label: 'Vasija chica blanca', value: 'Vasija chica blanca', isDefault: false },
        { label: 'Vasija grande negra', value: 'Vasija grande negra', isDefault: false },
        { label: 'Vasija grande blanca', value: 'Vasija grande blanca', isDefault: false },
        { label: 'Vasija grande dorada', value: 'Vasija grande dorada', isDefault: false },
        { label: 'Vasija chica tacita', value: 'Vasija chica tacita', isDefault: false },
        { label: 'Vasija chica de Bambu', value: 'Vasija chica de Bambu', isDefault: false },
      ],
    },
  ],
  wixVariants: [],
  stock: { inStock: true, inventoryStatus: 'IN_STOCK' },
  isWixProduct: true,
};

export default function ProductPage({ product: incomingProduct, onNavigate, onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products: wixProducts, loading: wixLoading } = useWixProducts({ includeHidden: true });

  // Resolve product either by finding slug in dynamic wixProducts/allProducts, or valid incomingProduct
  const isCompleteProduct = (p) => p && Boolean(p.name && (p.priceNum !== undefined || p.price));

  const normalizeSlug = (s) => {
    try {
      return decodeURIComponent(String(s || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  };
  const targetSlugNorm = normalizeSlug(slug);

  const isVelaDeArenaSlug =
    targetSlugNorm === VELA_DE_ARENA_CANONICAL_SLUG ||
    targetSlugNorm === VELA_DE_ARENA_SKU.toLowerCase() ||
    targetSlugNorm === VELA_DE_ARENA_WIX_ID ||
    targetSlugNorm === 'copia-de-kit-de-velas-de-arena-2-esencias-contenedor-dorado';

  const wixList = wixProducts || [];
  const matchedProduct = (
    isVelaDeArenaSlug
      ? (
          wixList.find(
            (p) =>
              p.sku?.toUpperCase() === VELA_DE_ARENA_SKU ||
              p._wixId === VELA_DE_ARENA_WIX_ID ||
              p.slug === slug ||
              p.wixSlug === slug
          ) || VELA_DE_ARENA_FALLBACK
        )
      : (
          slug
            ? wixList.find(
                (p) =>
                  p.slug === slug ||
                  p.wixSlug === slug ||
                  p._wixId === slug ||
                  p.id === slug ||
                  normalizeSlug(p.slug) === targetSlugNorm ||
                  normalizeSlug(p.wixSlug) === targetSlugNorm ||
                  normalizeSlug(p.sku) === targetSlugNorm
              )
              || allProducts.find(
                (p) =>
                  p.slug === slug ||
                  p._wixId === slug ||
                  p.id === slug ||
                  normalizeSlug(p.slug) === targetSlugNorm
              )
            : null
        )
  ) || (isCompleteProduct(incomingProduct) ? incomingProduct : null)
    || (wixList.length > 0 ? wixList[0] : allProducts[0]);

  const product = matchedProduct;

  const lighterProduct =
    wixList.find(
      (p) =>
        p._wixId === ENCENDEDOR_WIX_ID ||
        p.id === ENCENDEDOR_WIX_ID ||
        p.sku?.toUpperCase() === ENCENDEDOR_SKU
    ) ||
    allProducts.find(
      (p) => p._wixId === ENCENDEDOR_WIX_ID || p.sku?.toUpperCase() === ENCENDEDOR_SKU
    ) ||
    ENCENDEDOR_FALLBACK_PRODUCT;

  const isLighterProduct =
    product._wixId === ENCENDEDOR_WIX_ID ||
    product.id === ENCENDEDOR_WIX_ID ||
    product.sku?.toUpperCase() === ENCENDEDOR_SKU ||
    /encendedor/i.test(product.slug || '');

  // Dynamic gallery images safely parsed whether object or string, with choice <-> image links
  const galleryEntries = (
    (product.images && product.images.length > 0)
      ? [...product.images]
      : [product.img || '/assets/images/cera-blanca.jpg']
  ).map((img, idx) => {
    const rawSrc = typeof img === 'string' ? img : (img?.src || img?.url || product.img);
    const parsedSrc = parseWixMediaUrl(rawSrc);
    return {
      id: img?.id || `gallery-thumb-${idx}`,
      src: parsedSrc,
      label: typeof img === 'object' && img?.label ? img.label : '',
      color: img?.color,
      linkedChoices: [],
    };
  }).filter((item) => Boolean(item.src));

  const mergeGalleryChoiceImage = (rawUrl, linkMetaList = [], fallbackLabel = '', fallbackColor = undefined) => {
    const parsed = parseWixMediaUrl(rawUrl);
    if (!parsed) return;
    let entry = galleryEntries.find((item) => item.src === parsed);
    if (!entry) {
      entry = {
        id: linkMetaList[0] ? `opt-img-${linkMetaList[0].choiceValue}` : `var-img-${galleryEntries.length}`,
        src: parsed,
        label: fallbackLabel || '',
        color: fallbackColor,
        linkedChoices: [],
      };
      galleryEntries.push(entry);
    } else {
      if (!entry.label && fallbackLabel) entry.label = fallbackLabel;
      if (!entry.color && fallbackColor) entry.color = fallbackColor;
    }
    linkMetaList.forEach((meta) => {
      if (
        meta &&
        !entry.linkedChoices.some((existing) => existing.optId === meta.optId && existing.choiceValue === meta.choiceValue)
      ) {
        entry.linkedChoices.push(meta);
      }
    });
  };

  // Link option choice images to gallery entries (adds or attaches metadata to existing image)
  if (product.options && Array.isArray(product.options)) {
    product.options.forEach((opt) => {
      const isColorOpt = opt.type === 'color' || opt.optKind === 'color' || /color/i.test(opt.label || '');
      opt.choices?.forEach((ch) => {
        if (ch.img) {
          mergeGalleryChoiceImage(
            ch.img,
            [{ optId: opt.id, choiceValue: ch.value, label: ch.label || ch.value }],
            ch.label || '',
            isColorOpt ? ch.value : undefined
          );
        }
      });
    });
  }

  // Also include images from wixVariants if any, linking matching option choices
  if (product.wixVariants && Array.isArray(product.wixVariants)) {
    product.wixVariants.forEach((v) => {
      const vImg =
        v.variant?.media?.mainMedia?.image?.url ||
        v.variant?.media?.items?.[0]?.image?.url ||
        v.media?.mainMedia?.image?.url ||
        v.media?.items?.[0]?.image?.url ||
        v.image?.url ||
        v.img;
      if (!vImg) return;

      const linkMetaList = [];
      if (v.choices && product.options && Array.isArray(product.options)) {
        Object.entries(v.choices).forEach(([vKey, vVal]) => {
          const opt = product.options.find(
            (o) =>
              o.id === vKey ||
              (o.label || '').toLowerCase().trim() === vKey.toLowerCase().trim()
          );
          const ch = opt?.choices?.find((c) => c.value === vVal || c.label === vVal);
          if (opt && ch) {
            linkMetaList.push({ optId: opt.id, choiceValue: ch.value, label: ch.label || ch.value });
          }
        });
      }

      mergeGalleryChoiceImage(
        vImg,
        linkMetaList,
        Object.values(v.choices || {}).join(' - ')
      );
    });
  }

  const galleryImages = galleryEntries;

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

  const [addLighterAddon, setAddLighterAddon] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  const lastProductIdentityRef = useRef(product._wixId || product.id || product.slug);
  const lastAromaChoiceRef = useRef(null);
  const lastVasijaChoiceRef = useRef(null);

  // When navigating to a different product, reset active image and options;
  // when fallback upgrades to live Wix product with the same ID, preserve user selections
  useEffect(() => {
    const nextIdentity = product._wixId || product.id || product.slug;
    const isSameProduct = nextIdentity === lastProductIdentityRef.current;

    if (!isSameProduct) {
      lastProductIdentityRef.current = nextIdentity;
      lastAromaChoiceRef.current = null;
      lastVasijaChoiceRef.current = null;
      setAddLighterAddon(false);

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
    } else if (product.options && Array.isArray(product.options)) {
      setSelectedChoices((prev) => {
        const next = { ...prev };
        let changed = false;
        product.options.forEach((opt) => {
          const validChoice = opt.choices?.find((c) => c.value === next[opt.id]);
          if (!validChoice) {
            const fallbackChoice = opt.choices?.find((c) => c.isDefault) || opt.choices?.[0];
            if (fallbackChoice) {
              next[opt.id] = fallbackChoice.value;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });
    }
  }, [product]);

  // Calculate dynamic price based on matching Wix variant (if priced) or base price + selected deltas
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

  let matchedVariantPrice = null;
  if (product.wixVariants && Array.isArray(product.wixVariants) && product.options?.length > 0) {
    const exactVar = product.wixVariants.find((v) => {
      if (!v._id || v._id === '00000000-0000-0000-0000-000000000000' || !v.choices) return false;
      return product.options.every((opt) => {
        const picked = selectedChoices[opt.id];
        return !picked || v.choices[opt.label] === picked;
      });
    });
    const rawVarPrice =
      exactVar?.variant?.priceData?.discountedPrice ?? exactVar?.variant?.priceData?.price;
    if (rawVarPrice !== undefined && Number.isFinite(Number(rawVarPrice))) {
      matchedVariantPrice = Number(rawVarPrice);
    }
  }

  const totalPrice =
    matchedVariantPrice !== null
      ? Math.max(0, matchedVariantPrice)
      : Math.max(0, basePrice + priceDeltaSum);

  const showLighterAddon = Boolean(lighterProduct) && !isLighterProduct;
  const lighterPriceNum = Number(lighterProduct?.priceNum) || 385;
  const displayTotalPrice =
    totalPrice + (showLighterAddon && addLighterAddon ? lighterPriceNum : 0);

  // Track ViewContent / view_item once per resolved product with Wix UUID matching catalog feeds
  const lastTrackedViewKeyRef = useRef('');
  useEffect(() => {
    if (!product) return;
    if (slug && wixLoading && !product.isWixProduct) return;
    const viewKey = String(product._wixId || product.id || product.slug || '');
    if (!viewKey || lastTrackedViewKeyRef.current === viewKey) return;
    lastTrackedViewKeyRef.current = viewKey;
    trackViewItem(product, totalPrice);
  }, [product, slug, wixLoading, totalPrice]);

  // Helper to normalize strings for accent-insensitive matching
  const normStr = (s = '') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Helper to extract non-stop words (>= 3 chars) dynamically
  const getKeywords = (str = '') => {
    const stopWords = new Set(['con', 'del', 'los', 'las', 'para', 'por', 'una', 'uno', 'sin', 'set', 'pack']);
    return normStr(str)
      .split(/[^a-z0-9]+/i)
      .filter((w) => w.length >= 3 && !stopWords.has(w));
  };

  const findGalleryMatchForChoice = (choice) => {
    if (!choice || !galleryImages || galleryImages.length === 0) return null;
    const choiceValNorm = normStr(choice.value);
    const choiceLabelNorm = normStr(choice.label);

    const colorMatch = galleryImages.find((img) => {
      if (!img.color) return false;
      const cNorm = normStr(img.color);
      return cNorm === choiceValNorm || cNorm === choiceLabelNorm || choiceValNorm.includes(cNorm) || choiceLabelNorm.includes(cNorm);
    });
    if (colorMatch) return colorMatch.src;

    const kws = getKeywords(`${choice.value} ${choice.label}`);
    if (kws.length === 0) return null;

    let bestImg = null;
    let bestScore = 0;
    galleryImages.forEach((img) => {
      const imgText = `${normStr(img.label)} ${normStr(img.id)} ${normStr(img.src)}`;
      const score = kws.reduce((acc, kw) => (imgText.includes(kw) ? acc + 1 : acc), 0);
      if (score > bestScore) {
        bestScore = score;
        bestImg = img;
      }
    });
    return bestImg && bestScore > 0 ? bestImg.src : null;
  };

  // Handle option change with 100% dynamic bidirectional variant-to-image resolution
  const handleOptionChange = (optionId, choice) => {
    const updated = {
      ...selectedChoices,
      [optionId]: choice.value,
    };
    setSelectedChoices(updated);

    const isNeutralNone = /^sin\s*(aroma|vasija)$/i.test(normStr(choice.value || choice.label || ''));
    let resolvedImg = null;

    // 1. Direct image configured on choice
    if (choice.img) {
      resolvedImg = parseWixMediaUrl(choice.img);
    }

    // 2. Wix variants matching updated choices (multi-attribute combination)
    if (!resolvedImg && product.wixVariants && Array.isArray(product.wixVariants) && product.wixVariants.length > 0) {
      const match = product.wixVariants.find((v) => {
        if (!v.choices) return false;
        return Object.entries(updated).every(([optKey, optVal]) => {
          const optObj = product.options?.find((o) => o.id === optKey);
          const optLabel = optObj?.label || optKey;
          const normKey = normStr(optLabel);
          const normVal = normStr(optVal);

          const matchKey = Object.keys(v.choices).find((k) => normStr(k) === normKey || normStr(k) === normStr(optKey));
          if (matchKey) {
            return normStr(v.choices[matchKey]) === normVal;
          }
          return Object.values(v.choices).some((vVal) => normStr(vVal) === normVal);
        });
      });
      if (match) {
        const rawVar = match.variant?.media?.mainMedia?.image?.url
          || match.variant?.media?.items?.[0]?.image?.url
          || match.media?.mainMedia?.image?.url
          || match.media?.items?.[0]?.image?.url
          || match.image?.url
          || match.img;
        if (rawVar) resolvedImg = parseWixMediaUrl(rawVar);
      }
    }

    // 3. Dynamic color or keyword match across galleryImages for clicked choice
    if (!resolvedImg && !isNeutralNone) {
      resolvedImg = findGalleryMatchForChoice(choice);
    }

    // 4. Fallback when selecting a neutral "Sin aroma" / "Sin vasija" (or choice without media):
    // resolve from the remaining active options (Vasija -> Aroma -> Color) or lead gallery image
    if (!resolvedImg && product.options && Array.isArray(product.options)) {
      const priorityRank = (opt) => {
        const key = `${opt.optKind || ''} ${opt.label || ''}`.toLowerCase();
        if (/vasija|contenedor/.test(key)) return 0;
        if (/aroma|esencia/.test(key)) return 1;
        if (/color/.test(key)) return 2;
        return 3;
      };
      const remainingOpts = [...product.options]
        .filter((o) => o.id !== optionId)
        .sort((a, b) => priorityRank(a) - priorityRank(b));

      for (const remOpt of remainingOpts) {
        const remVal = updated[remOpt.id];
        const remChoice = remOpt.choices?.find((c) => c.value === remVal);
        if (!remChoice) continue;
        if (/^sin\s*(aroma|vasija)$/i.test(normStr(remChoice.value || remChoice.label || ''))) continue;
        if (remChoice.img) {
          resolvedImg = parseWixMediaUrl(remChoice.img);
          break;
        }
        const galleryHit = findGalleryMatchForChoice(remChoice);
        if (galleryHit) {
          resolvedImg = galleryHit;
          break;
        }
      }
    }

    if (!resolvedImg && isNeutralNone && galleryImages[0]?.src) {
      resolvedImg = galleryImages[0].src;
    }

    if (resolvedImg) {
      setActiveImg(resolvedImg);
    }
  };

  // Bidirectional sync: clicking a thumbnail dynamically selects the matching option/variant choice
  const syncOptionFromImage = (imgItem) => {
    if (!product.options || !Array.isArray(product.options)) return;
    const updates = {};

    // 1. Explicit links captured from Wix choice media / variant media
    if (Array.isArray(imgItem.linkedChoices) && imgItem.linkedChoices.length > 0) {
      imgItem.linkedChoices.forEach((link) => {
        if (link?.optId && link?.choiceValue) {
          updates[link.optId] = link.choiceValue;
        }
      });
    }

    // 2. Fallback matching for options not already linked explicitly
    const imgKws = getKeywords(`${imgItem.label} ${imgItem.id} ${imgItem.src}`);
    product.options.forEach((opt) => {
      if (updates[opt.id]) return;
      const matchedChoice = opt.choices?.find((choice) => {
        const chVal = normStr(choice.value);
        const chLabel = normStr(choice.label);

        if (choice.img && (choice.img === imgItem.src || parseWixMediaUrl(choice.img) === imgItem.src)) {
          return true;
        }
        if (imgItem.color) {
          const cNorm = normStr(imgItem.color);
          if (cNorm === chVal || cNorm === chLabel || chVal.includes(cNorm)) return true;
        }
        if (imgKws.length > 0) {
          const chKws = getKeywords(`${choice.value} ${choice.label}`);
          if (chKws.some((ckw) => imgKws.includes(ckw))) return true;
        }
        return false;
      });

      if (matchedChoice) {
        updates[opt.id] = matchedChoice.value;
      }
    });

    if (Object.keys(updates).length > 0) {
      product.options.forEach((opt) => {
        const pickedVal = updates[opt.id];
        if (!pickedVal || /^sin\s*(aroma|vasija)$/i.test(normStr(pickedVal))) return;
        const pickedChoice = opt.choices?.find((c) => c.value === pickedVal);
        if (!pickedChoice) return;
        const kindStr = `${opt.optKind || ''} ${opt.label || ''}`.toLowerCase();
        if (opt.optKind === 'aroma' || /aroma|esencia/.test(kindStr)) {
          lastAromaChoiceRef.current = pickedChoice;
        } else if (opt.optKind === 'vasija' || /vasija|contenedor/.test(kindStr)) {
          lastVasijaChoiceRef.current = pickedChoice;
        }
      });

      setSelectedChoices((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

  // Carousel navigation
  const currentImgIndex = galleryImages.findIndex((img) => img.src === activeImg);
  const handlePrevImg = () => {
    const newIdx = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    const item = galleryImages[newIdx];
    setActiveImg(item.src);
    syncOptionFromImage(item);
  };

  const handleNextImg = () => {
    const newIdx = (currentImgIndex + 1) % galleryImages.length;
    const item = galleryImages[newIdx];
    setActiveImg(item.src);
    syncOptionFromImage(item);
  };

  const handleThumbnailClick = (imgItem) => {
    setActiveImg(imgItem.src);
    syncOptionFromImage(imgItem);
  };

  // Add to cart handler
  const handleAdd = async () => {
    if (isAddingBundle || !onAddToCart) return;
    setIsAddingBundle(true);
    try {
      // Build human-readable option summary & exact Wix Store options map
      const optionLabels = [];
      const wixOptions = {};
      if (product.options && Array.isArray(product.options)) {
        product.options.forEach((opt) => {
          const val = selectedChoices[opt.id];
          const choice = opt.choices?.find((c) => c.value === val);
          if (choice) {
            optionLabels.push(choice.label);
            if (opt.label) {
              wixOptions[opt.label] = choice.value;
            }
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
        wixOptions: Object.keys(wixOptions).length > 0 ? wixOptions : undefined,
      };

      await onAddToCart(customizedItem);

      if (showLighterAddon && addLighterAddon && lighterProduct) {
        await onAddToCart({
          ...lighterProduct,
          id: lighterProduct.id || ENCENDEDOR_WIX_ID,
          _wixId: lighterProduct._wixId || ENCENDEDOR_WIX_ID,
          name: lighterProduct.name || ENCENDEDOR_FALLBACK_PRODUCT.name,
          emotionalName: lighterProduct.emotionalName || 'Ritual Sutra',
          price: lighterProduct.price || `$${lighterPriceNum.toLocaleString()} MXN`,
          priceNum: lighterPriceNum,
          img: parseWixMediaUrl(lighterProduct.img) || ENCENDEDOR_FALLBACK_PRODUCT.img,
        });
      }
    } finally {
      setIsAddingBundle(false);
    }
  };

  // Cross-sell items (pick complementary items dynamically from Wix or catalog, excluding hidden shop items)
  const rawCatalogForCross = (wixProducts && wixProducts.length > 0) ? wixProducts : allProducts;
  const catalogForCross = rawCatalogForCross.filter((p) => !p.hideFromShop);
  const complementaryProducts = catalogForCross
    .filter((p) => (p._wixId || p.id) !== (product._wixId || product.id) && p.category !== product.category)
    .slice(0, 2);

  // Dynamic category eyebrow text
  const categoryEyebrow = product.subcategory 
    ? `OBJETOS RITUALES · ${product.subcategory.toUpperCase().replace('-', ' ')}`
    : (product.category === 'accesorios'
        ? 'OBJETOS RITUALES'
        : (product.category === 'velas'
            ? 'VELAS DE ARENA'
            : (product.category ? product.category.toUpperCase() : 'SUTRA MEXICO')));

  // Extract first paragraph for initial preview and collapse the rest
  let firstParagraphText = '';
  let remainingDescriptionHtml = '';

  if (product.descriptionHtml) {
    const pMatch = product.descriptionHtml.match(/^(\s*<p[^>]*>([\s\S]*?)<\/p>)/i);
    if (pMatch) {
      firstParagraphText = pMatch[2].replace(/<[^>]*>/g, '').trim();
      remainingDescriptionHtml = product.descriptionHtml.slice(pMatch[1].length).trim();
    } else {
      const matchFirstBlock = product.descriptionHtml.match(/^(\s*<[^>]+>[\s\S]*?<\/[^>]+>)/i);
      if (matchFirstBlock) {
        firstParagraphText = matchFirstBlock[0].replace(/<[^>]*>/g, '').trim();
        remainingDescriptionHtml = product.descriptionHtml.slice(matchFirstBlock[0].length).trim();
      } else {
        firstParagraphText = (product.description || '').split(/\n+/)[0] || '';
        remainingDescriptionHtml = product.descriptionHtml;
      }
    }
  } else {
    const rawParagraphs = (product.description || '').split(/\n\s*\n|\n/);
    firstParagraphText = rawParagraphs[0] || '';
    if (rawParagraphs.length > 1) {
      remainingDescriptionHtml = rawParagraphs.slice(1).map(p => `<p>${p}</p>`).join('');
    }
  }

  const seoData = getProductSEO(product);

  return (
    <div className="product-page fade-in">
      <SEO {...seoData} />
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
          </div>

          {/* Dynamic Options Configurator: Guided 3-step builder for Vela de Arena Sutra, generic fallback otherwise */}
          {product.options && product.options.length > 0 && (() => {
            const colorOption = product.options.find(
              (o) => o.optKind === 'color' || o.type === 'color' || /color/i.test(o.label || '')
            );
            const aromaOption = product.options.find(
              (o) => o.optKind === 'aroma' || /aroma|esencia/i.test(o.label || '')
            );
            const vasijaOption = product.options.find(
              (o) => o.optKind === 'vasija' || /vasija|contenedor/i.test(o.label || '')
            );

            const isSinAromaChoice = (c) =>
              /^sin\s*aroma$/i.test(String(c?.value || '').trim()) ||
              /^sin\s*aroma$/i.test(String(c?.label || '').trim());
            const isSinVasijaChoice = (c) =>
              /^sin\s*vasija$/i.test(String(c?.value || '').trim()) ||
              /^sin\s*vasija$/i.test(String(c?.label || '').trim());

            const hasSinAromaChoice = Boolean(aromaOption?.choices?.some(isSinAromaChoice));
            const hasSinVasijaChoice = Boolean(vasijaOption?.choices?.some(isSinVasijaChoice));

            const isGuidedCandleBuilder = Boolean(
              colorOption &&
              aromaOption &&
              vasijaOption &&
              (
                product.sku?.toUpperCase() === VELA_DE_ARENA_SKU ||
                product._wixId === VELA_DE_ARENA_WIX_ID ||
                (hasSinAromaChoice && hasSinVasijaChoice)
              )
            );

            if (!isGuidedCandleBuilder) {
              return (
                <div className="pdp-configurator-box">
                  {product.options.map((opt) => {
                    const currentVal = selectedChoices[opt.id];
                    const activeChoice = opt.choices?.find((c) => c.value === currentVal) || opt.choices?.[0];

                    return (
                      <div key={opt.id} className="config-section">
                        <div className="config-label-row">
                          <span className="config-label">
                            <span>{String(opt.label || '').replace(/:+$/, '')}:</span>
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

                        {/* 2. PILLS SELECTOR (for small amount of choices) */}
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

                        {/* 3. SELECT DROPDOWN WITH ICON (For aromas or many choices) */}
                        {opt.type === 'select' && (
                          <div className="luxury-select-box">
                            <div className="luxury-select-control">
                              <span className="luxury-select-icon">
                                {(() => {
                                  const l = (activeChoice?.label || '').toLowerCase();
                                  if (l.includes('mandarina') || l.includes('toronja') || l.includes('naranja') || l.includes('sol') || l.includes('alegre') || l.includes('amanecer')) return '🍊';
                                  if (l.includes('lavanda') || l.includes('serena') || l.includes('noche')) return '🌿';
                                  if (l.includes('manzanilla') || l.includes('calma') || l.includes('abrazo')) return '🌼';
                                  if (l.includes('ylang') || l.includes('dorado') || l.includes('deseo')) return '🌸';
                                  if (l.includes('menta')) return '🍃';
                                  if (l.includes('patchouli') || l.includes('raiz') || l.includes('raíz')) return '🪵';
                                  if (l.includes('incienso') || l.includes('templo')) return '✨';
                                  if (l.includes('copal') || l.includes('aura') || l.includes('limpia')) return '🕊️';
                                  if (l.includes('rosewood') || l.includes('madre') || l.includes('rosa')) return '🌹';
                                  return '✦';
                                })()}
                              </span>
                              <select
                                className="luxury-custom-select"
                                value={currentVal}
                                onChange={(e) => {
                                  const found = opt.choices.find((c) => c.value === e.target.value);
                                  if (found) handleOptionChange(opt.id, found);
                                }}
                              >
                                {opt.choices.map((choice) => (
                                  <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                  </option>
                                ))}
                              </select>
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
              );
            }

            // Guided 3-step builder for Vela de Arena Sutra
            const currentColorVal = selectedChoices[colorOption.id] || colorOption.choices[0]?.value;
            const sinAromaChoice =
              aromaOption.choices.find(isSinAromaChoice) ||
              { label: 'Sin Aroma', value: 'Sin Aroma' };
            const includedAromas = aromaOption.choices.filter((c) => !isSinAromaChoice(c));
            const currentAromaVal = selectedChoices[aromaOption.id] ?? sinAromaChoice.value;
            const isAromaIncluded = !/^sin\s*aroma$/i.test(String(currentAromaVal || '').trim());

            const sinVasijaChoice =
              vasijaOption.choices.find(isSinVasijaChoice) ||
              { label: 'Sin Vasija', value: 'Sin Vasija' };
            const includedVasijas = vasijaOption.choices.filter((c) => !isSinVasijaChoice(c));
            const currentVasijaVal = selectedChoices[vasijaOption.id] ?? sinVasijaChoice.value;
            const isVasijaIncluded = !/^sin\s*vasija$/i.test(String(currentVasijaVal || '').trim());

            const handleSelectAromaMode = (include) => {
              if (!include) {
                if (isAromaIncluded) {
                  const prevChoice = includedAromas.find((c) => c.value === currentAromaVal);
                  if (prevChoice) lastAromaChoiceRef.current = prevChoice;
                }
                handleOptionChange(aromaOption.id, sinAromaChoice);
              } else {
                const restore =
                  (lastAromaChoiceRef.current &&
                    includedAromas.find((c) => c.value === lastAromaChoiceRef.current.value)) ||
                  includedAromas[0];
                if (restore) {
                  lastAromaChoiceRef.current = restore;
                  handleOptionChange(aromaOption.id, restore);
                }
              }
            };

            const handleSelectVasijaMode = (include) => {
              if (!include) {
                if (isVasijaIncluded) {
                  const prevChoice = includedVasijas.find((c) => c.value === currentVasijaVal);
                  if (prevChoice) lastVasijaChoiceRef.current = prevChoice;
                }
                handleOptionChange(vasijaOption.id, sinVasijaChoice);
              } else {
                const restore =
                  (lastVasijaChoiceRef.current &&
                    includedVasijas.find((c) => c.value === lastVasijaChoiceRef.current.value)) ||
                  includedVasijas[0];
                if (restore) {
                  lastVasijaChoiceRef.current = restore;
                  handleOptionChange(vasijaOption.id, restore);
                }
              }
            };

            return (
              <div className="pdp-configurator-box lumii-configurator">
                {/* STEP 1: COLOR BLANCO O NEGRO */}
                <div className="lumii-step-block">
                  <div className="lumii-step-header">
                    <span className="lumii-step-title">
                      <span className="lumii-step-num">1</span>
                      <span>Elige el color de cera</span>
                    </span>
                    <strong className="lumii-step-value">{currentColorVal}</strong>
                  </div>

                  <div className="lumii-color-grid">
                    {colorOption.choices.map((choice) => {
                      const isSelected = currentColorVal === choice.value;
                      const isDarkWax = /negro|black/i.test(choice.label || choice.value);
                      return (
                        <button
                          key={choice.value}
                          type="button"
                          data-testid={`color-card-${choice.value.toLowerCase()}`}
                          className={`lumii-color-card ${isSelected ? 'is-active' : ''}`}
                          onClick={() => handleOptionChange(colorOption.id, choice)}
                        >
                          {choice.img && (
                            <img
                              src={choice.img}
                              alt={`Cera ${choice.label}`}
                              className="lumii-color-thumb"
                              loading="lazy"
                            />
                          )}
                          <span className="lumii-color-meta">
                            <span className="lumii-color-name-row">
                              <span
                                className="color-dot"
                                style={{ backgroundColor: choice.hex || '#FAF7F2' }}
                              />
                              <strong>{choice.label}</strong>
                            </span>
                            <small>{isDarkWax ? 'Cera perlada negra' : 'Cera perlada blanca'}</small>
                          </span>
                          <span className="lumii-check-badge" aria-hidden="true">
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: AROMA (SIN AROMA / INCLUIR AROMA) */}
                <div className="lumii-step-block">
                  <div className="lumii-step-header">
                    <span className="lumii-step-title">
                      <span className="lumii-step-num">2</span>
                      <span>¿Quieres incluir aroma?</span>
                    </span>
                    <strong className="lumii-step-value">{currentAromaVal}</strong>
                  </div>

                  <div className="lumii-mode-toggle">
                    <button
                      type="button"
                      data-testid="aroma-mode-none"
                      className={`lumii-mode-btn ${!isAromaIncluded ? 'is-active' : ''}`}
                      onClick={() => handleSelectAromaMode(false)}
                    >
                      <strong>Sin aroma</strong>
                      <span>Cera neutra sin fragancia</span>
                    </button>
                    <button
                      type="button"
                      data-testid="aroma-mode-include"
                      className={`lumii-mode-btn ${isAromaIncluded ? 'is-active' : ''}`}
                      onClick={() => handleSelectAromaMode(true)}
                    >
                      <strong>Incluir aroma</strong>
                      <span>Elige entre {includedAromas.length} esencias</span>
                    </button>
                  </div>

                  {isAromaIncluded && (
                    <div className="lumii-subpanel" data-testid="aroma-options-panel">
                      <div className="lumii-aroma-grid">
                        {includedAromas.map((choice) => {
                          const isSelected = currentAromaVal === choice.value;
                          const visual = resolveAromaVisual(choice);
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              className={`lumii-choice-card ${isSelected ? 'is-active' : ''}`}
                              onClick={() => {
                                lastAromaChoiceRef.current = choice;
                                handleOptionChange(aromaOption.id, choice);
                              }}
                            >
                              {visual.img && (
                                <img
                                  src={visual.img}
                                  alt={visual.ritualName}
                                  className="lumii-choice-thumb"
                                  loading="eager"
                                />
                              )}
                              <span className="lumii-choice-text">
                                <strong>{visual.ritualName}</strong>
                                <small>{visual.botanicalNote}</small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 3: VASIJA (SIN VASIJA / AGREGAR VASIJA) */}
                <div className="lumii-step-block">
                  <div className="lumii-step-header">
                    <span className="lumii-step-title">
                      <span className="lumii-step-num">3</span>
                      <span>¿Quieres agregar vasija?</span>
                    </span>
                    <strong className="lumii-step-value">{currentVasijaVal}</strong>
                  </div>

                  <div className="lumii-mode-toggle">
                    <button
                      type="button"
                      data-testid="vasija-mode-none"
                      className={`lumii-mode-btn ${!isVasijaIncluded ? 'is-active' : ''}`}
                      onClick={() => handleSelectVasijaMode(false)}
                    >
                      <strong>Sin vasija</strong>
                      <span>Usa tu propio recipiente</span>
                    </button>
                    <button
                      type="button"
                      data-testid="vasija-mode-include"
                      className={`lumii-mode-btn ${isVasijaIncluded ? 'is-active' : ''}`}
                      onClick={() => handleSelectVasijaMode(true)}
                    >
                      <strong>Agregar vasija</strong>
                      <span>Elige tu contenedor artesanal</span>
                    </button>
                  </div>

                  {isVasijaIncluded && (
                    <div className="lumii-subpanel" data-testid="vasija-options-panel">
                      <div className="lumii-vasija-grid">
                        {includedVasijas.map((choice) => {
                          const isSelected = currentVasijaVal === choice.value;
                          const visual = resolveVasijaVisual(choice);
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              className={`lumii-choice-card ${isSelected ? 'is-active' : ''}`}
                              onClick={() => {
                                lastVasijaChoiceRef.current = choice;
                                handleOptionChange(vasijaOption.id, choice);
                              }}
                            >
                              <VesselThumbnail
                                img={visual.img}
                                label={visual.label}
                                tint={visual.tint}
                              />
                              <span className="lumii-choice-text">
                                <strong>{visual.label}</strong>
                                <small>
                                  {choice.priceDelta
                                    ? `${visual.finishNote} · +$${choice.priceDelta} MXN`
                                    : visual.finishNote}
                                </small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* SUMMARY BAR */}
                <div className="lumii-summary-bar" aria-label="Resumen de tu configuración">
                  <span className="lumii-summary-label">Tu ritual:</span>
                  <div className="lumii-summary-chips">
                    <span className="lumii-summary-chip">{currentColorVal}</span>
                    <span className="lumii-summary-chip">{currentAromaVal}</span>
                    <span className="lumii-summary-chip">{currentVasijaVal}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Order Bump: Encendedor Eléctrico de Plasma (Kamibi-style mini box) */}
          {showLighterAddon && (
            <div
              className={`sutra-addon-card ${addLighterAddon ? 'active' : ''}`}
              onClick={() => setAddLighterAddon((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setAddLighterAddon((prev) => !prev);
                }
              }}
              role="checkbox"
              aria-checked={addLighterAddon}
              tabIndex={0}
            >
              <div className="sutra-addon-toggle">
                <div className={`sutra-addon-checkbox ${addLighterAddon ? 'checked' : ''}`}>
                  {addLighterAddon && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <img
                  src={parseWixMediaUrl(lighterProduct.img) || ENCENDEDOR_FALLBACK_PRODUCT.img}
                  alt={lighterProduct.name}
                  className="sutra-addon-thumb"
                />
                <div className="sutra-addon-info">
                  <span className="sutra-addon-title">
                    Agregar Encendedor Eléctrico de Plasma
                  </span>
                  <span className="sutra-addon-desc">
                    Arco eléctrico sin llama · Recargable USB · Negro Grafito
                  </span>
                </div>
              </div>
              <span className="sutra-addon-price">
                +${lighterPriceNum.toLocaleString()} MXN
              </span>
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="pdp-cta-wrap">
            <button
              type="button"
              className="btn-add-to-cart-large"
              onClick={handleAdd}
              disabled={isAddingBundle}
            >
              {isAddingBundle
                ? 'Añadiendo...'
                : `${product.options?.length > 0 ? 'Personalizar & Añadir' : 'Añadir al Carrito'} — $${displayTotalPrice.toLocaleString()} MXN`}
            </button>
          </div>

          {/* Product description placed below customization options & CTA */}
          {firstParagraphText && (
            <div className="pdp-description-block">
              <p className="pdp-intro-lead">
                {firstParagraphText}
              </p>
            </div>
          )}

          {/* Candle Unique Value Propositions (Úsala en el envase que quieras, etc.) */}
          {(product.category === 'velas' || /vela|arena|cera|wax/i.test(product.name || '')) && (
            <div className="pdp-candle-value-props">
              <div className="candle-prop-card">
                <span className="candle-prop-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
                <span className="candle-prop-text">Úsala en el envase que quieras</span>
              </div>

              <div className="candle-prop-card">
                <span className="candle-prop-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    <path d="m9 8 2 2 4-4" />
                  </svg>
                </span>
                <span className="candle-prop-text">Más del doble de duración que las velas tradicionales</span>
              </div>

              <div className="candle-prop-card">
                <span className="candle-prop-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </span>
                <span className="candle-prop-text">Decoración única y original</span>
              </div>

              <div className="candle-prop-card">
                <span className="candle-prop-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                  </svg>
                </span>
                <span className="candle-prop-text">Envío gratis a todo México a partir de $1,500 MXN</span>
              </div>
            </div>
          )}

          {/* Collapsible Accordions: Description & Shipping */}
          <div className="pdp-accordions">
            {remainingDescriptionHtml ? (
              <details className="pdp-accordion">
                <summary className="pdp-accordion-summary">
                  <span>✧ Ver detalles completos & características</span>
                  <span className="pdp-accordion-icon"></span>
                </summary>
                <div className="pdp-accordion-content">
                  <div 
                    className="pdp-description-formatted"
                    dangerouslySetInnerHTML={{ __html: remainingDescriptionHtml }}
                  />
                </div>
              </details>
            ) : null}

            <details className="pdp-accordion">
              <summary className="pdp-accordion-summary">
                <span>🚚 Envíos & Garantía Sutra</span>
                <span className="pdp-accordion-icon"></span>
              </summary>
              <div className="pdp-accordion-content">
                <p><strong>Envíos a todo México:</strong> Entrega rápida asegurada con DHL y FedEx (24-48h en CDMX, 3-5 días hábiles al interior). Envío sin costo en compras superiores a $1,500 MXN.</p>
                <p><strong>Garantía de Satisfacción:</strong> Empaque compostable protegido contra roturas. Si requieres asistencia con tus aromas o tu pedido, nuestro concierge en WhatsApp te asiste al instante.</p>
              </div>
            </details>
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
                  Envíos protegidos a todo México en 3 a 7 días hábiles. Empaque 100% sustentable y libre de plásticos vírgenes. Si tu pieza llega con algún detalle, la reemplazamos de inmediato sin costo.
                </p>
                <p className="pdp-terms-link-wrap" style={{ marginTop: '0.75rem' }}>
                  <a 
                    href="/contacto" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (onNavigate) onNavigate('contact'); 
                      navigate('/contacto'); 
                    }} 
                    className="pdp-terms-link"
                    style={{ color: '#9C7A4A', textDecoration: 'underline', fontSize: '0.88rem', fontWeight: 500 }}
                  >
                    Revisar términos y condiciones
                  </a>
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* ============================================================
          VISUAL HOW-TO-USE STEP-BY-STEP GUIDE (VELAS DE ARENA / TÉS / ZEN)
          ============================================================ */}
      <ProductHowToUse product={product} />

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
