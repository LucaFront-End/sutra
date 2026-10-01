import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogArticles } from '../data/shopData';
import './Blog.css';

export default function Blog({ onNavigate }) {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tags = ['all', 'Filosofía Sutra', 'Rituales', 'Bienestar Sensorial', 'Mindfulness'];

  const filteredArticles = selectedTag === 'all' 
    ? blogArticles 
    : blogArticles.filter(art => art.category === selectedTag);

  return (
    <div className="blog-page fade-in">
      {/* Header */}
      <header className="blog-header">
        <span className="blog-eyebrow">Comunidad & Diario Consciente</span>
        <h1 className="blog-title">El Journal de Sutra</h1>
        <p className="blog-description">
          Reflexiones, guías olfativas y rituales ancestrales para desacelerar y habitar tu tiempo con intención.
        </p>

        {/* Tags */}
        <div className="blog-tags">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`blog-tag-btn ${selectedTag === tag ? 'is-active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'all' ? 'Todas las publicaciones' : tag}
            </button>
          ))}
        </div>
      </header>

      {/* Articles Grid */}
      <div className="blog-container container">
        <div className="blog-grid">
          {filteredArticles.map((article) => (
            <article 
              key={article.id} 
              className="blog-card"
              onClick={() => navigate(`/blog/${article.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="blog-card-img-wrap">
                <img src={article.image} alt={article.title} />
                <span className="blog-card-cat">{article.category}</span>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span>{article.date}</span>
                  <span className="meta-dot">·</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <div className="blog-card-read-more">
                  <span>Leer publicación</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Community Newsletter Box */}
        <section className="blog-community-box">
          <div className="community-box-content">
            <span className="community-tag">Círculo Sutra</span>
            <h3>Únete a las lecturas semanales</h3>
            <p>Cada domingo enviamos una pequeña reflexión para iniciar la semana con serenidad y foco.</p>
            <form className="community-form" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por unirte al Círculo Sutra!'); }}>
              <input type="email" placeholder="Tu correo electrónico" required />
              <button type="submit">Suscribirme</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
