import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
// Note: We intentionally do NOT update tickets here to avoid double-counting.

const schema = z.object({ session_id: z.string().min(1) });

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

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
    const user = await User.findOne({ email }).lean();
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    console.error('Confirm error', e);
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
