import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  
  // Get users sorted by total score (tickets + referrals), then by tickets, then by referrals
  const users = await User.find({})
    .sort({ 
      tickets: -1, 
      referrals: -1 
    })
    .limit(100)
    .lean();
  
  // Calculate totals
  const totalUsers = await User.countDocuments({});
  const totalTickets = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$tickets' } } }
  ]);
  const totalReferrals = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$referrals' } } }
  ]);
  
  return NextResponse.json({ 
    users: users.map(u => ({ 
      email: u.email, 
      tickets: u.tickets, 
      referrals: u.referrals,
      totalScore: u.tickets + u.referrals
    })),
    stats: {
      totalUsers,
      totalTickets: totalTickets[0]?.total || 0,
      totalReferrals: totalReferrals[0]?.total || 0
    }
  });
}
