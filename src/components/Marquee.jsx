import { marqueePhrases } from '../data/content';
import './Marquee.css';

export default function Marquee() {
  const items = [...marqueePhrases, ...marqueePhrases];

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
