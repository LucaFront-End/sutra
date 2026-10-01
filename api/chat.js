/**
 * Wix Inbox + CRM Chat API for SUTRA
 * Uses direct REST calls with Wix API key and site id for Vercel / serverless deployments.
 */

const WIX_API_BASE = 'https://www.wixapis.com';

async function wixFetch(path, options = {}) {
  const apiKey = process.env.WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || '';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query?.action || req.body?.action;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
    return res.status(500).json({
      error: 'Wix credentials not configured. Set WIX_API_KEY and WIX_SITE_ID.',
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
