import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

// This is what your tRPC procedures will have access to.
// For now, it will include the MongoDB client and potentially the authenticated user later.
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // For now, let's assume you'll add Firebase Admin SDK for verifying tokens later
  // and extracting the Firebase UID server-side.
  // For simplicity, we'll start without user authentication in the context.
  // We will add user handling later.

  const mongoClient = new MongoClient(process.env.ATLAS_URI!);
  await mongoClient.connect();
  const db = mongoClient.db("ÖnLab"); // Or your actual database name

  return {
    req,
    res,
    db,
    mongoClient,
    // firebaseUid: null, // Placeholder for Firebase UID
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;