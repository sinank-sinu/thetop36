import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from './db';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signSession(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifySession(token: string): { email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function getAuthedUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload?.email) return null;
  await dbConnect();
  const user = await User.findOne({ email: payload.email });
  if (!user) return null;
  return user;
}
