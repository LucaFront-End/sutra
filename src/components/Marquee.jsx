import { marqueePhrases } from '../data/content';
import './Marquee.css';

export default function Marquee({ landing = null }) {
  const dynamicPhrases = landing?.ciudad
    ? [
        `Velas de arena en ${landing.ciudad}`,
        landing.fraseBusqueda || `Rituales de calma en ${landing.ciudad}`,
        ...marqueePhrases
      ]
    : marqueePhrases;

  const items = [...dynamicPhrases, ...dynamicPhrases];

  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((phrase, i) => (
          <div className="marquee-item" key={i}>
            <span>{phrase}</span>
            <span className="marquee-sep">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
