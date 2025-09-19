import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe operations will fail until configured.');
}

export const stripe = new Stripe(key || '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
export const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
