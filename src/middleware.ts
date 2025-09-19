import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const ref = url.searchParams.get('ref');
  const res = NextResponse.next();
  if (ref) {
    // Store referral code/email in a cookie for later use at checkout
    res.cookies.set('ref', ref, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 45, // 45 days
    });
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)',
  ],
};
