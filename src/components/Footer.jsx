import { useNavigate } from 'react-router-dom';
import { footerContent } from '../data/content';
import logoLight from '../assets/logo/LOGO-08.png';
import './Footer.css';

export default function Footer({ onNavigate }) {
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    
    if (link.label === 'Journal' || link.label === 'Comunidad') {
      if (onNavigate) onNavigate('blog');
      navigate('/comunidad');
    } else if (link.label === 'Nosotros') {
      if (onNavigate) onNavigate('about');
      navigate('/nosotros');
    } else if (link.label === 'Eventos') {
      if (onNavigate) onNavigate('events');
      navigate('/eventos');
    } else if (['Ritual Zen', 'Velas', 'Aromas', 'Tés', 'Bundles'].includes(link.label)) {
      const catMap = {
        'Ritual Zen': '/tienda/accesorios/jardin-zen',
        'Velas': '/tienda/velas',
        'Aromas': '/tienda/aromas',
        'Tés': '/tienda/te',
        'Bundles': '/tienda',
      };
      const path = catMap[link.label] || '/tienda';
      if (onNavigate) onNavigate('shop');
      navigate(path);
    } else {
      if (onNavigate) onNavigate('home');
      navigate('/');
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <a 
              href="/" 
              className="footer__brand-link" 
              aria-label="Sutra México - Inicio"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
                navigate('/');
              }}
            >
              <img 
                src={logoLight} 
                alt="Sutra México" 
                className="footer__logo-img" 
              />
            </a>
            <p className="footer__tagline">{footerContent.tagline}</p>
            <div className="footer__social">
              {footerContent.social.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={s.label}
                  id={`social-${s.icon}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {footerContent.columns.map((col) => (
            <div key={col.title} className="footer__col">
              <h4 className="footer__col-title">{col.title}</h4>
              <ul className="footer__col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="footer__link"
                      onClick={(e) => handleLinkClick(e, link)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">{footerContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
