import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICE_ID, SITE_URL } from '@/lib/stripe';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const { email } = parsed.data;
  const ref = req.cookies.get('ref')?.value;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/buy?canceled=1`,
      metadata: { purpose: 'thetop36_bundle', ...(ref ? { ref } : {}) },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    console.error('Stripe session error', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
