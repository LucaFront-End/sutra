import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const WIX_CLIENT_ID = '7bf257ab-ef88-41f5-9904-da15badacfc1';

const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({
    clientId: WIX_CLIENT_ID,
  }),
});

async function main() {
  await wixClient.auth.generateVisitorTokens();

  // Test system collection
  try {
    const res = await wixClient.items.query('Stores/Products').limit(1).find();
    console.log('Stores/Products exists and items.query works! Count:', res.items?.length);
  } catch (e) {
    console.log('Stores/Products query error:', e.message);
  }
}

main().catch(console.error);
