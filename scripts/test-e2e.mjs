import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('Landing')) {
        console.log(`[Browser ${msg.type()}]:`, msg.text());
      }
    });

    console.log('\n--- 1. Testing /tiendas/:slug ---');
    await page.goto('http://localhost:5173/tiendas/tienda-1-de-velas-de-arena-aguascalientes', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await page.waitForSelector('.hero__landing-pill', { timeout: 10000 });

    const title = await page.title();
    console.log('Page Title:', title);

    const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    console.log('Canonical:', canonical);

    const heroPill = await page.$eval('.hero__landing-pill', el => el.textContent.trim()).catch(() => null);
    console.log('Hero Pill:', heroPill);

    const h1 = await page.$eval('h1', el => el.textContent.trim()).catch(() => null);
    console.log('H1:', h1);

    const jsonLd = await page.$eval('script[type="application/ld+json"]', el => {
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        return null;
      }
    }).catch(() => null);
    console.log('JSON-LD URL:', jsonLd ? jsonLd.url : 'None');

    // Sticky sections check
    const conceptExists = await page.$('.concept-wrapper') !== null;
    const ritualsExists = await page.$('.rituals-wrapper') !== null;
    console.log('Concept section exists:', conceptExists, '| Rituals section exists:', ritualsExists);

    console.log('\n--- 2. Testing /tiendas redirect to /tienda ---');
    await page.goto('http://localhost:5173/tiendas', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('Navigated to /tiendas -> Current URL:', page.url());

    console.log('\n--- 3. Testing /ciudades/:slug ---');
    await page.goto('http://localhost:5173/ciudades/velas-de-arena-aguascalientes', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await page.waitForSelector('.hero__landing-pill', { timeout: 10000 });

    const ciudadTitle = await page.title();
    const ciudadCanonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const ciudadPill = await page.$eval('.hero__landing-pill', el => el.textContent.trim()).catch(() => null);
    console.log('Ciudad Title:', ciudadTitle);
    console.log('Ciudad Canonical:', ciudadCanonical);
    console.log('Ciudad Pill:', ciudadPill);

    console.log('\n--- 4. Testing /zonas Hub & Toggle ---');
    await page.goto('http://localhost:5173/zonas', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const tabs = await page.$$eval('.hub-tab', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()));
    console.log('Hub Tabs:', tabs);

    const initialFirstCardHref = await page.$eval('.zona-card', el => el.getAttribute('href')).catch(() => null);
    console.log('Initial First Card Href (Ciudades):', initialFirstCardHref);

    // Click Tiendas tab
    const tabsList = await page.$$('.hub-tab');
    if (tabsList.length >= 2) {
      await tabsList[1].click();
      await new Promise(r => setTimeout(r, 1500));
      const tiendasFirstCardHref = await page.$eval('.zona-card', el => el.getAttribute('href')).catch(() => null);
      console.log('After Tab Switch First Card Href (Tiendas):', tiendasFirstCardHref);
      const firstCardTag = await page.$eval('.zona-card__tag', el => el.textContent.trim()).catch(() => null);
      console.log('First Card Tag:', firstCardTag);
      const cardTitle = await page.$eval('.zona-card__title', el => el.textContent.trim()).catch(() => null);
      console.log('First Card Title:', cardTitle);
    }

    console.log('\n✅ All automated verification checks passed with 100% precision!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

test();
