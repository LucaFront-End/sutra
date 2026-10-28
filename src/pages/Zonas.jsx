import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getLandingsHub, POPULAR_STATES } from '../lib/landingService';
import SEO from '../components/SEO';
import './Zonas.css';

export default function Zonas({ onNavigate }) {
  const navigate = useNavigate();

  const [hubType, setHubType] = useState('ciudades'); // 'ciudades' | 'tiendas'
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('Todos');

  const pageSize = 24;
  const searchTimeoutRef = useRef(null);

  // Fetch landings from Supabase dynamically
  const fetchLandings = async (page = 0, searchTerm = search, state = selectedState, type = hubType) => {
    setLoading(true);
    try {
      const res = await getLandingsHub({
        page,
        pageSize,
        search: searchTerm,
        estado: state,
        type,
      });

      if (res) {
        setLandings(res.landings || []);
        setTotalCount(res.totalCount || 0);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 0);
      }
    } catch (err) {
      console.error('[Zonas] Error al cargar landings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchLandings(0, search, selectedState, hubType);
  }, [selectedState, hubType]);

  const handleHubTypeChange = (type) => {
    if (type === hubType) return;
    setHubType(type);
    setCurrentPage(0);
  };

  // Debounced search handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(0);
      fetchLandings(0, val, selectedState, hubType);
    }, 350);
  };

  const handleClearSearch = () => {
    setSearch('');
    setCurrentPage(0);
    fetchLandings(0, '', selectedState, hubType);
  };

  const handleStateClick = (state) => {
    setSelectedState(state);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setCurrentPage(newPage);
    fetchLandings(newPage, search, selectedState, hubType);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCardClick = (slug, prefix) => {
    const targetPrefix = prefix || (hubType === 'tiendas' ? 'tiendas' : 'ciudades');
    if (onNavigate) {
      onNavigate(targetPrefix === 'tiendas' ? 'dynamicTienda' : 'dynamicLanding', { slug });
    }
    navigate(`/${targetPrefix}/${slug}`);
  };

  // Generate pagination numbers
  const getPaginationPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="zonas-page fade-in">
      <SEO
        title={hubType === 'tiendas' ? 'Tiendas Oficiales de Velas de Arena en México | Sutra' : 'Zonas y Cobertura de Velas de Arena en México | Sutra'}
        description={hubType === 'tiendas' ? 'Encuentra las tiendas oficiales y puntos de distribución de velas de arena Sutra en México. Aromas botánicos, cera vegetal y recipientes artesanales.' : 'Explora todos los santuarios, ciudades y zonas de cobertura de Sutra en México. Velas de arena artesanales, esencias botánicas y cajas de ritual con envío a todo el país.'}
        canonical="https://sutramexico.com/zonas"
      />

      {/* Hero Header */}
      <header className="zonas-hero">
        <div className="container">
          <nav className="zonas-breadcrumbs" aria-label="Miga de pan">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {hubType === 'tiendas' ? 'Tiendas Oficiales' : 'Zonas & Cobertura'}
            </span>
          </nav>

          <span className="zonas-hero__tag">
            {hubType === 'tiendas' ? '✧ TIENDAS OFICIALES SUTRA' : '✧ COBERTURA NACIONAL SUTRA'}
          </span>
          <h1 className="zonas-hero__title">
            {hubType === 'tiendas' ? 'Tiendas Oficiales Sutra' : 'Zonas & Santuarios Sutra'}
          </h1>
          <p className="zonas-hero__subtitle">
            {hubType === 'tiendas' 
              ? 'Conoce nuestras tiendas oficiales y puntos exclusivos en cada estado de México con envíos directos de velas de arena y rituales.'
              : 'Cada rincón de México donde nuestras velas de arena vegetal, aromas botánicos y rituales conscientes transforman cualquier espacio en un refugio de presencia y quietud.'}
          </p>

          {/* Quick Metrics */}
          <div className="zonas-metrics">
            <div className="zonas-metric-card">
              <span className="metric-num">
                {totalCount > 0 ? totalCount.toLocaleString('es-MX') : '13,000+'}
              </span>
              <span className="metric-label">
                {hubType === 'tiendas' ? 'Tiendas Oficiales' : 'Zonas y Ciudades'}
              </span>
            </div>
            <div className="zonas-metric-divider" />
            <div className="zonas-metric-card">
              <span className="metric-num">32</span>
              <span className="metric-label">Estados de la República</span>
            </div>
            <div className="zonas-metric-divider" />
            <div className="zonas-metric-card">
              <span className="metric-num">100%</span>
              <span className="metric-label">Cera Vegetal & Envío Seguro</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content & Controls */}
      <section className="zonas-content">
        <div className="container">
          {/* Hub Type Selector Tabs */}
          <div className="zonas-hub-tabs" role="tablist" aria-label="Tipo de catálogo">
            <button
              type="button"
              role="tab"
              aria-selected={hubType === 'ciudades'}
              className={`hub-tab ${hubType === 'ciudades' ? 'hub-tab--active' : ''}`}
              onClick={() => handleHubTypeChange('ciudades')}
            >
              <span className="hub-tab-icon">🏙️</span>
              <span className="hub-tab-label">Santuarios por Ciudad</span>
              <span className="hub-tab-tag">/ciudades</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={hubType === 'tiendas'}
              className={`hub-tab ${hubType === 'tiendas' ? 'hub-tab--active' : ''}`}
              onClick={() => handleHubTypeChange('tiendas')}
            >
              <span className="hub-tab-icon">🏷️</span>
              <span className="hub-tab-label">Tiendas Oficiales</span>
              <span className="hub-tab-tag">/tiendas</span>
            </button>
          </div>

          {/* Search & State Filter Controls */}
          <div className="zonas-controls">
            <div className="zonas-search-box">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="zonas-search-input"
                placeholder={hubType === 'tiendas' 
                  ? 'Buscar tienda oficial por ciudad o estado (ej. Aguascalientes, Guadalajara, Puebla...)' 
                  : 'Buscar por ciudad, municipio o estado (ej. Polanco, Zapopan, San Pedro, Puebla, Mérida...)'}
                value={search}
                onChange={handleSearchChange}
                aria-label="Buscar zona o tienda"
              />
              {search && (
                <button
                  type="button"
                  className="zonas-search-clear"
                  onClick={handleClearSearch}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            {/* State filter pills */}
            <div className="zonas-states-pills" role="tablist" aria-label="Filtrar por estado">
              {POPULAR_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  role="tab"
                  aria-selected={selectedState === state}
                  className={`state-pill ${selectedState === state ? 'state-pill--active' : ''}`}
                  onClick={() => handleStateClick(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="zonas-results-header">
            <span className="results-count">
              {loading ? (
                'Cargando resultados...'
              ) : (
                <>
                  Mostrando <strong>{landings.length}</strong> de{' '}
                  <strong>{totalCount.toLocaleString('es-MX')}</strong>{' '}
                  {hubType === 'tiendas' ? 'tiendas oficiales' : 'zonas'}{' '}
                  {selectedState !== 'Todos' && `en ${selectedState}`}
                  {search && ` para "${search}"`}
                </>
              )}
            </span>

            {totalPages > 1 && (
              <span className="results-page-indicator">
                Página {currentPage + 1} de {totalPages}
              </span>
            )}
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="zonas-grid zonas-grid--loading">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="zona-card-skeleton">
                  <div className="skeleton-badge shimmer" />
                  <div className="skeleton-title shimmer" />
                  <div className="skeleton-desc shimmer" />
                  <div className="skeleton-btn shimmer" />
                </div>
              ))}
            </div>
          ) : landings.length > 0 ? (
            <div className="zonas-grid">
              {landings.map((landing, idx) => {
                const isTiendaItem = landing.isTienda || hubType === 'tiendas';
                const targetPrefix = landing.routePrefix || (isTiendaItem ? 'tiendas' : 'ciudades');
                const targetPath = `/${targetPrefix}/${landing.slug}`;

                return (
                  <Link
                    key={`${landing.slug || landing.id}-${idx}`}
                    to={targetPath}
                    className="zona-card"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate(isTiendaItem ? 'dynamicTienda' : 'dynamicLanding', { slug: landing.slug });
                        navigate(targetPath);
                      }
                    }}
                  >
                    <div className="zona-card__top">
                      <span className="zona-card__location-badge">
                        <span className="pin-icon">📍</span>
                        {landing.ciudad ? `${landing.ciudad}, ` : ''}{landing.estado || 'México'}
                      </span>
                      <span className="zona-card__tag">
                        {isTiendaItem ? '✧ TIENDA OFICIAL' : (landing.fraseBusqueda ? `✧ ${landing.fraseBusqueda}` : '✧ SANTUARIO')}
                      </span>
                    </div>

                    <h3 className="zona-card__title">
                      {landing.tituloPagina || landing.titulo || (isTiendaItem ? `Tienda oficial en ${landing.ciudad}` : `Velas de arena en ${landing.ciudad}`)}
                    </h3>

                    <p className="zona-card__excerpt">
                      {landing.excerpt}
                    </p>

                    <div className="zona-card__footer">
                      <span className="zona-card__link">
                        {isTiendaItem ? 'Ver Tienda Oficial' : 'Visitar Santuario'} <span className="arrow">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="zonas-empty">
              <span className="zonas-empty__icon">🕯️</span>
              <h3 className="zonas-empty__title">
                {hubType === 'tiendas' ? 'No se encontraron tiendas coincidentes' : 'No se encontraron zonas coincidentes'}
              </h3>
              <p className="zonas-empty__desc">
                Intenta con otra ciudad, código postal o selecciona "Todos" en los filtros de estado.
              </p>
              <button
                type="button"
                className="zonas-empty__btn"
                onClick={() => {
                  setSearch('');
                  setSelectedState('Todos');
                  setCurrentPage(0);
                  fetchLandings(0, '', 'Todos', hubType);
                }}
              >
                {hubType === 'tiendas' ? 'Ver todas las tiendas' : 'Ver todas las zonas'}
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <nav className="zonas-pagination" aria-label="Paginación de zonas">
              <button
                type="button"
                className="pagination-btn pagination-prev"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>

              <div className="pagination-numbers">
                {currentPage > 2 && (
                  <>
                    <button
                      type="button"
                      className="pagination-num"
                      onClick={() => handlePageChange(0)}
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="pagination-dots">...</span>}
                  </>
                )}

                {getPaginationPages().map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-num ${currentPage === pageNum ? 'pagination-num--active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                {currentPage < totalPages - 3 && (
                  <>
                    {currentPage < totalPages - 4 && <span className="pagination-dots">...</span>}
                    <button
                      type="button"
                      className="pagination-num"
                      onClick={() => handlePageChange(totalPages - 1)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                className="pagination-btn pagination-next"
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Página siguiente"
              >
                Siguiente →
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
