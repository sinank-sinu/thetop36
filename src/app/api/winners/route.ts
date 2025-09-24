import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Winner } from '@/models/Winner';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  await dbConnect();
  
  const winners = await Winner.find({}).sort({ drawDate: -1 }).limit(100).lean();
  
  // Calculate statistics
  const totalWinners = await Winner.countDocuments({});
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWinners = await Winner.countDocuments({ 
    drawDate: { $gte: today } 
  });
  
  return NextResponse.json({ 
    winners,
    stats: {
      totalWinners,
      todayWinners
    }
  });
}
