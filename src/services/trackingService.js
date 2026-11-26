import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import { redirects } from '@wix/redirects';
import { WIX_CLIENT_ID, TOKEN_KEY } from '../lib/wixClient';

export const AUTHORIZED_META_ADMIN_EMAIL = 'wixpartner@dilodigitalmx.com';
export const TRACKING_CONFIG_STORAGE_KEY = 'sutra_tracking_config_v1';
export const META_ADMIN_TOKEN_KEY = 'sutra_meta_admin_token_v1';
export const TRACKING_CONFIG_EVENT = 'sutra-tracking-config-updated';

const MEMBER_FLAG = 'sutra_is_member';
const WIX_ADMIN_OAUTH_KEY = 'sutra_meta_admin_oauth_v1';

// Stateless Wix client for public ConfiguracionMeta fallback reads & admin OAuth
const publicWixClient = createClient({
  modules: { items, redirects },
  auth: OAuthStrategy({
    clientId: WIX_CLIENT_ID,
  }),
});

function getStoredMetaAdminToken() {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(META_ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function persistMetaAdminToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(META_ADMIN_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(META_ADMIN_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function getStoredWixMemberAccessToken() {
  if (typeof window === 'undefined') return '';
  try {
    if (window.localStorage.getItem(MEMBER_FLAG) !== 'true') return '';
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.accessToken?.value || '';
  } catch {
    return '';
  }
}

function getActiveAdminAuthToken() {
  return getStoredMetaAdminToken() || getStoredWixMemberAccessToken();
}

export const DEFAULT_TRACKING_CONFIG = {
  slug: 'global-meta-config',
  title: 'Configuración Global Meta Pixel y Código Personalizado',
  metaPixelId: '',
  metaEnabled: false,
  metaCustomCode: '',
  customHeadCode: '',
  customBodyCode: '',
  customEnabled: false,
  updatedBy: '',
  updatedAt: '',
};

export function normalizeTrackingEmail(email) {
  return String(email || '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

export function normalizeTrackingConfig(raw = {}) {
  const cleanPixelId = String(raw.metaPixelId || '')
    .replace(/\D/g, '')
    .slice(0, 24);

  return {
    slug: 'global-meta-config',
    title: 'Configuración Global Meta Pixel y Código Personalizado',
    metaPixelId: cleanPixelId,
    metaEnabled: Boolean(raw.metaEnabled),
    metaCustomCode: String(raw.metaCustomCode || ''),
    customHeadCode: String(raw.customHeadCode || ''),
    customBodyCode: String(raw.customBodyCode || ''),
    customEnabled: Boolean(raw.customEnabled),
    updatedBy: String(raw.updatedBy || ''),
    updatedAt: String(raw.updatedAt || ''),
  };
}

export function getCachedTrackingConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_TRACKING_CONFIG };
  try {
    const raw = window.localStorage.getItem(TRACKING_CONFIG_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRACKING_CONFIG };
    return normalizeTrackingConfig(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_TRACKING_CONFIG };
  }
}

export function setCachedTrackingConfig(config) {
  const normalized = normalizeTrackingConfig(config);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        TRACKING_CONFIG_STORAGE_KEY,
        JSON.stringify(normalized)
      );
    } catch {
      // ignore storage quota errors
    }
  }
  return normalized;
}

/**
 * Fetches published Meta Pixel + custom scripts config for all site visitors.
 */
export async function fetchPublicTrackingConfig() {
  try {
    const res = await fetch('/api/tracking-config', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.config) {
        const cached = setCachedTrackingConfig(data.config);
        return { config: cached, source: data.source || 'api' };
      }
    }
  } catch {
    // Fallback to direct Wix Data query below
  }

  try {
    await publicWixClient.auth.generateVisitorTokens();
    const queryRes = await publicWixClient.items
      .query('ConfiguracionMeta')
      .eq('slug', 'global-meta-config')
      .limit(1)
      .find();
    const item = queryRes?.items?.[0];
    if (item) {
      const cached = setCachedTrackingConfig(item);
      return { config: cached, source: 'wix-client' };
    }
  } catch {
    // Fallback to cached local config
  }

  return { config: getCachedTrackingConfig(), source: 'local-cache' };
}

/**
 * Verifies live admin token or Wix Member access token directly against /api/tracking-config?verify=1
 */
