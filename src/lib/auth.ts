import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from './db';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Using default secret. This is insecure for production!');
}

interface JWTPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export function signSession(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email for JWT signing');
  }
  
  return jwt.sign(
    { email: email.toLowerCase().trim() }, 
    JWT_SECRET, 
    { 
      expiresIn: '30d',
      issuer: 'thetop36',
      audience: 'thetop36-users'
    }
  );
}

export function verifySession(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'thetop36',
      audience: 'thetop36-users'
    }) as JWTPayload;
    
    // Additional validation
    if (!payload.email || typeof payload.email !== 'string') {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function getAuthedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifySession(token);
    if (!payload?.email) {
      return null;
    }

    await dbConnect();
    const user = await User.findOne({ email: payload.email }).lean();
    
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export function clearSession() {
  // This would be used in a logout endpoint
  // For now, we rely on the client to clear the cookie
  return true;
}
