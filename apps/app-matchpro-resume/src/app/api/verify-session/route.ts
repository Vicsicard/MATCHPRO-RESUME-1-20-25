import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session_id parameter' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Error verifying session' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    return new NextResponse(
      JSON.stringify({ error: 'This endpoint is temporarily unavailable' }),
      { status: 501 }
    );
  } catch (err) {
    console.error('Error verifying session:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to verify session' }),
      { status: 500 }
    );
  }
}
