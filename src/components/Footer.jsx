import { footerContent } from '../data/content';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <span className="footer__logo">SUTRA</span>
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
                    <a href={link.href} className="footer__link">{link.label}</a>
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
