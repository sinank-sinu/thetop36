import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe operations will fail until configured.');
}

// The error is that the value for `apiVersion` is set to "2024-06-20", 
// but the Stripe TypeScript types expect a specific string literal, 
// such as "2025-08-27.basil" (the latest supported version in the Stripe SDK).
// To fix the error, use the correct version string as required by the Stripe library.

export const stripe = new Stripe(key || '', {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

// Stripe configuration
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_MODE = process.env.STRIPE_MODE || 'test';
export const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Validate Stripe configuration
export const isStripeConfigured = () => {
  return !!(key && STRIPE_PRICE_ID);
};

// Get Stripe mode for display
export const getStripeMode = () => {
  return STRIPE_MODE === 'live' ? 'live' : 'test';
};
