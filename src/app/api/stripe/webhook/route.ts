import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { broadcast } from '@/lib/realtime';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Track processed events to prevent duplicate processing
const processedEvents = new Set<string>();

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!sig || !secret) {
    console.error('Missing stripe signature or secret');
    return NextResponse.json({ error: 'Missing stripe signature or secret' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Check if we've already processed this event
  if (processedEvents.has(event.id)) {
    console.log('Event already processed:', event.id);
    return NextResponse.json({ received: true, message: 'Event already processed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Validate session
        if (session.payment_status !== 'paid') {
          console.log('Session not paid:', session.id);
          break;
        }

        const email = session.customer_email || session.customer_details?.email;
        const ref = session.metadata?.ref;
        
        if (!email) {
          console.error('No email found in session:', session.id);
          break;
        }

        console.log('Processing payment for:', email, 'ref:', ref);

        await dbConnect();
        
        // Use transaction for atomic operations
        const session_db = await User.db.startSession();
        
        try {
          await session_db.withTransaction(async () => {
            // Add ticket to user
            const user = await User.findOneAndUpdate(
              { email: email.toLowerCase() },
              { $inc: { tickets: 1 } },
              { upsert: true, setDefaultsOnInsert: true, new: true, session: session_db }
            );

            // Add referral bonus if applicable
            if (ref) {
              await User.findOneAndUpdate(
                { email: ref.toLowerCase() },
                { $inc: { referrals: 1 } },
                { upsert: true, setDefaultsOnInsert: true, session: session_db }
              );
            }

            // Broadcast update
            if (user) {
              broadcast('leaderboard_update', { 
                email: user.email, 
                tickets: user.tickets, 
                referrals: user.referrals, 
                ref,
                timestamp: new Date().toISOString()
              });
            }
          });
        } finally {
          await session_db.endSession();
        }

        // Mark event as processed
        processedEvents.add(event.id);
        
        // Clean up old processed events (keep last 1000)
        if (processedEvents.size > 1000) {
          const eventsArray = Array.from(processedEvents);
          processedEvents.clear();
          eventsArray.slice(-500).forEach(id => processedEvents.add(id));
        }

        console.log('Successfully processed payment for:', email);
        break;
      }
      
      case 'payment_intent.succeeded': {
        // Handle direct payment intents if needed
        console.log('Payment intent succeeded:', event.data.object.id);
        break;
      }
      
      default:
        console.log('Unhandled event type:', event.type);
        break;
    }
  } catch (e: unknown) {
    console.error('Webhook handler error:', e);
    return NextResponse.json({ received: true, error: 'handler' }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventId: event.id });
}
