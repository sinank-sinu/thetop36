import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Database operations will fail until configured.');
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

let cached = (global as GlobalWithMongoose).mongooseConn;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongooseConn = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'thetop36',
    });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
