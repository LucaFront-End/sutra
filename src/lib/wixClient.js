// Universal Wix Stores Catalog App ID — required for eCommerce cart catalogReference
export const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';
export const WIX_CLIENT_ID = '7bf257ab-ef88-41f5-9904-da15badacfc1';
export const TOKEN_KEY = 'sutra_wix_session';

/**
 * Mapping of Wix Catalog Item IDs to their corresponding active Wix Stores Subscription Option IDs.
 * Products with allowOneTimePurchases: false REQUIRE their subscriptionOptionId in catalogReference.options.
 */
export const KNOWN_SUBSCRIPTION_OPTIONS = {
  // MisteryBox Ritual Completo | Velas Flotantes y Velas de Arena ($1,590 regular, $1,440 bimestral)
  'a9a00ce4-e102-4b47-8f45-da29e2579106': '246e57b9-9b8a-414d-862f-410da6746df4',
  // MisteryBox Esencial | Velas Flotantes y Velas de Arena ($690 regular, $590 bimestral)
  '6f22920a-ad94-43ca-baf5-4853d9d6dfd5': 'bc9c269c-3fdf-4334-8b8f-2a510e0771d4',
};
