import Stripe from 'stripe';

// This should only be used in server-side contexts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
