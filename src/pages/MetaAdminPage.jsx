import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AUTHORIZED_META_ADMIN_EMAIL,
  DEFAULT_TRACKING_CONFIG,
  completeWixAdminOAuthIfPresent,
  fetchPublicTrackingConfig,
  loginStrictMetaAdmin,
  logoutMetaAdmin,
  normalizeTrackingConfig,
  normalizeTrackingEmail,
  saveTrackingConfig,
  sendWixAdminPasswordReset,
  startWixAdminOAuthLogin,
  verifyMetaAdminSession,
} from '../services/trackingService';
import './MetaAdminPage.css';

function hasUnbalancedScriptTags(code) {
  const text = String(code || '');
  if (!text.trim()) return false;
  const openCount = (text.match(/<script\b/gi) || []).length;
  const closeCount = (text.match(/<\/script>/gi) || []).length;
  return openCount !== closeCount;
}

function extractPixelIdFromSnippet(snippet) {
  const text = String(snippet || '');
  const initMatch = text.match(/fbq\(\s*['"]init['"]\s*,\s*['"](\d{8,24})['"]/i);
  if (initMatch?.[1]) return initMatch[1];
  const imgMatch = text.match(/facebook\.com\/tr\?id=(\d{8,24})/i);
  if (imgMatch?.[1]) return imgMatch[1];
  return '';
}

function ToggleSwitch({ checked, onChange, label, description, id }) {
  return (
    <label htmlFor={id} className={`meta-admin-toggle ${checked ? 'is-checked' : ''}`}>
      <div>
        <div className="meta-admin-toggle-title">{label}</div>
        {description && <div className="meta-admin-toggle-desc">{description}</div>}
      </div>
      <div className="meta-admin-switch-wrap">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span aria-hidden="true" className="meta-admin-switch-track">
          <span className="meta-admin-switch-knob" />
        </span>
      </div>
    </label>
  );
}

export default function MetaAdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [session, setSession] = useState({
    authorized: false,
    status: 'unauthenticated',
    email: '',
    member: null,
    message: '',
  });

  const [emailInput, setEmailInput] = useState(AUTHORIZED_META_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState(null);

  const [config, setConfig] = useState({ ...DEFAULT_TRACKING_CONFIG });
  const [configSource, setConfigSource] = useState('cargando');
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);
  const [copiedFeedKey, setCopiedFeedKey] = useState('');

  // Ensure admin page uses private title & noindex
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Administrador Meta Pixel y Código Global | Sutra México';
    const robotsEl = document.querySelector('meta[name="robots"]');
    const prevRobots = robotsEl?.getAttribute('content') || 'index, follow';
    if (robotsEl) robotsEl.setAttribute('content', 'noindex, nofollow');
    return () => {
      document.title = prevTitle;
      if (robotsEl) robotsEl.setAttribute('content', prevRobots);
    };
  }, []);

  const handleCopyFeedUrl = async (key, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedFeedKey(key);
      setTimeout(() => setCopiedFeedKey((prev) => (prev === key ? '' : prev)), 2200);
    } catch {
      // ignore clipboard errors
    }
  };

  const loadConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const res = await fetchPublicTrackingConfig();
      if (res?.config) {
        setConfig(normalizeTrackingConfig(res.config));
        setConfigSource(res.source || 'wix-cms');
      }
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  const refreshAuthAndConfig = useCallback(async () => {
    setCheckingSession(true);
    try {
      await completeWixAdminOAuthIfPresent();
      const verified = await verifyMetaAdminSession();
      setSession(verified);
      if (verified.authorized) {
        await loadConfig();
      }
    } finally {
      setCheckingSession(false);
    }
  }, [loadConfig]);

  useEffect(() => {
    refreshAuthAndConfig();
  }, [refreshAuthAndConfig]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthFeedback(null);
    setAuthLoading(true);
    try {
      const result = await loginStrictMetaAdmin({
        email: emailInput,
        password: passwordInput,
      });

      if (!result.success) {
        setAuthFeedback({
          type: 'error',
          text: result.message || 'No fue posible iniciar sesión.',
        });
        return;
      }

      setPasswordInput('');
      await refreshAuthAndConfig();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    setAuthFeedback(null);
    setOauthLoading(true);
    try {
      const res = await startWixAdminOAuthLogin('/admin-meta');
      if (!res?.success) {
        setOauthLoading(false);
        setAuthFeedback({
          type: 'info',
          text: 'No se pudo iniciar la redirección hacia Wix Login. Usa tu contraseña de acceso.',
        });
      }
    } catch {
      setOauthLoading(false);
      setAuthFeedback({
        type: 'error',
        text: 'Error al iniciar la redirección de Wix OAuth.',
      });
    }
  };

  const handlePasswordReset = async () => {
    const clean = normalizeTrackingEmail(emailInput || AUTHORIZED_META_ADMIN_EMAIL);
    if (clean !== AUTHORIZED_META_ADMIN_EMAIL) {
      setAuthFeedback({
        type: 'error',
        text: `El restablecimiento en esta sección solo está permitido para ${AUTHORIZED_META_ADMIN_EMAIL}.`,
      });
      return;
    }
    setAuthLoading(true);
    try {
      const res = await sendWixAdminPasswordReset(AUTHORIZED_META_ADMIN_EMAIL);
      setAuthFeedback({
        type: res.success ? 'success' : 'info',
        text: res.message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutMetaAdmin();
    setSession({
      authorized: false,
      status: 'unauthenticated',
      email: '',
      member: null,
      message: `Sesión cerrada. Ingresa con ${AUTHORIZED_META_ADMIN_EMAIL}.`,
    });
    setAuthFeedback(null);
    setSaveFeedback(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveFeedback(null);
    setSaving(true);
    try {
      const result = await saveTrackingConfig(config);
      if (!result.success) {
        setSaveFeedback({
          type: 'error',
          text: result.message || 'No se pudo guardar la configuración.',
        });
        if (result.status === 401 || result.status === 403) {
          await refreshAuthAndConfig();
        }
        return;
      }

      if (result.config) {
        setConfig(normalizeTrackingConfig(result.config));
        setConfigSource('wix-cms');
      }
      setSaveFeedback({
        type: 'success',
        text: 'Configuración publicada en Wix CMS (ConfiguracionMeta) y aplicada globalmente en todo el sitio.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAutoExtractPixelId = () => {
    const found =
      extractPixelIdFromSnippet(config.metaCustomCode) ||
      extractPixelIdFromSnippet(config.customHeadCode);
    if (!found) {
      setSaveFeedback({
        type: 'info',
        text: "No se detectó un ID numérico de Pixel (fbq('init', '...')) en los snippets actuales.",
      });
      return;
    }
    setConfig((prev) => ({
      ...prev,
      metaPixelId: found,
      metaEnabled: true,
    }));
    setSaveFeedback({
      type: 'success',
      text: `Pixel ID detectado y cargado: ${found}. Presiona "Guardar y Publicar Globalmente" para aplicarlo.`,
    });
  };

  const handleTestPageView = () => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
      setSaveFeedback({
        type: 'info',
        text: 'window.fbq aún no está activo. Activa Meta Pixel con tu Pixel ID y guarda primero.',
      });
      return;
    }
    window.fbq('track', 'PageView');
    setSaveFeedback({
      type: 'success',
      text: `Evento de prueba fbq('track', 'PageView') enviado correctamente (Pixel ${config.metaPixelId || 'activo'}).`,
    });
  };

  const scriptWarnings = useMemo(() => {
    const warnings = [];
    if (hasUnbalancedScriptTags(config.metaCustomCode)) {
      warnings.push('El bloque de código adicional de Meta tiene etiquetas <script> sin cerrar.');
    }
    if (hasUnbalancedScriptTags(config.customHeadCode)) {
      warnings.push('El bloque de código para <head> tiene etiquetas <script> sin cerrar.');
    }
    if (hasUnbalancedScriptTags(config.customBodyCode)) {
      warnings.push('El bloque de código para <body> tiene etiquetas <script> sin cerrar.');
    }
    return warnings;
  }, [config.metaCustomCode, config.customHeadCode, config.customBodyCode]);

  const fbqLive = typeof window !== 'undefined' && typeof window.fbq === 'function';
  const siteOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.sutramexico.com';

  return (
    <div className="meta-admin-page">
      <div className="meta-admin-container">
        {/* Top Bar */}
        <div className="meta-admin-topbar">
          <Link to="/" className="meta-admin-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a Sutra México
          </Link>

          <div className="meta-admin-lock-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Acceso exclusivo: {AUTHORIZED_META_ADMIN_EMAIL}
          </div>
        </div>

        {/* Hero Card */}
        <div className="meta-admin-hero">
          <div className="meta-admin-hero-inner">
            <div>
              <span className="meta-admin-eyebrow">
                ✦ Consola Wix Partner · Meta &amp; Tracking Global
              </span>
              <h1>Administrador de Meta Pixel y Código Global</h1>
              <p>
                Administra tu Pixel de Facebook (Meta), eventos de eCommerce y scripts
                personalizados de <code>&lt;head&gt;</code> o <code>&lt;body&gt;</code>{' '}
                sincronizados en Wix CMS para todo el sitio.
              </p>
            </div>

            {session.authorized && session.member && (
              <div className="meta-admin-session-box">
                <div className="meta-admin-session-label">SESIÓN AUTORIZADA</div>
                <div className="meta-admin-session-name">{session.member.name}</div>
                <div className="meta-admin-session-email">{session.member.email}</div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="meta-admin-logout-btn"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {checkingSession && (
          <div className="meta-admin-loading">
            Verificando rol autorizado en Wix Partner...
          </div>
        )}

        {/* Auth Gate */}
        {!checkingSession && !session.authorized && (
          <div className="meta-admin-auth-card">
            {session.status === 'forbidden' ? (
              <div className="meta-admin-forbidden">
                <div className="meta-admin-forbidden-title">
                  ⚠ Acceso Denegado · Rol No Autorizado
                </div>
                <p>
                  La sesión actual ({session.email || 'otra cuenta'}) no corresponde al rol
                  autorizado en Wix. Solo <strong>{AUTHORIZED_META_ADMIN_EMAIL}</strong> puede
                  modificar el código de Meta y scripts globales.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="meta-admin-submit-btn"
                >
                  Cerrar sesión actual e ingresar con Wix Partner
                </button>
              </div>
            ) : (
              <div>
                <div className="meta-admin-auth-badge">
                  ✦ Autenticación Wix Requerida
                </div>
                <h2 className="meta-admin-auth-title">
                  Inicia sesión con tu cuenta de Wix Partner
                </h2>
                <p className="meta-admin-auth-desc">
                  Ingresa las credenciales autorizadas asociadas a{' '}
                  <strong>{AUTHORIZED_META_ADMIN_EMAIL}</strong>.
                </p>
              </div>
            )}

            {authFeedback && (
              <div className={`meta-admin-alert meta-admin-alert--${authFeedback.type}`}>
                <span>{authFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="meta-admin-form">
              <div>
                <label htmlFor="meta-admin-email" className="meta-admin-label">
                  Usuario / Correo autorizado en Wix
                </label>
                <input
                  id="meta-admin-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={AUTHORIZED_META_ADMIN_EMAIL}
                  className="meta-admin-input"
                />
              </div>

              <div>
                <label htmlFor="meta-admin-password" className="meta-admin-label">
                  Contraseña de acceso
                </label>
                <div className="meta-admin-password-wrap">
                  <input
                    id="meta-admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="meta-admin-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    className="meta-admin-eye-btn"
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="meta-admin-submit-btn"
              >
                {authLoading ? 'Verificando acceso en Wix...' : 'Entrar al Administrador'}
              </button>
            </form>

            <div className="meta-admin-divider">
              <span />o acceso con Wix OAuth<span />
            </div>

            <button
              type="button"
              onClick={handleOAuthLogin}
              disabled={oauthLoading}
              className="meta-admin-oauth-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {oauthLoading ? 'Redirigiendo a Wix...' : 'Continuar con Google (Wix)'}
            </button>

            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={authLoading}
              className="meta-admin-reset-btn"
            >
              ¿Primera vez con contraseña o la olvidaste? Enviar enlace a {AUTHORIZED_META_ADMIN_EMAIL}
            </button>
          </div>
        )}

        {/* Authorized Editor Console */}
        {!checkingSession && session.authorized && (
          <form onSubmit={handleSave} className="meta-admin-console">
            {/* Status Cards */}
            <div className="meta-admin-status-grid">
              <div className="meta-admin-stat-card">
                <div className="meta-admin-stat-label">Estado Meta Pixel</div>
                <div
                  className={`meta-admin-stat-val ${
                    config.metaEnabled && config.metaPixelId ? 'is-active' : 'is-muted'
                  }`}
                >
                  ●{' '}
                  {config.metaEnabled && config.metaPixelId
                    ? `Activo (${config.metaPixelId})`
                    : 'Desactivado'}
                </div>
              </div>

              <div className="meta-admin-stat-card">
                <div className="meta-admin-stat-label">SDK Meta en Navegador (fbq)</div>
                <div className={`meta-admin-stat-val ${fbqLive ? 'is-active' : 'is-muted'}`}>
                  {fbqLive ? '✓ Cargado y escuchando rutas' : 'En espera de activación'}
                </div>
              </div>

              <div className="meta-admin-stat-card">
                <div className="meta-admin-stat-label">Sincronización Wix CMS</div>
                <div className="meta-admin-stat-val">
                  {config.updatedAt
                    ? `Actualizado: ${new Date(config.updatedAt).toLocaleString('es-MX')}`
                    : `Colección ConfiguracionMeta (${configSource})`}
                </div>
              </div>
            </div>

            {saveFeedback && (
              <div className={`meta-admin-alert meta-admin-alert--${saveFeedback.type}`}>
                <span>{saveFeedback.text}</span>
              </div>
            )}

            {scriptWarnings.length > 0 && (
              <div className="meta-admin-warning-box">
                <strong>Revisión de sintaxis:</strong> {scriptWarnings.join(' ')}
              </div>
            )}

            {/* Section 1: Meta Pixel */}
            <section className="meta-admin-card">
              <div className="meta-admin-card-header">
                <div>
                  <h2 className="meta-admin-card-title">1. Meta Pixel (Facebook Ads)</h2>
                  <p className="meta-admin-card-sub">
                    Activa tu Pixel ID oficial con seguimiento automático de <code>PageView</code> en
                    cada navegación de Sutra México.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoExtractPixelId}
                  className="meta-admin-secondary-btn"
                >
                  ✦ Extraer ID de snippet pegado
                </button>
              </div>

              <ToggleSwitch
                id="toggle-meta-enabled"
                checked={config.metaEnabled}
                onChange={(val) => setConfig((prev) => ({ ...prev, metaEnabled: val }))}
                label="Activar Meta Pixel en todo el sitio"
                description="Inyecta fbevents.js, inicializa tu Pixel ID y registra PageView + eventos de tienda."
              />

              <div>
                <label htmlFor="meta-pixel-id" className="meta-admin-label">
                  Meta Pixel ID (solo dígitos)
                </label>
                <input
                  id="meta-pixel-id"
                  type="text"
                  inputMode="numeric"
                  value={config.metaPixelId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      metaPixelId: e.target.value.replace(/\D/g, '').slice(0, 24),
                    }))
                  }
                  placeholder="Ej. 123456789012345"
                  className="meta-admin-input meta-admin-input--mono"
                />
              </div>

              {config.metaPixelId && (
                <div className="meta-admin-preview-box">
                  <div className="meta-admin-preview-comment">
                    // Vista previa automática al activar:
                  </div>
                  <div>{`fbq('init', '${config.metaPixelId}');`}</div>
                  <div>{`fbq('track', 'PageView');`}</div>
                </div>
              )}

              <div>
                <label htmlFor="meta-custom-code" className="meta-admin-label">
                  Código adicional de Meta (verificación de dominio, eventos o snippet completo)
                </label>
                <textarea
                  id="meta-custom-code"
                  rows={5}
                  value={config.metaCustomCode}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, metaCustomCode: e.target.value }))
                  }
                  placeholder={
                    '<!-- Ejemplo: <meta name="facebook-domain-verification" content="..." /> o eventos personalizados fbq(...) -->'
                  }
                  className="meta-admin-textarea meta-admin-textarea--mono"
                />
              </div>
            </section>

            {/* Section 2: Custom Head & Body Scripts */}
            <section className="meta-admin-card">
              <div>
                <h2 className="meta-admin-card-title">
                  2. Código Personalizado Global (&lt;head&gt; y &lt;body&gt;)
                </h2>
                <p className="meta-admin-card-sub">
                  Agrega etiquetas de Google Tag Manager, Google Analytics 4, TikTok Pixel,
                  verificación de dominio o scripts adicionales en todo el sitio.
                </p>
              </div>

              <ToggleSwitch
                id="toggle-custom-enabled"
                checked={config.customEnabled}
                onChange={(val) => setConfig((prev) => ({ ...prev, customEnabled: val }))}
                label="Activar código personalizado en todo el sitio"
                description="Ejecuta los bloques de <head> y <body> para todos los visitantes."
              />

              <div>
                <label htmlFor="custom-head-code" className="meta-admin-label">
                  Scripts / Etiquetas en &lt;head&gt;
                </label>
                <textarea
                  id="custom-head-code"
                  rows={6}
                  value={config.customHeadCode}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, customHeadCode: e.target.value }))
                  }
                  placeholder={
                    '<!-- Pega aquí tu código <script>...</script> o <meta ...> para el <head> -->'
                  }
                  className="meta-admin-textarea meta-admin-textarea--mono"
                />
              </div>

              <div>
                <label htmlFor="custom-body-code" className="meta-admin-label">
                  Scripts / Noscript en &lt;body&gt;
                </label>
                <textarea
                  id="custom-body-code"
                  rows={5}
                  value={config.customBodyCode}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, customBodyCode: e.target.value }))
                  }
                  placeholder={
                    '<!-- Pega aquí tu <noscript>...</noscript> o <script>...</script> para el <body> -->'
                  }
                  className="meta-admin-textarea meta-admin-textarea--mono"
                />
              </div>
            </section>

            {/* Section 3: Native E-Commerce Events */}
            <section className="meta-admin-card">
              <div>
                <h2 className="meta-admin-card-title">
                  3. Eventos eCommerce Conectados al Catálogo (Pixel + DataLayer GTM)
                </h2>
                <p className="meta-admin-card-sub">
                  Cada evento dispara automáticamente con el <code>item_id</code> /{' '}
                  <code>content_ids</code> idéntico al UUID de Wix (<code>id</code> en tus feeds).
                </p>
              </div>

              <div className="meta-admin-events-grid">
                <div className="meta-admin-event-pill">
                  <div className="meta-admin-event-name">PageView</div>
                  <div className="meta-admin-event-desc">
                    Disparo automático en cada cambio de ruta y recarga.
                  </div>
                </div>
                <div className="meta-admin-event-pill">
                  <div className="meta-admin-event-name">ViewContent / view_item</div>
                  <div className="meta-admin-event-desc">
                    Al abrir cualquier ficha <code>/producto/:slug</code> con precio e ID real.
                  </div>
                </div>
                <div className="meta-admin-event-pill">
                  <div className="meta-admin-event-name">AddToCart / add_to_cart</div>
                  <div className="meta-admin-event-desc">
                    Al agregar velas, esencias, tés o Mystery Box a la bolsa.
                  </div>
                </div>
                <div className="meta-admin-event-pill">
                  <div className="meta-admin-event-name">InitiateCheckout / begin_checkout</div>
                  <div className="meta-admin-event-desc">
                    Al pulsar «Proceder al Pago Seguro» hacia Wix Checkout.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Dynamic Catalog Feeds */}
            <section className="meta-admin-card">
              <div>
                <h2 className="meta-admin-card-title">
                  4. Feeds de Catálogo Dinámicos (Meta Commerce y Google Merchant)
                </h2>
                <p className="meta-admin-card-sub">
                  Sincronizados en tiempo real con Wix Stores. El campo <code>id</code> /{' '}
                  <code>g:id</code> coincide 1:1 con <code>item_id</code> en{' '}
                  <code>window.dataLayer</code> y <code>content_ids</code> en Meta Pixel.
                </p>
              </div>

              {[
                {
                  key: 'meta-xml',
                  label: 'Meta Commerce Manager (Feed XML)',
                  url: `${siteOrigin}/meta-catalog-feed.xml`,
                },
                {
                  key: 'meta-csv',
                  label: 'Meta Commerce Manager (Feed CSV)',
                  url: `${siteOrigin}/meta-catalog-feed.csv`,
                },
                {
                  key: 'meta-tsv',
                  label: 'Meta Commerce Manager (Feed TSV)',
                  url: `${siteOrigin}/meta-catalog-feed.tsv`,
                },
                {
                  key: 'google-tsv',
                  label: 'Google Merchant Center (Feed TSV)',
                  url: `${siteOrigin}/google-merchant-feed.tsv`,
                },
              ].map((feed) => (
                <div key={feed.key} className="meta-admin-feed-item">
                  <div className="meta-admin-feed-label">{feed.label}</div>
                  <div className="meta-admin-feed-row">
                    <input
                      type="text"
                      readOnly
                      value={feed.url}
                      onFocus={(e) => e.target.select()}
                      className="meta-admin-feed-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyFeedUrl(feed.key, feed.url)}
                      className={`meta-admin-feed-btn ${
                        copiedFeedKey === feed.key ? 'is-copied' : ''
                      }`}
                    >
                      {copiedFeedKey === feed.key ? '✓ Copiado' : 'Copiar URL'}
                    </button>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-admin-feed-btn"
                    >
                      Abrir ↗
                    </a>
                  </div>
                </div>
              ))}
            </section>

            {/* Footer Action Bar */}
            <div className="meta-admin-actions-bar">
              <div className="meta-admin-actions-left">
                <button
                  type="button"
                  onClick={loadConfig}
                  disabled={loadingConfig || saving}
                  className="meta-admin-secondary-btn"
                >
                  {loadingConfig ? 'Recargando...' : '↻ Recargar de Wix CMS'}
                </button>

                <button
                  type="button"
                  onClick={handleTestPageView}
                  className="meta-admin-secondary-btn"
                >
                  ● Probar evento PageView
                </button>
              </div>

              <button type="submit" disabled={saving} className="meta-admin-publish-btn">
                {saving ? 'Publicando en Wix CMS...' : 'Guardar y Publicar Globalmente'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
