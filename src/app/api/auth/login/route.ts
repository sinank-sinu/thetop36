import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { signSession } from '@/lib/auth';

const schema = z.object({ 
  email: z.string().email().toLowerCase().trim() 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        details: parsed.error.errors 
      }, { status: 400 });
    }

    const { email } = parsed.data;
    
    // Connect to database
    await dbConnect();
    
    // Create or update user
    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { tickets: 0, referrals: 0 } },
      { upsert: true, new: true, runValidators: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Generate JWT token
    const token = signSession(email);
    
    // Create response with secure cookie
    const res = NextResponse.json({ 
      ok: true, 
      user: { 
        email: user.email, 
        tickets: user.tickets, 
        referrals: user.referrals 
      } 
    });
    
    res.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return res;
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
