import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Database operations will fail until configured.');
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseConn?: { 
    conn: typeof mongoose | null; 
    promise: Promise<typeof mongoose> | null;
    lastConnected?: Date;
  };
};

let cached = (global as GlobalWithMongoose).mongooseConn;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongooseConn = { 
    conn: null, 
    promise: null,
    lastConnected: undefined
  };
}

export async function dbConnect() {
  // Return existing connection if available and recent
  if (cached!.conn && cached!.lastConnected) {
    const timeSinceLastConnection = Date.now() - cached!.lastConnected.getTime();
    // Reuse connection if it's less than 5 minutes old
    if (timeSinceLastConnection < 5 * 60 * 1000) {
      return cached!.conn;
    }
  }

  // Create new connection if none exists or connection is stale
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'thetop36',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }).then((conn) => {
      cached!.lastConnected = new Date();
      console.log('MongoDB connected successfully');
      return conn;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      cached!.promise = null; // Reset promise on error
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  } catch (error) {
    cached!.promise = null; // Reset promise on error
    throw error;
  }
}

// Graceful shutdown
export async function dbDisconnect() {
  if (cached!.conn) {
    await mongoose.disconnect();
    cached!.conn = null;
    cached!.promise = null;
    cached!.lastConnected = undefined;
    console.log('MongoDB disconnected');
  }
}
