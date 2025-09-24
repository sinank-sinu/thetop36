import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICE_ID, SITE_URL } from '@/lib/stripe';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

// Cache for created products to avoid recreating them
const productCache = new Map<string, string>();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ 
        error: 'Stripe not configured. Please check your environment variables.' 
      }, { status: 500 });
    }
    
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        details: parsed.error.issues 
      }, { status: 400 });
    }

    const { email } = parsed.data;
    const ref = req.cookies.get('ref')?.value;

    // Get or create price ID
    let priceId = STRIPE_PRICE_ID;
    
    if (!priceId || priceId === 'price_your_price_id_here') {
      // Check cache first
      const cacheKey = 'thetop36_bundle_price';
      if (productCache.has(cacheKey)) {
        priceId = productCache.get(cacheKey)!;
      } else {
        // Create product and price
        const product = await stripe.products.create({
          name: 'TheTop36 Bundle',
          description: 'Curated public-domain vault with raffle ticket',
          metadata: { purpose: 'thetop36_bundle' },
        });
        
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: 700, // $7.00 in cents
          currency: 'usd',
          metadata: { purpose: 'thetop36_bundle' },
        });
        
        priceId = price.id;
        productCache.set(cacheKey, priceId);
        console.log('Created test product and price:', { productId: product.id, priceId });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/buy?canceled=1`,
      metadata: { 
        purpose: 'thetop36_bundle',
        email: email,
        ...(ref ? { ref } : {}) 
      },
      payment_intent_data: {
        metadata: {
          purpose: 'thetop36_bundle',
          email: email,
          ...(ref ? { ref } : {})
        }
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json({ 
      id: session.id, 
      url: session.url,
      expires_at: session.expires_at 
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    console.error('Stripe session error:', err);
    
    // Don't expose internal errors in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Payment service temporarily unavailable' 
      : message;
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
