import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Winner } from '@/models/Winner';
import { broadcast } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

// Track last draw to prevent multiple draws on the same day
let lastDrawDate: string | null = null;

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret');
    if (!secret || secret !== (process.env.CRON_JOB_SECRET || '')) {
      console.error('Unauthorized cron job attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if we've already run a draw today
    if (lastDrawDate === today) {
      console.log('Draw already completed today:', today);
      return NextResponse.json({ ok: true, message: 'Draw already completed today' });
    }

    await dbConnect();

    // Check if there's already a winner for today
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const existingWinner = await Winner.findOne({
      drawDate: { $gte: todayStart, $lt: todayEnd }
    });

    if (existingWinner) {
      console.log('Winner already selected for today:', existingWinner.email);
      lastDrawDate = today;
      return NextResponse.json({ 
        ok: true, 
        message: 'Winner already selected today',
        winner: existingWinner 
      });
    }

    // Get all eligible users with their ticket counts
    const eligibleUsers = await User.find({ tickets: { $gt: 0 } })
      .select('email tickets')
      .lean();

    if (eligibleUsers.length === 0) {
      console.log('No eligible users for draw');
      return NextResponse.json({ ok: true, message: 'No eligible users' });
    }

    // Calculate total tickets for weighted selection
    const totalTickets = eligibleUsers.reduce((sum, user) => sum + user.tickets, 0);
    
    if (totalTickets === 0) {
      console.log('No tickets available for draw');
      return NextResponse.json({ ok: true, message: 'No tickets available' });
    }

    // Weighted random selection (users with more tickets have higher chance)
    let randomTicket = Math.floor(Math.random() * totalTickets) + 1;
    let selectedUser = null;

    for (const user of eligibleUsers) {
      randomTicket -= user.tickets;
      if (randomTicket <= 0) {
        selectedUser = user;
        break;
      }
    }

    if (!selectedUser) {
      // Fallback to simple random selection
      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      selectedUser = eligibleUsers[randomIndex];
    }

    const prize = 'Daily Micro Prize';
    const drawDate = new Date();

    // Create winner record
    const winner = await Winner.create({ 
      email: selectedUser.email, 
      prize, 
      drawDate 
    });

    // Update last draw date
    lastDrawDate = today;

    // Broadcast winner update
    broadcast('winner_update', { 
      email: selectedUser.email, 
      prize, 
      drawDate: drawDate.toISOString(),
      totalTickets,
      totalUsers: eligibleUsers.length
    });

    console.log('Daily draw completed:', {
      winner: selectedUser.email,
      tickets: selectedUser.tickets,
      totalTickets,
      totalUsers: eligibleUsers.length
    });

    return NextResponse.json({ 
      ok: true, 
      winner: { 
        email: selectedUser.email, 
        prize, 
        drawDate: drawDate.toISOString(),
        tickets: selectedUser.tickets
      },
      stats: {
        totalTickets,
        totalUsers: eligibleUsers.length
      }
    });
  } catch (error) {
    console.error('Daily draw error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
