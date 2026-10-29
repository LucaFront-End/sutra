/**
 * SUTRA MEXICO — Universal Forms & CMS Integration Service
 * Sends all web forms, lead captures, inquiries, and subscriptions to:
 * 1. Wix CMS Data collection "ContactoGeneral".
 * 2. FormSubmit (submit.co) to Sutra's official email (hola@sutramexico.com)
 *    and test1@dilodigitalmx.com, formatted in Spanish with clean white table template.
 * 
 * Target Wix CMS URL:
 * https://manage.wix.com/dashboard/d33fa0f4-e839-48dc-9ba7-f71199a5796e/wix-cms/data/ContactoGeneral
 */

const STORAGE_SUBMISSIONS_KEY = 'sutra_form_submissions';
const DEFAULT_SITE_ID = 'd33fa0f4-e839-48dc-9ba7-f71199a5796e';
const COLLECTION_ID = 'ContactoGeneral';

export const SUTRA_OFFICIAL_EMAIL = 'hola@sutramexico.com';
export const SUTRA_CONTACT_EMAIL = 'contacto@sutramexico.com';
export const DILO_TEST_EMAIL = 'test1@dilodigitalmx.com';

/**
 * Returns formatted Mexican datetime string
 */
export function getMexicanDateTime() {
  try {
    return new Date().toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Sends form payload to FormSubmit (submit.co) in Spanish with clean white template
 */
export async function sendToFormSubmit(payload = {}) {
  const formSubject = `Nuevo registro en Sutra México · ${payload.industria || payload.empresa || 'Web'}`;

  // Clean Spanish key-value dictionary for white table template
  const emailPayload = {
    _subject: formSubject,
    _template: 'table', // Plantilla blanca tipo tabla limpia sin decoraciones oscuras
    _captcha: 'false',
    'Nombre': payload.nombre || 'No indicado',
    'Correo Electrónico': payload.email || 'No indicado',
    'Celular / WhatsApp': payload.telefono || 'No indicado',
    'Empresa / Asunto': payload.empresa || 'Sutra Web',
    'Tipo de Formulario': payload.industria || 'General',
    'Mensaje / Detalle': payload.mensaje || 'Sin mensaje adicional',
    'Fecha y Hora': payload.fecha || getMexicanDateTime(),
  };

  const targets = [
    {
      endpoint: `https://formsubmit.co/ajax/${SUTRA_OFFICIAL_EMAIL}`,
      body: { ...emailPayload, _cc: `${DILO_TEST_EMAIL},${SUTRA_CONTACT_EMAIL}` },
    },
    {
      endpoint: `https://formsubmit.co/ajax/${DILO_TEST_EMAIL}`,
      body: { ...emailPayload, _cc: `${SUTRA_OFFICIAL_EMAIL},${SUTRA_CONTACT_EMAIL}` },
    },
  ];

  try {
    await Promise.allSettled(
      targets.map((t) =>
        fetch(t.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(t.body),
        }).catch((err) => {
          console.warn('[formSubmit] Endpoint notice:', t.endpoint, err.message);
        })
      )
    );
  } catch (err) {
    console.warn('[formSubmit] General error:', err);
  }
}

/**
 * Submits form data directly to Wix CMS collection "ContactoGeneral" and FormSubmit
 * 
 * @param {Object} data
 * @param {string} [data.nombre] - User's full name
 * @param {string} [data.email] - User's email
 * @param {string} [data.telefono] - User's phone / WhatsApp
 * @param {string} [data.empresa] - Company name, topic, or source identifier
 * @param {string} [data.industria] - Industry, business type, or form category
 * @param {string} [data.mensaje] - Message, notes, or detailed payload
 * @param {string} [data.fecha] - Date string (optional)
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function submitToContactoGeneral(data = {}) {
  const payload = {
    nombre: (data.nombre || data.name || 'Visitante Sutra').toString().trim(),
    email: (data.email || '').toString().trim().toLowerCase(),
    telefono: (data.telefono || data.phone || '').toString().trim(),
    empresa: (data.empresa || data.company || data.asunto || data.subject || 'Sutra Web').toString().trim(),
    industria: (data.industria || data.industry || data.tipo || 'General').toString().trim(),
    mensaje: (data.mensaje || data.message || 'Sin mensaje').toString().trim(),
    fecha: data.fecha || getMexicanDateTime(),
  };

  // 1. Save local backup in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_SUBMISSIONS_KEY) || '[]');
    existing.unshift({
      ...payload,
      _localTimestamp: Date.now(),
      _status: 'pending',
    });
    localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // Ignore storage quota
  }

  // 2. Dispatch to FormSubmit (submit.co) in background
  sendToFormSubmit(payload).catch((e) => console.warn('[formsService] formSubmit background error:', e));

  // 3. Primary: Send through /api/forms serverless route (Wix CMS ContactoGeneral)
  try {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const resJson = await response.json();
      updateLocalSubmissionStatus(payload, 'synced', resJson.id);
      return { success: true, id: resJson.id, item: payload };
    }

    console.warn('[formsService] /api/forms returned non-200, trying direct Wix API fallback:', response.status);
  } catch (apiErr) {
    console.warn('[formsService] /api/forms network notice, trying direct fallback:', apiErr.message);
  }

  // 4. Fallback: Direct call to Wix Data REST API
  try {
    const apiKey = import.meta.env?.VITE_WIX_API_KEY || '';
    const siteId = import.meta.env?.VITE_WIX_SITE_ID || DEFAULT_SITE_ID;

    if (apiKey && siteId) {
      const directRes = await fetch('https://www.wixapis.com/wix-data/v1/items', {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'wix-site-id': siteId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataCollectionId: COLLECTION_ID,
          item: payload,
        }),
      });

      if (directRes.ok) {
        const directJson = await directRes.json();
        const insertedId = directJson?.item?._id || directJson?.item?.id;
        updateLocalSubmissionStatus(payload, 'synced', insertedId);
        return { success: true, id: insertedId, item: payload };
      }
    }
  } catch (fallbackErr) {
    console.error('[formsService] Direct fallback error:', fallbackErr);
  }

  // If Wix API failed, local record and FormSubmit were already dispatched
  return {
    success: true,
    id: `local-${Date.now()}`,
    item: payload,
    isLocalFallback: true,
  };
}

function updateLocalSubmissionStatus(payload, status, id) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_SUBMISSIONS_KEY) || '[]');
    if (existing.length > 0) {
      existing[0]._status = status;
      if (id) existing[0]._cmsId = id;
      localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(existing));
    }
  } catch {}
}
