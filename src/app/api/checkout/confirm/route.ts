import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';

const schema = z.object({ session_id: z.string().min(1) });

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured. Please check your environment variables.' }, { status: 500 });
  }
  
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  const { session_id } = parsed.data;
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: false, reason: 'unpaid' }, { status: 200 });
    }
    
    const email = session.customer_email || (session.customer_details?.email ?? undefined);
    if (!email) {
      return NextResponse.json({ ok: false, reason: 'no-email' }, { status: 200 });
    }

    await dbConnect();
    
    // Check if user exists and get current state
    let user = await User.findOne({ email: email.toLowerCase() }).lean();
    
    if (!user) {
      // Create user if they don't exist (fallback for webhook issues)
      user = await User.create({ 
        email: email.toLowerCase(), 
        tickets: 0, 
        referrals: 0 
      });
    }

    // Check if this session has already been processed
    const sessionProcessed = session.metadata?.processed === 'true';
    
    if (!sessionProcessed) {
      // Process the payment if webhook hasn't handled it yet
      const ref = session.metadata?.ref;
      
      // Add ticket to user
      const updatedUser = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $inc: { tickets: 1 } },
        { upsert: true, setDefaultsOnInsert: true, new: true }
      );

      // Add referral bonus if applicable
      if (ref) {
        await User.findOneAndUpdate(
          { email: ref.toLowerCase() },
          { $inc: { referrals: 1 } },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }

      // Mark session as processed to avoid double-counting
      await stripe.checkout.sessions.update(session_id, {
        metadata: { ...session.metadata, processed: 'true' }
      });

      console.log('Payment processed in confirm API:', {
        email: email.toLowerCase(),
        tickets: updatedUser?.tickets,
        ref
      });

      return NextResponse.json({ 
        ok: true, 
        user: updatedUser,
        processed: true 
      });
    }

    // Return current user state if already processed
    return NextResponse.json({ 
      ok: true, 
      user,
      processed: false 
    });
    
  } catch (e: any) {
    console.error('Confirm error:', e);
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
