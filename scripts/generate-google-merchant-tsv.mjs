/**
 * Generates local snapshots of Google Merchant (.tsv) and Meta Commerce (.xml, .csv)
 * catalog feeds directly from the live Wix Stores catalog via api/catalog-feed.js builders.
 *
 * Outputs (root backups — live production feeds are served dynamically via /api/catalog-feed):
 *   - ./google-merchant-feed.tsv
 *   - ./meta-catalog-feed.xml
 *   - ./meta-catalog-feed.csv
 */
import fs from 'fs';
import path from 'path';
import {
  fetchWixCatalogItems,
  normalizeFeedProducts,
  buildGoogleMerchantTsv,
  buildMetaXml,
  buildMetaCsv,
} from '../api/catalog-feed.js';

async function main() {
  const wixItems = await fetchWixCatalogItems();
  const normalized = normalizeFeedProducts(wixItems);

  const googleTsv = buildGoogleMerchantTsv(normalized);
  const metaXml = buildMetaXml(normalized);
  const metaCsv = buildMetaCsv(normalized);

  const rootDir = path.resolve('d:/Workspace/Assets/Sutra');
  const outputs = [
    { file: path.join(rootDir, 'google-merchant-feed.tsv'), content: googleTsv },
    { file: path.join(rootDir, 'meta-catalog-feed.xml'), content: metaXml },
    { file: path.join(rootDir, 'meta-catalog-feed.csv'), content: metaCsv },
  ];

  for (const out of outputs) {
    fs.writeFileSync(out.file, out.content, 'utf8');
  }

  console.log(`Generated ${normalized.length} products into:`);
  for (const out of outputs) {
    console.log(' -', out.file);
  }
}

main().catch((err) => {
  console.error('Error generating catalog feeds:', err);
  process.exit(1);
});
