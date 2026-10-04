/**
 * Wix Inbox + CRM Chat API for SUTRA
 * Uses direct REST calls with Wix API key and site id for Vercel / serverless deployments.
 */

const WIX_API_BASE = 'https://www.wixapis.com';
const DEFAULT_SITE_ID = 'd33fa0f4-e839-48dc-9ba7-f71199a5796e';

async function wixFetch(path, options = {}) {
  const apiKey = process.env.WIX_API_KEY || process.env.VITE_WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || process.env.VITE_WIX_SITE_ID || DEFAULT_SITE_ID;

  const url = `${WIX_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
      'wix-site-id': siteId,
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Wix API returned non-JSON (status ${res.status}): ${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.details?.validationError?.fieldViolations?.[0]?.description ||
      data?.details?.applicationError?.description ||
      JSON.stringify(data);
    const err = new Error(`Wix API error ${res.status}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query?.action || req.body?.action;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  const apiKey = process.env.WIX_API_KEY || process.env.VITE_WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || process.env.VITE_WIX_SITE_ID || DEFAULT_SITE_ID;

  // ─── STATUS ACTION ────────────────────────────────────────────────────────
  if (action === 'status') {
    return res.status(200).json({
      configured: Boolean(apiKey && siteId),
      hasApiKey: Boolean(apiKey),
      hasSiteId: Boolean(siteId),
      siteId: siteId ? siteId.slice(0, 8) + '...' : null,
    });
  }

  // ─── DIAGNOSTIC ACTION ────────────────────────────────────────────────────
  if (action === 'diagnostic') {
    const diag = {
      siteIdConfigured: Boolean(siteId),
      siteIdLength: siteId.length,
      siteIdStart: siteId ? siteId.slice(0, 8) + '...' : 'none',
      siteIdIsGuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(siteId.trim()),
      apiKeyConfigured: Boolean(apiKey),
      apiKeyLength: apiKey.length,
      apiKeyStart: apiKey ? apiKey.slice(0, 10) + '...' : 'none',
      apiKeyPrefix: apiKey.slice(0, 4),
      apiKeyLooksValid: apiKey.trim().startsWith('IST.') && apiKey.trim().length > 50,
      instructions: !apiKey
        ? 'Genera una API Key en Wix Dashboard > Configuración > Claves API con permisos de Contacts e Inbox, y configúrala como WIX_API_KEY en Vercel.'
        : 'WIX_API_KEY configurada.',
    };

    let testResult = null;
    if (apiKey && siteId) {
      try {
        const testRes = await wixFetch('/contacts/v4/contacts/query', {
          method: 'POST',
          body: JSON.stringify({ query: { paging: { limit: 1 } } }),
        });
        testResult = { success: true, count: testRes.contacts?.length || 0 };
      } catch (err) {
        testResult = { success: false, error: err.message, status: err.status, wixData: err.data };
      }
    } else {
      testResult = { success: false, note: 'WIX_API_KEY no configurada en variables de entorno de Vercel.' };
    }

    return res.status(200).json({ diagnostic: diag, testResult });
  }

  if (!apiKey || !siteId) {
    return res.status(500).json({
      error: 'Wix credentials not configured. Configure WIX_API_KEY in Vercel.',
      hint: 'Ve a tu panel de Wix > Opciones de desarrollador / Claves API y crea una clave con permisos de Contacts e Inbox.',
    });
  }

  try {
    // ─── INIT CONVERSATION ──────────────────────────────────────────────────
    if (action === 'init') {
      const { name, email, phone } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'Email is required for chat initialization' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = (name?.trim() || 'Visitante SUTRA').split(' ');
      const firstName = cleanName[0];
      const lastName = cleanName.slice(1).join(' ') || undefined;

      let contactId = null;

      // 1. Query existing contacts by email
      try {
        const queryRes = await wixFetch('/contacts/v4/contacts/query', {
          method: 'POST',
          body: JSON.stringify({
            query: {
              filter: { 'primaryInfo.email': { $eq: cleanEmail } },
              paging: { limit: 1 },
            },
          }),
        });
        const items = queryRes.contacts || [];
        if (items.length > 0) {
          contactId = items[0].id || items[0]._id;
        }
      } catch (err) {
        console.warn('[WixChat] Query contacts note:', err.message);
      }

      // 2. Create contact if not found
      if (!contactId) {
        try {
          const nameObj = { first: firstName };
          if (lastName) nameObj.last = lastName;

          const contactInfo = {
            name: nameObj,
            emails: {
              items: [{ tag: 'MAIN', email: cleanEmail }],
            },
          };

          if (phone && phone.trim()) {
            contactInfo.phones = {
              items: [{ tag: 'MOBILE', phone: phone.trim() }],
            };
          }

          const createRes = await wixFetch('/contacts/v4/contacts', {
            method: 'POST',
            body: JSON.stringify({
              info: contactInfo,
              allowDuplicates: true,
            }),
          });
          contactId = createRes.contact?.id || createRes.contact?._id;
        } catch (err) {
          return res.status(500).json({
            error: `Failed to create contact in CRM: ${err.message}`,
            details: err.message,
          });
        }
      }

      if (!contactId) {
        return res.status(500).json({ error: 'Could not retrieve or create contact ID' });
      }

      // 3. Get or create inbox conversation
      try {
        const convoRes = await wixFetch('/inbox/v2/conversations', {
          method: 'POST',
          body: JSON.stringify({
            participantId: { contactId },
          }),
        });
        const conversationId =
          convoRes.conversation?.id ||
          convoRes.conversationId ||
          convoRes.id;
        return res.status(200).json({ conversationId, contactId });
      } catch (err) {
        return res.status(500).json({
          error: `Failed to initialize conversation: ${err.message}`,
          details: err.message,
        });
      }

    // ─── LIST MESSAGES ────────────────────────────────────────────────────────
    } else if (action === 'list') {
      const conversationId = req.query?.conversationId || req.body?.conversationId;
      if (!conversationId) {
        return res.status(400).json({ error: 'conversationId is required' });
      }

      try {
        const msgRes = await wixFetch(
          `/inbox/v2/messages?conversationId=${conversationId}&visibility=BUSINESS_AND_PARTICIPANT`,
          { method: 'GET' }
        );
        return res.status(200).json(msgRes);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to list messages', details: err.message });
      }

    // ─── SEND MESSAGE ──────────────────────────────────────────────────────────
    } else if (action === 'send') {
      const { conversationId, text } = req.body || {};
      if (!conversationId || !text) {
        return res.status(400).json({ error: 'conversationId and text are required' });
      }

      try {
        const sendRes = await wixFetch('/inbox/v2/messages', {
          method: 'POST',
          body: JSON.stringify({
            conversationId,
            conversation_id: conversationId,
            message: {
              content: {
                basic: {
                  items: [{ text }],
                },
              },
              direction: 'PARTICIPANT_TO_BUSINESS',
              visibility: 'BUSINESS_AND_PARTICIPANT',
            },
            sendAs: 'PARTICIPANT',
            send_as: 'PARTICIPANT',
          }),
        });
        return res.status(200).json(sendRes);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to send message', details: err.message });
      }
    } else {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (globalErr) {
    return res.status(500).json({ error: 'Internal Server Error', details: globalErr.message });
  }
}
