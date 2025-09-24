import { NextResponse } from 'next/server';
import { getAuthedUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ authed: false });
  return NextResponse.json({ 
    authed: true, 
    user: { 
      email: user.email, 
      tickets: user.tickets, 
      referrals: user.referrals,
      totalScore: user.tickets + user.referrals
    } 
  });
}
