import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Winner } from '@/models/Winner';
import { broadcast } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== (process.env.VERCEL_CRON_SECRET || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // Pick a random user with at least 1 ticket
  const total = await User.countDocuments({ tickets: { $gt: 0 } });
  if (total === 0) {
    return NextResponse.json({ ok: true, message: 'No eligible users' });
  }
  const skip = Math.floor(Math.random() * total);
  const winnerUser = await User.findOne({ tickets: { $gt: 0 } }).skip(skip).lean();
  if (!winnerUser) {
    return NextResponse.json({ ok: true, message: 'No winner selected' });
  }

  const prize = 'Daily Micro Prize';
  const drawDate = new Date();
  await Winner.create({ email: winnerUser.email, prize, drawDate });

  broadcast('winner_update', { email: winnerUser.email, prize, drawDate });

  return NextResponse.json({ ok: true, winner: { email: winnerUser.email, prize, drawDate } });
}
