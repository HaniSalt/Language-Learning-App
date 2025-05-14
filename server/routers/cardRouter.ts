// server/routers/cardRouter.ts
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod'; // For input validation
import { TRPCError } from '@trpc/server';

// Import the getDb function properly from the CommonJS module
const { getDb } = require('../connect.cjs');

export const cardRouter = router({
  // Procedure to get cards for the logged-in user
  getMyDecksAndCards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    // Assuming your CardData collection stores decks, and each deck has a userId
    const decks = await db.collection('CardData').find({ userId: ctx.user.uid }).toArray();
    return decks; // Returns an array of deck objects, each containing cards
  }),

  // Example: Get a specific deck (could be public if you allow sharing)
  getDeckById: publicProcedure
    .input(z.object({ deckId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const deck = await db.collection('CardData').findOne({ id: input.deckId }); // Assuming 'id' is your deck's unique ID field
      if (!deck) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found.' });
      }
      return deck;
    }),

  // Example: Add a new deck
  createDeck: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const newDeck = {
        id: `deck_${new Date().getTime()}_${Math.random().toString(36).substring(2,9)}`, // Or use MongoDB ObjectId
        userId: ctx.user.uid,
        name: input.name,
        cards: [],
        createdAt: new Date(),
      };
      const result = await db.collection('CardData').insertOne(newDeck);
      // If using MongoDB's auto-generated _id, you might want to return that
      return { ...newDeck, _id: result.insertedId };
    }),

  // Add more procedures for adding cards to a deck, updating, deleting, etc.
  addCardToDeck: protectedProcedure
    .input(z.object({
      deckId: z.string(),
      front: z.string().min(1),
      back: z.string().min(1),
      // Add image/audio fields if necessary
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const cardId = `card_${new Date().getTime()}_${Math.random().toString(36).substring(2,9)}`;
      const newCard = {
        id: cardId,
        front: input.front,
        back: input.back,
      };

      const result = await db.collection('CardData').updateOne(
        { id: input.deckId, userId: ctx.user.uid }, // Ensure user owns the deck
        { $push: { cards: newCard } }
      );

      if (result.matchedCount === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found or you do not own this deck.' });
      }
      if (result.modifiedCount === 0) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not add card to deck.' });
      }
      return { success: true, cardId: newCard.id };
    }),
});