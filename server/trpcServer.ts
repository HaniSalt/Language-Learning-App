import { initTRPC, TRPCError } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { connectToDB, getDb } from './connect.cjs'; // Your MongoDB connection
import cors from 'cors'; // For handling Cross-Origin Resource Sharing
// Optional: Zod for input validation
// import { z } from 'zod';

// Initialize MongoDB Connection (call this once when the server starts)
async function initializeDatabase() {
  try {
    await connectToDB();
    console.log('Successfully connected to MongoDB for tRPC server.');
  } catch (error) {
    console.error('Failed to connect to MongoDB for tRPC server:', error);
    process.exit(1); // Exit if DB connection fails
  }
}

initializeDatabase();

// 1. Define Context
// This object is available in all your tRPC procedures.
// It's where you'd put things like DB connections or user authentication info.
export type Context = {
  db: ReturnType<typeof getDb>; // Type for your MongoDB instance
  user?: { id: string; token?: string }; // Example: For authenticated users
};

// Helper to create context for each request
// Here, we're ensuring the DB is available.
// You would also handle user authentication token verification here.
const createContext = async ({ req }: any): Promise<Context> => { // `any` for req for simplicity, can be typed better
  const dbInstance = getDb();
  if (!dbInstance) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database not initialized.',
    });
  }

  // Example: Extracting and verifying a JWT token from Firebase Auth
  // const token = req.headers.authorization?.split(' ')[1];
  // let user;
  // if (token) {
  //   try {
  //     // You'd use Firebase Admin SDK here to verify the token
  //     // const decodedToken = await admin.auth().verifyIdToken(token);
  //     // user = { id: decodedToken.uid, token };
  //   } catch (error) {
  //     console.error("Token verification failed:", error);
  //     // Don't throw error here, just means user is not authenticated
  //   }
  // }

  return {
    db: dbInstance,
    // user, // Add user if authenticated
  };
};

// 2. Initialize tRPC
const t = initTRPC.context<Context>().create();

// Middleware for logging (optional)
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  console.log(`tRPC Request: ${type} '${path}' - ${result.ok ? 'OK' : 'ERROR'} (${durationMs}ms)`);
  return result;
});

// Base procedures
const publicProcedure = t.procedure.use(loggerMiddleware);
// const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       user: ctx.user, // User is now guaranteed to be non-null
//     },
//   });
// });


// 3. Define Routers (example for decks)
// You would create separate files for each resource's router (e.g., `deckRouter.ts`, `cardRouter.ts`)
// and import them here for a larger application.

const deckRouter = t.router({
  getDecks: publicProcedure.query(async ({ ctx }) => {
    const decks = await ctx.db.collection('decks').find({}).toArray();
    // Ensure _id is a string if your client expects it (MongoDB _id is an ObjectId)
    return decks.map(deck => ({ ...deck, _id: deck._id.toString() }));
  }),
  // Example: Get a single deck
  // getDeckById: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     // You'll need to import ObjectId from 'mongodb' to query by _id
  //     // import { ObjectId } from 'mongodb';
  //     // const deck = await ctx.db.collection('decks').findOne({ _id: new ObjectId(input.id) });
  //     // if (!deck) {
  //     //   throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found' });
  //     // }
  //     // return { ...deck, _id: deck._id.toString() };
  //     return { id: input.id, name: "Sample Deck (from tRPC)", cards: [] }; // Placeholder
  //   }),
  // Example: Create a deck (Mutation)
  // createDeck: protectedProcedure // Or publicProcedure if creation is public
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     const newDeck = { name: input.name, cards: [], userId: ctx.user?.id }; // associate with user if protected
  //     const result = await ctx.db.collection('decks').insertOne(newDeck);
  //     return { ...newDeck, _id: result.insertedId.toString() };
  //   }),
});

const cardRouter = t.router({
  // ... procedures for cards (getCardsForDeck, createCard, updateCard, etc.)
});

// 4. Merge all routers into a single AppRouter
const appRouter = t.router({
  deck: deckRouter,
  card: cardRouter,
  healthcheck: publicProcedure.query(() => 'Server healthy!'),
});

// Export the type of the AppRouter, this will be used on the client.
export type AppRouter = typeof appRouter;

// 5. Create and start the HTTP server
const { server, listen } = createHTTPServer({
  middleware: cors(), // Enable CORS for your Preact app's origin
  router: appRouter,
  createContext,
});

const port = Number(process.env.TRPC_PORT) || 3001; // Get port from .env or default
listen(port)
  .then(() => {
    console.log(`tRPC server listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error('Failed to start tRPC server:', err);
  });