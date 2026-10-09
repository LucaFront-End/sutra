import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'wix-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/forms' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const apiKey = env.WIX_API_KEY || env.VITE_WIX_API_KEY || '';
                  const siteId = env.WIX_SITE_ID || env.VITE_WIX_SITE_ID || 'd33fa0f4-e839-48dc-9ba7-f71199a5796e';

                  const wixRes = await fetch('https://www.wixapis.com/wix-data/v1/items', {
                    method: 'POST',
                    headers: {
                      Authorization: apiKey,
                      'wix-site-id': siteId,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      dataCollectionId: 'ContactoGeneral',
                      item: {
                        nombre: parsed.nombre || 'Visitante Sutra',
                        email: parsed.email || '',
                        telefono: parsed.telefono || '',
                        empresa: parsed.empresa || '',
                        industria: parsed.industria || '',
                        mensaje: parsed.mensaje || '',
                        fecha: parsed.fecha || new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
                      },
                    }),
                  });

                  const resText = await wixRes.text();
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = wixRes.status;
                  res.end(resText);
                } catch (err) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
  };
});