export async function verifyMetaAdminSession() {
  const token = getActiveAdminAuthToken();
  if (!token) {
    return {
      authorized: false,
      status: 'unauthenticated',
      email: '',
      member: null,
      message: `Inicia sesión con tu cuenta de Wix (${AUTHORIZED_META_ADMIN_EMAIL}).`,
    };
  }

  try {
    const res = await fetch('/api/tracking-config?verify=1', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.authorized) {
      return {
        authorized: true,
        status: 'authorized',
        email: data.member?.email || AUTHORIZED_META_ADMIN_EMAIL,
        member: data.member,
        message: 'Acceso autorizado.',
      };
    }

    if (res.status === 403 || data?.reason === 'unauthorized_role') {
      return {
        authorized: false,
        status: 'forbidden',
        email: data.email || '',
        member: null,
        message:
          data.message ||
          `La cuenta actual no tiene acceso. Exclusivo para ${AUTHORIZED_META_ADMIN_EMAIL}.`,
      };
    }

    if (res.status === 401) {
      persistMetaAdminToken(null);
    }

    return {
      authorized: false,
      status: 'expired',
      email: data.email || '',
      member: null,
      message:
        data.message || 'Tu sesión de Wix expiró. Inicia sesión nuevamente.',
    };
  } catch (err) {
    return {
      authorized: false,
      status: 'error',
      email: '',
      member: null,
      message:
        err?.message || 'No se pudo validar tu sesión con el servidor de Wix.',
    };
  }
}

/**
 * Strict credential login exclusively for wixpartner@dilodigitalmx.com.
 */
export async function loginStrictMetaAdmin({ email, password }) {
  const cleanEmail = normalizeTrackingEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Ingresa un correo electrónico válido.',
    };
  }

  if (cleanEmail !== AUTHORIZED_META_ADMIN_EMAIL) {
    return {
      success: false,
      errorCode: 'unauthorizedEmail',
      message: `Acceso denegado. Solo el usuario autorizado de Wix (${AUTHORIZED_META_ADMIN_EMAIL}) puede ingresar.`,
    };
  }

  if (!password) {
    return {
      success: false,
      errorCode: 'invalidPassword',
      message: 'Ingresa la contraseña de acceso.',
    };
  }

  // 1. Validate predetermined admin password on the server (/api/tracking-config)
  try {
    const serverRes = await fetch('/api/tracking-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'admin_login',
        email: cleanEmail,
        password,
      }),
    });
    const serverData = await serverRes.json().catch(() => ({}));
    if (serverRes.ok && serverData?.ok && serverData?.token) {
      persistMetaAdminToken(serverData.token);
      return {
        success: true,
        member: serverData.member,
      };
    }
    if (serverRes.status === 403 || serverRes.status >= 500) {
      return {
        success: false,
        errorCode: serverData?.reason || 'server_error',
        message: serverData?.message || 'No se pudo validar el acceso administrativo.',
      };
    }
  } catch {
    // Fall through to native Wix Member direct login if server endpoint unreachable
  }

  // 2. Fallback: native Wix Member direct login with Wix password
  try {
    await publicWixClient.auth.generateVisitorTokens();
    const response = await publicWixClient.auth.login({
      email: cleanEmail,
      password,
    });

    if (response?.loginState === 'SUCCESS' && response?.data?.sessionToken) {
      const memberTokens = await publicWixClient.auth.getMemberTokensForDirectLogin(
        response.data.sessionToken
      );
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(MEMBER_FLAG, 'true');
        window.localStorage.setItem(TOKEN_KEY, JSON.stringify(memberTokens));
      }

      const verified = await verifyMetaAdminSession();
      if (!verified.authorized) {
        return {
          success: false,
          message:
            verified.message ||
            'No se pudo confirmar el rol autorizado en Wix Members.',
        };
      }

      return {
        success: true,
        member: verified.member,
      };
    }

    const errCode =
      response?.errorCode || response?.error || response?.loginState || '';

    if (errCode === 'invalidPassword') {
      return {
        success: false,
        errorCode: 'invalidPassword',
        message: 'Contraseña incorrecta. Verifica tus datos o usa "Restablecer contraseña".',
      };
    }

    if (errCode === 'resetPassword') {
      return {
        success: false,
        errorCode: 'resetPassword',
        message:
          'Tu cuenta de Wix requiere definir o restablecer una contraseña. Usa el enlace de recuperación o entra con Google / Wix.',
      };
    }

    if (
      String(errCode).toUpperCase().includes('CAPTCHA') ||
      response?.loginState === 'OWNER_APPROVAL_REQUIRED'
    ) {
      return {
        success: false,
        errorCode: errCode,
        message:
          'Wix solicitó verificación adicional (CAPTCHA/OAuth). Inicia sesión usando el botón "Continuar con Google (Wix)".',
      };
    }

    return {
      success: false,
      errorCode: errCode,
      message:
        'Contraseña incorrecta. Verifica tus datos o usa "Continuar con Google (Wix)".',
    };
  } catch (err) {
    return {
      success: false,
      message:
        err?.message ||
        'Error al autenticar. Verifica tu contraseña o usa "Continuar con Google (Wix)".',
    };
  }
}

