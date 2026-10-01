import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoDark from '../assets/logo/LOGO-07.png';
import logoLight from '../assets/logo/LOGO-08.png';
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

  const currentPath = location.pathname;
  const isHome = currentPath === '/';
  const isShop = currentPath.startsWith('/tienda') || currentPath.startsWith('/producto');
  const isEvents = currentPath.startsWith('/eventos');
  const isAbout = currentPath.startsWith('/nosotros');
  const isCommunity = currentPath.startsWith('/comunidad') || currentPath.startsWith('/blog');

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
          {/* Tienda with rich dropdown */}
          <li 
            className={`navbar__item navbar__item--has-dropdown ${dropdownOpen ? 'is-active' : ''}`}
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
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

            {/* Dropdown Menu */}
            <div className={`navbar__dropdown ${dropdownOpen ? 'navbar__dropdown--visible' : ''}`}>
              <div className="dropdown__section">
                <button 
                  className="dropdown__item dropdown__item--primary" 
                  onClick={() => handleShopSelect('all')}
                >
                  <span className="dropdown__bullet">✦</span>
                  <div className="dropdown__item-text">
                    <strong>Todos los productos</strong>
                    <small>Explora el catálogo completo de bienestar</small>
                  </div>
                </button>

                <div className="dropdown__divider" />

                <button 
                  className="dropdown__item" 
                  onClick={() => handleShopSelect('velas')}
                >
                  Velas
                </button>

                {/* Accesorios Group with subitems */}
                <div className="dropdown__group">
                  <button 
                    className="dropdown__group-title" 
                    onClick={() => handleShopSelect('accesorios')}
                  >
                    <span>Accesorios</span>
                    <span className="group-badge">Ver todos</span>
                  </button>
                  <div className="dropdown__sublist">
                    <button 
                      className="dropdown__subitem" 
                      onClick={() => handleShopSelect('accesorios', 'jardin-zen')}
                    >
                      • Jardín Zen
                    </button>
                    <button 
                      className="dropdown__subitem" 
                      onClick={() => handleShopSelect('accesorios', 'cartas-rituales')}
                    >
                      • Cartas de rituales
                    </button>
                    <button 
                      className="dropdown__subitem" 
                      onClick={() => handleShopSelect('accesorios', 'vasijas')}
                    >
                      • Vasijas
                    </button>
                  </div>
                </div>

                <div className="dropdown__divider" />

                <button 
                  className="dropdown__item" 
                  onClick={() => handleShopSelect('aromas')}
                >
                  Aromas
                </button>

                <button 
                  className="dropdown__item" 
                  onClick={() => handleShopSelect('te')}
                >
                  Té
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
                      Velas
                    </button>
                  </li>
                  <li className="mobile-nested-wrap">
                    <div 
                      className="mobile-nested-header" 
                      onClick={() => setMobileAccOpen(!mobileAccOpen)}
                    >
                      <span>Accesorios</span>
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
