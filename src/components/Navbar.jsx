import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoDark from '../assets/logo/LOGO-07.png';
import logoLight from '../assets/logo/LOGO-08.png';
import zenImg from '../assets/images/jardin-zen-detalle.jpg';
import cartasImg from '../assets/images/cartas-rituales.jpg';
import vasijasImg from '../assets/images/vasijas.jpg';
import ceraNegraImg from '../assets/images/cera-negra.jpg';
import teCeremonialImg from '../assets/images/cat-te-ceremonial.jpg';
import './Navbar.css';

export default function Navbar({ onNavigate, currentPage, onOpenUser, onOpenCart, cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileAccOpen, setMobileAccOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 140);
  };

  const currentPath = location.pathname;
  const isHome = currentPath === '/';
  const isShop = currentPath.startsWith('/tienda') || currentPath.startsWith('/producto');
  const isEvents = currentPath.startsWith('/eventos');
  const isAbout = currentPath.startsWith('/nosotros');
  const isCommunity = currentPath.startsWith('/comunidad') || currentPath.startsWith('/blog');
  const isContact = currentPath.startsWith('/contacto') || currentPath.startsWith('/contact');
  const isMystery = currentPath.startsWith('/mysterybox') || currentPath.startsWith('/misterybox') || currentPath.startsWith('/suscripcion');

  // When not on home, treat navbar as light-theme (dark text)
  const isLightTheme = !isHome;
  const showDarkLogo = isLightTheme || scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShopSelect = (category = 'all', subcategory = null) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    if (onNavigate) onNavigate('shop', null, category, subcategory);
    
    if (category === 'all' || !category) {
      navigate('/tienda');
    } else if (category === 'accesorios' && subcategory) {
      navigate(`/tienda/accesorios/${subcategory}`);
    } else {
      navigate(`/tienda/${category}`);
    }
  };

  const handleLinkClick = (path, anchor = null) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    if (onNavigate) {
      if (path === '/') onNavigate('home');
      else if (path === '/tienda') onNavigate('shop');
      else if (path === '/nosotros') onNavigate('about');
      else if (path === '/eventos') onNavigate('events');
      else if (path === '/comunidad') onNavigate('blog');
      else if (path === '/contacto') onNavigate('contact');
      else if (path === '/mysterybox') onNavigate('mysterybox');
    }
    navigate(path);
    if (anchor) {
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav
      id="navbar"
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''} ${isLightTheme ? 'navbar--light-theme' : ''}`}
    >
      <div className="navbar__inner container">
        {/* Brand Logo */}
        <a 
          href="/" 
          className="navbar__brand" 
          aria-label="Sutra México - Inicio" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}
        >
          <img 
            src={showDarkLogo ? logoDark : logoLight} 
            alt="Sutra México" 
            className="navbar__logo-img" 
          />
        </a>

        {/* Clean, simplified navigation menu */}
        <ul className="navbar__links" id="nav-links">
          {/* Tienda with rich visual mega dropdown */}
          <li 
            className={`navbar__item navbar__item--has-dropdown ${dropdownOpen ? 'is-active' : ''}`}
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`navbar__link navbar__link--dropdown-trigger ${isShop ? 'active-link' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setDropdownOpen((prev) => !prev);
              }}
              aria-expanded={dropdownOpen}
              id="shop-menu-btn"
            >
              <span>Tienda</span>
              <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Mega Dropdown Menu */}
            <div 
              className={`navbar__dropdown navbar__dropdown--mega ${dropdownOpen ? 'navbar__dropdown--visible' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="megamenu__inner">
                {/* Columna 1: Colecciones Principales */}
                <div className="megamenu__col megamenu__col--main">
                  <div className="megamenu__col-header">
                    <span className="megamenu__eyebrow">COLECCIONES</span>
                    <span className="megamenu__pill">CATÁLOGO</span>
                  </div>

                  <button 
                    className="megamenu__all-btn" 
                    onClick={() => handleShopSelect('all')}
                  >
                    <div className="megamenu__all-icon">✦</div>
                    <div className="megamenu__all-text">
                      <strong>Todos los productos</strong>
                      <small>Explora el catálogo completo de bienestar</small>
                    </div>
                    <span className="megamenu__all-arrow">→</span>
                  </button>

                  <div className="megamenu__categories-list">
                    <button 
                      className="megamenu__cat-link" 
                      onClick={() => handleShopSelect('velas')}
                    >
                      <div className="megamenu__cat-info">
                        <span className="megamenu__cat-title">Velas de Arena</span>
                        <span className="megamenu__cat-desc">Cera perlada vegetal & combustión limpia</span>
                      </div>
                      <span className="megamenu__cat-badge">Colección</span>
                    </button>

                    <button 
                      className="megamenu__cat-link" 
                      onClick={() => handleShopSelect('aromas')}
                    >
                      <div className="megamenu__cat-info">
                        <span className="megamenu__cat-title">Esencias & Aromas</span>
                        <span className="megamenu__cat-desc">11 Esencias botánicas puras y difusores</span>
                      </div>
                      <span className="megamenu__cat-badge">11 aromas</span>
                    </button>

                    <button 
                      className="megamenu__cat-link" 
                      onClick={() => handleShopSelect('accesorios')}
                    >
                      <div className="megamenu__cat-info">
                        <span className="megamenu__cat-title">Objetos de Ritual</span>
                        <span className="megamenu__cat-desc">Jardines zen, cartas y vasijas cerámicas</span>
                      </div>
                      <span className="megamenu__cat-badge">Accesorios</span>
                    </button>

                    <button 
                      className="megamenu__cat-link" 
                      onClick={() => handleShopSelect('te')}
                    >
                      <div className="megamenu__cat-info">
                        <span className="megamenu__cat-title">Té Ceremonial</span>
                        <span className="megamenu__cat-desc">Blends botánicos e infusiones de ritual</span>
                      </div>
                      <span className="megamenu__cat-badge">4 blends</span>
                    </button>
                  </div>
                </div>

                {/* Columna 2: Accesorios & Experiencias con Mini-Fotos */}
                <div className="megamenu__col megamenu__col--accessories">
                  <div className="megamenu__col-header">
                    <span className="megamenu__eyebrow">OBJETOS DE RITUAL</span>
                    <button 
                      className="megamenu__sublink-all" 
                      onClick={() => handleShopSelect('accesorios')}
                    >
                      Ver todos →
                    </button>
                  </div>

                  <div className="megamenu__thumb-cards">
                    <button 
                      className="megamenu__thumb-card" 
                      onClick={() => handleShopSelect('accesorios', 'jardin-zen')}
                    >
                      <div className="megamenu__thumb-media">
                        <img src={zenImg} alt="Jardín Zen Sutra" loading="lazy" />
                        <span className="megamenu__thumb-zoom-icon">✦</span>
                      </div>
                      <div className="megamenu__thumb-body">
                        <strong>Jardín Zen</strong>
                        <span>Arena blanca, rastrillo y cuarzos naturales</span>
                        <em className="megamenu__thumb-tag">Meditación activa</em>
                      </div>
                    </button>

                    <button 
                      className="megamenu__thumb-card" 
                      onClick={() => handleShopSelect('accesorios', 'cartas-rituales')}
                    >
                      <div className="megamenu__thumb-media">
                        <img src={cartasImg} alt="Cartas de Rituales Sutra" loading="lazy" />
                        <span className="megamenu__thumb-zoom-icon">✦</span>
                      </div>
                      <div className="megamenu__thumb-body">
                        <strong>Cartas de Rituales</strong>
                        <span>Baraja de 44 intenciones con guía dorada</span>
                        <em className="megamenu__thumb-tag">Introspección diaria</em>
                      </div>
                    </button>

                    <button 
                      className="megamenu__thumb-card" 
                      onClick={() => handleShopSelect('accesorios', 'vasijas')}
                    >
                      <div className="megamenu__thumb-media">
                        <img src={vasijasImg} alt="Vasijas Cerámicas Sutra" loading="lazy" />
                        <span className="megamenu__thumb-zoom-icon">✦</span>
                      </div>
                      <div className="megamenu__thumb-body">
                        <strong>Vasijas Artesanales</strong>
                        <span>Torno a mano con barro y texturas de lava</span>
                        <em className="megamenu__thumb-tag">Artesanía de origen</em>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Columna 3: Card Destacada "Best Seller" */}
                <div className="megamenu__col megamenu__col--feature">
                  <div className="megamenu__col-header">
                    <span className="megamenu__eyebrow">MÁS VENDIDO</span>
                    <span className="megamenu__pill megamenu__pill--gold">BEST SELLER</span>
                  </div>

                  <div 
                    className="megamenu__feature-card" 
                    onClick={() => handleShopSelect('velas')}
                  >
                    <div className="megamenu__feature-media">
                      <img src={ceraNegraImg} alt="Vela de arena Negra" loading="lazy" />
                      <div className="megamenu__feature-gradient" />
                      <span className="megamenu__feature-badge">BEST SELLER</span>
                    </div>
                    <div className="megamenu__feature-content">
                      <span className="megamenu__feature-kicker">VELA DE ARENA</span>
                      <h4 className="megamenu__feature-title">Vela de arena Negra</h4>
                      <p className="megamenu__feature-desc">Cera perlada botánica negro obsidiana. Rellena cualquier vasija con flama limpia.</p>
                      <span className="megamenu__feature-action">
                        Descubrir vela de arena
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Columna 4: Card Destacada "Experiencia & Ceremonia" */}
                <div className="megamenu__col megamenu__col--feature">
                  <div className="megamenu__col-header">
                    <span className="megamenu__eyebrow">NOVEDAD</span>
                    <span className="megamenu__pill">CEREMONIA</span>
                  </div>

                  <div 
                    className="megamenu__feature-card" 
                    onClick={() => handleShopSelect('te')}
                  >
                    <div className="megamenu__feature-media">
                      <img src={teCeremonialImg} alt="Té Ceremonial Sutra" loading="lazy" />
                      <div className="megamenu__feature-gradient" />
                      <span className="megamenu__feature-badge megamenu__feature-badge--gold">NUEVO</span>
                    </div>
                    <div className="megamenu__feature-content">
                      <span className="megamenu__feature-kicker">INFUSIÓN BOTÁNICA</span>
                      <h4 className="megamenu__feature-title">Té Ceremonial en Lata</h4>
                      <p className="megamenu__feature-desc">Mezcla floral de lavanda silvestre, manzanilla y pétalos en lata hermética.</p>
                      <span className="megamenu__feature-action">
                        Ver experiencia
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra Inferior del Mega Menú */}
              <div className="megamenu__footer">
                <div className="megamenu__perks">
                  <div className="megamenu__perk">
                    <span className="megamenu__perk-dot">🌿</span>
                    <span>Cera 100% de soya vegetal</span>
                  </div>
                  <div className="megamenu__perk">
                    <span className="megamenu__perk-dot">✨</span>
                    <span>Envío sin cargo en compras +$1,500 MXN</span>
                  </div>
                  <div className="megamenu__perk">
                    <span className="megamenu__perk-dot">🕯️</span>
                    <span>Hecho a mano en México</span>
                  </div>
                </div>

                <button 
                  className="megamenu__footer-link" 
                  onClick={() => handleShopSelect('all')}
                >
                  <span>Ver todas las piezas de la colección</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </li>

          {/* Eventos */}
          <li className="navbar__item">
            <button
              className={`navbar__link ${isEvents ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/eventos')}
            >
              Eventos
            </button>
          </li>

          {/* Nosotros */}
          <li className="navbar__item">
            <button
              className={`navbar__link ${isAbout ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/nosotros')}
            >
              Nosotros
            </button>
          </li>

          {/* Comunidad (Va directo al Blog) */}
          <li className="navbar__item">
            <button
              className={`navbar__link ${isCommunity ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/comunidad')}
              title="Comunidad & Blog Sutra"
            >
              Comunidad
            </button>
          </li>

          {/* Mystery Box (Suscripción Bimestral) */}
          <li className="navbar__item">
            <button
              className={`navbar__link ${isMystery ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/mysterybox')}
              title="Sutra Mystery Box · Suscripción Bimestral"
            >
              Mystery Box
            </button>
          </li>

          {/* Contacto */}
          <li className="navbar__item">
            <button
              className={`navbar__link ${isContact ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/contacto')}
              title="Contacto & Asistencia"
            >
              Contacto
            </button>
          </li>
        </ul>

        {/* Right side actions: Usuario & Tienda/Carrito */}
        <div className="navbar__actions">
          {/* Usuario / Mi Cuenta */}
          <button 
            className="navbar__action-btn navbar__action-user" 
            onClick={onOpenUser}
            aria-label="Mi Cuenta / Usuario"
            title="Mi Cuenta"
            id="user-account-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          {/* Carrito / Bolsa */}
          <button 
            className="navbar__action-btn navbar__action-cart" 
            onClick={onOpenCart}
            aria-label={`Carrito de compras (${cartCount} artículos)`}
            title="Bolsa de Rituales"
            id="cart-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Hamburger for mobile */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            id="menu-toggle"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-menu">
        <div className="navbar__mobile-content">
          <ul className="navbar__mobile-links">
            {/* Mobile Tienda Accordion */}
            <li className="mobile-item">
              <div 
                className="mobile-item-header" 
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
              >
                <span>Tienda</span>
                <span className="mobile-chevron">{mobileShopOpen ? '−' : '+'}</span>
              </div>
              {mobileShopOpen && (
                <ul className="mobile-sublinks">
                  <li>
                    <button onClick={() => handleShopSelect('all')}>
                      Todos los productos
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleShopSelect('velas')}>
                      Velas de Arena
                    </button>
                  </li>
                  <li className="mobile-nested-wrap">
                    <div 
                      className="mobile-nested-header" 
                      onClick={() => setMobileAccOpen(!mobileAccOpen)}
                    >
                      <span>Objetos de Ritual</span>
                      <span>{mobileAccOpen ? '▾' : '▸'}</span>
                    </div>
                    {mobileAccOpen && (
                      <ul className="mobile-nested-sublinks">
                        <li><button onClick={() => handleShopSelect('accesorios', 'jardin-zen')}>Jardín Zen</button></li>
                        <li><button onClick={() => handleShopSelect('accesorios', 'cartas-rituales')}>Cartas de rituales</button></li>
                        <li><button onClick={() => handleShopSelect('accesorios', 'vasijas')}>Vasijas</button></li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <button onClick={() => handleShopSelect('aromas')}>
                      Aromas
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleShopSelect('te')}>
                      Té
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li className="mobile-item">
              <button 
                className="mobile-direct-link"
                onClick={() => handleLinkClick('/eventos')}
              >
                Eventos
              </button>
            </li>

            <li className="mobile-item">
              <button 
                className="mobile-direct-link"
                onClick={() => handleLinkClick('/nosotros')}
              >
                Nosotros
              </button>
            </li>

            <li className="mobile-item">
              <button 
                className="mobile-direct-link"
                onClick={() => handleLinkClick('/comunidad')}
              >
                Comunidad (Blog)
              </button>
            </li>

            <li className="mobile-item">
              <button 
                className="mobile-direct-link"
                onClick={() => handleLinkClick('/mysterybox')}
              >
                Mystery Box (Suscripción)
              </button>
            </li>

            <li className="mobile-item">
              <button 
                className="mobile-direct-link"
                onClick={() => handleLinkClick('/contacto')}
              >
                Contacto
              </button>
            </li>
          </ul>

          <div className="mobile-menu-footer">
            <button 
              className="mobile-user-btn" 
              onClick={() => { setMenuOpen(false); onOpenUser(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Mi Cuenta / Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
