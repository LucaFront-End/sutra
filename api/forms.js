/**
 * Vercel Serverless Function: Wix CMS ContactoGeneral Integration
 * Endpoint: POST /api/forms
 * Submits web form entries to Wix Data collection "ContactoGeneral".
 */

const WIX_API_BASE = 'https://www.wixapis.com';
const DEFAULT_SITE_ID = 'd33fa0f4-e839-48dc-9ba7-f71199a5796e';
const COLLECTION_ID = 'ContactoGeneral';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      collection: COLLECTION_ID,
      hint: 'Send POST request with { nombre, email, telefono, empresa, industria, mensaje, fecha }',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.WIX_API_KEY || process.env.VITE_WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || process.env.VITE_WIX_SITE_ID || DEFAULT_SITE_ID;

  if (!apiKey || !siteId) {
    return res.status(500).json({
      error: 'Wix credentials not configured in environment variables (WIX_API_KEY / WIX_SITE_ID)',
    });
  }

  try {
    const {
      nombre,
      name,
      email,
      telefono,
      phone,
      empresa,
      company,
      industria,
      industry,
      mensaje,
      message,
      asunto,
      subject,
      tipo,
      fecha,
    } = req.body || {};

    const cleanNombre = (nombre || name || 'Visitante Sutra').toString().trim();
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanTelefono = (telefono || phone || '').toString().trim();
    const cleanEmpresa = (empresa || company || asunto || subject || 'Sutra Web').toString().trim();
    const cleanIndustria = (industria || industry || tipo || 'Contacto General').toString().trim();
    const cleanMensaje = (mensaje || message || 'Mensaje desde la web').toString().trim();

    // Format local Mexican date if not supplied
    const cleanFecha = fecha || new Date().toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const itemPayload = {
      dataCollectionId: COLLECTION_ID,
      item: {
        nombre: cleanNombre,
        email: cleanEmail,
        telefono: cleanTelefono,
        empresa: cleanEmpresa,
        industria: cleanIndustria,
        mensaje: cleanMensaje,
        fecha: cleanFecha,
      },
    };

    const wixUrl = `${WIX_API_BASE}/wix-data/v1/items`;
    const wixRes = await fetch(wixUrl, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'wix-site-id': siteId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemPayload),
    });

    const resText = await wixRes.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      throw new Error(`Wix API non-JSON response (${wixRes.status}): ${resText.slice(0, 300)}`);
    }

    if (!wixRes.ok) {
      const errorMsg = data?.message || data?.details?.applicationError?.description || resText;
      return res.status(wixRes.status).json({
        error: `Wix CMS Error: ${errorMsg}`,
        status: wixRes.status,
      });
    }

    const insertedId = data?.item?._id || data?.dataItem?._id || data?.item?.id;

    return res.status(200).json({
      success: true,
      id: insertedId,
      collection: COLLECTION_ID,
      item: itemPayload.item,
    });
  } catch (err) {
    console.error('[API Forms Error]', err);
    return res.status(500).json({
      error: 'Error saving to Wix CMS',
      details: err.message,
    });
  }
}
