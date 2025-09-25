import { NextResponse } from 'next/server';
import { getAuthedUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ authed: false });
  
  // Type assertion to ensure proper typing
  const userData = user as unknown as { email: string; tickets: number; referrals: number };
  
  return NextResponse.json({ 
    authed: true, 
    user: { 
      email: userData.email, 
      tickets: userData.tickets, 
      referrals: userData.referrals,
      totalScore: userData.tickets + userData.referrals
    } 
  });
}
