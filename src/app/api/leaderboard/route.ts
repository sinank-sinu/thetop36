import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const users = await User.find({}).sort({ tickets: -1, referrals: -1 }).limit(100).lean();
  return NextResponse.json({ users: users.map(u => ({ email: u.email, tickets: u.tickets, referrals: u.referrals })) });
}
