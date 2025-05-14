import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {

  const mongoClient = new MongoClient(process.env.ATLAS_URI!);
  await mongoClient.connect();
  const db = mongoClient.db("ÖnLab");

  return {
    req,
    res,
    db,
    mongoClient,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;