import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key');
const PRICE_AMOUNT = 1999; // $19.99 in cents

export async function POST(request: Request) {
  try {
    return new NextResponse(
      JSON.stringify({ error: 'This endpoint is temporarily unavailable' }),
      { status: 501 }
    );
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 }
    );
  }
}
