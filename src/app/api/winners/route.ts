import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Winner } from '@/models/Winner';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  await dbConnect();
  const winners = await Winner.find({}).sort({ drawDate: -1 }).limit(100).lean();
  return NextResponse.json({ winners });
}
