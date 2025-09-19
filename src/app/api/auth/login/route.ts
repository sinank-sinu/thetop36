import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { signSession } from '@/lib/auth';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const { email } = parsed.data;
  await dbConnect();
  await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { tickets: 0, referrals: 0 } },
    { upsert: true }
  );
  const token = signSession(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
