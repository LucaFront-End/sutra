import { useState, useEffect } from 'react';
import { navLinks } from '../data/content';
import './Navbar.css';

export default function Navbar({ onNavigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // If we are NOT on home page, treat the navbar text as permanently dark
  const isLightTheme = currentPage !== 'home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''} ${isLightTheme ? 'navbar--light-theme' : ''}`}
    >
      <div className="navbar__inner container">
        <a href="#" className="navbar__brand" aria-label="Sutra México - Inicio" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <span className="navbar__logo">SUTRA</span>
        </a>

        <ul className="navbar__links" id="nav-links">
          <li>
            <a 
              href="#" 
              className="navbar__link" 
              style={currentPage === 'shop' ? { fontWeight: 600, color: '#D4A76A' } : {}} 
              onClick={(e) => { e.preventDefault(); onNavigate('shop'); setMenuOpen(false); }}
            >
              Tienda
            </a>
          </li>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="navbar__link"
                onClick={(e) => { 
                  if (link.href === '#') { e.preventDefault(); onNavigate('home'); }
                  setMenuOpen(false); 
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button className="navbar__cart" aria-label="Carrito de compras" id="cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>

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

      {/* Mobile overlay */}
      <div className="navbar__mobile-menu" id="mobile-menu">
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