/**
 * Starts Wix hosted login redirect flow (supports Google / Wix Member login) returning to /admin-meta.
 */
export async function startWixAdminOAuthLogin(returnPath = '/admin-meta') {
  if (typeof window === 'undefined') return { success: false };
  try {
    await publicWixClient.auth.generateVisitorTokens();
    const postFlowUrl = `${window.location.origin}${returnPath}`;
    const { redirectSession } = await publicWixClient.redirects.createRedirectSession({
      login: {},
      callbacks: { postFlowUrl },
      preferences: { additionalQueryParameters: { lang: 'es' } },
    });
    if (redirectSession?.fullUrl) {
      window.location.href = redirectSession.fullUrl;
      return { success: true, redirected: true };
    }
  } catch (err) {
    console.warn('[trackingService] Wix login redirect notice:', err?.message || err);
  }
  return { success: false };
}

/**
 * Completes OAuth PKCE callback if returning to /admin-meta with code & state parameters.
 */
export async function completeWixAdminOAuthIfPresent() {
  if (typeof window === 'undefined') return null;
  try {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const queryParams = new URLSearchParams(window.location.search);
    const hasHash = hashParams.has('code') && hashParams.has('state');
    const hasQuery = queryParams.has('code') && queryParams.has('state');
    if (!hasHash && !hasQuery) return null;

    const rawOAuth = window.localStorage.getItem(WIX_ADMIN_OAUTH_KEY);
    if (!rawOAuth) return null;

    const oauthData = JSON.parse(rawOAuth);
    const parsed = publicWixClient.auth.parseFromUrl(
      window.location.href,
      hasHash ? 'fragment' : 'query'
    );
    if (!parsed?.code || !parsed?.state) return null;

    const tokens = await publicWixClient.auth.getMemberTokens(
      parsed.code,
      parsed.state,
      oauthData
    );
    window.localStorage.setItem(MEMBER_FLAG, 'true');
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    window.localStorage.removeItem(WIX_ADMIN_OAUTH_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);
    return tokens;
  } catch {
    return null;
  }
}

export async function sendWixAdminPasswordReset(email) {
  const cleanEmail = normalizeTrackingEmail(email || AUTHORIZED_META_ADMIN_EMAIL);
  try {
    await publicWixClient.auth.generateVisitorTokens();
    const redirectUri =
      typeof window !== 'undefined'
        ? `${window.location.origin}/admin-meta`
        : 'https://www.sutramexico.com/admin-meta';
    await publicWixClient.auth.sendPasswordResetEmail(cleanEmail, redirectUri);
    return {
      success: true,
      message: `Enviamos un enlace de recuperación de contraseña a ${cleanEmail}.`,
    };
  } catch (err) {
    console.warn('[trackingService] Password reset notice:', err?.message || err);
    return {
      success: false,
      message:
        'Solicitud recibida. Si tu correo está registrado en Wix Members, recibirás las instrucciones en breve.',
    };
  }
}

export async function logoutMetaAdmin() {
  persistMetaAdminToken(null);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(MEMBER_FLAG);
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }
  try {
    await publicWixClient.auth.generateVisitorTokens();
  } catch {
    // ignore
  }
}

/**
 * Publishes updated Meta Pixel + custom code configuration to Wix CMS ConfiguracionMeta.
 */
export async function saveTrackingConfig(configPayload) {
  const token = getActiveAdminAuthToken();
  if (!token) {
    return {
      success: false,
      message: 'Tu sesión expiró. Vuelve a iniciar sesión con tu cuenta autorizada.',
    };
  }

  const res = await fetch('/api/tracking-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(configPayload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    return {
      success: false,
      status: res.status,
      message:
        data?.message ||
        'No se pudo guardar la configuración en Wix CMS.',
    };
  }

  const savedConfig = setCachedTrackingConfig(data.config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(TRACKING_CONFIG_EVENT, { detail: savedConfig })
    );
  }

  return {
    success: true,
    config: savedConfig,
    itemId: data.itemId || null,
  };
}
