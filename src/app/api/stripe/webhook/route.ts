import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { broadcast } from '@/lib/realtime';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing stripe signature or secret' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email: string | undefined = session.customer_email || session.customer_details?.email || undefined;
        const ref: string | undefined = (session.metadata && typeof session.metadata.ref === 'string') ? session.metadata.ref : undefined;
        if (email) {
          await dbConnect();
          const user = await User.findOneAndUpdate(
            { email },
            { $inc: { tickets: 1 } },
            { upsert: true, setDefaultsOnInsert: true, new: true }
          );
          if (ref) {
            await User.findOneAndUpdate(
              { email: ref },
              { $inc: { referrals: 1 } },
              { upsert: true, setDefaultsOnInsert: true }
            );
          }
          if (user) {
            broadcast('leaderboard_update', { email: user.email, tickets: user.tickets, referrals: user.referrals, ref });
          }
        }
        break;
      }
      default:
        // ignore other events for now
        break;
    }
  } catch (e: unknown) {
    console.error('Webhook handler error', e);
    return NextResponse.json({ received: true, error: 'handler' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
