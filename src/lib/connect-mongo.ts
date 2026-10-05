import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> };
}

// Use global to survive Next.js hot reloads in dev and module re-instantiation in serverless
const cached = global._mongooseCache ?? (global._mongooseCache = {});

async function connectMongo() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      // Keep pool small for serverless: total connections = instances × maxPoolSize
      maxPoolSize: 5,
    });
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}

export default connectMongo;
