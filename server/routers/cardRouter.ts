// import { router, protectedProcedure, publicProcedure } from '../trpc';
// import { z } from 'zod';
// import { TRPCError } from '@trpc/server';

// const { getDb } = require('../connect.cjs');

// export const cardRouter = router({
//   getMyDecksAndCards: protectedProcedure.query(async ({ ctx }) => {
//     const db = await getDb();
//     const decks = await db.collection('CardData').find({ userId: ctx.user.uid }).toArray();
//     return decks;
//   }),

//   getDeckById: publicProcedure
//     .input(z.object({ deckId: z.string() }))
//     .query(async ({ input }) => {
//       const db = await getDb();
//       const deck = await db.collection('CardData').findOne({ id: input.deckId });
//       if (!deck) {
//         throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found.' });
//       }
//       return deck;
//     }),

//   createDeck: protectedProcedure
//     .input(z.object({
//       name: z.string().min(1),
//     }))
//     .mutation(async ({ input, ctx }) => {
//       const db = await getDb();
//       const newDeck = {
//         id: `deck_${new Date().getTime()}_${Math.random().toString(36).substring(2,9)}`,
//         userId: ctx.user.uid,
//         name: input.name,
//         cards: [],
//         createdAt: new Date(),
//       };
//       const result = await db.collection('CardData').insertOne(newDeck);
//       return { ...newDeck, _id: result.insertedId };
//     }),

//   addCardToDeck: protectedProcedure
//     .input(z.object({
//       deckId: z.string(),
//       front: z.string().min(1),
//       back: z.string().min(1),
//     }))
//     .mutation(async ({ input, ctx }) => {
//       const db = await getDb();
//       const cardId = `card_${new Date().getTime()}_${Math.random().toString(36).substring(2,9)}`;
//       const newCard = {
//         id: cardId,
//         front: input.front,
//         back: input.back,
//       };

//       const result = await db.collection('CardData').updateOne(
//         { id: input.deckId, userId: ctx.user.uid },
//         { $push: { cards: newCard } }
//       );

//       if (result.matchedCount === 0) {
//         throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found or you do not own this deck.' });
//       }
//       if (result.modifiedCount === 0) {
//         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not add card to deck.' });
//       }
//       return { success: true, cardId: newCard.id };
//     }),

//   deleteDeck: protectedProcedure
//     .input(z.object({ deckId: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       const db = await getDb();
//       const result = await db.collection('CardData').deleteOne({
//         id: input.deckId,
//         userId: ctx.user.uid,
//       });

//       if (result.deletedCount === 0) {
//         throw new TRPCError({
//           code: 'NOT_FOUND',
//           message: 'Deck not found or you do not have permission to delete it.',
//         });
//       }
//       return { success: true, deletedDeckId: input.deckId };
//     }),

//   updateDeckName: protectedProcedure
//     .input(z.object({
//       deckId: z.string(),
//       name: z.string().min(1),
//     }))
//     .mutation(async ({ input, ctx }) => {
//       const db = await getDb();
//       const filter = { id: input.deckId, userId: ctx.user.uid };
//       const update = { $set: { name: input.name } };

//       const result = await db.collection('CardData').updateOne(filter, update);

//       if (result.matchedCount === 0) {
//         throw new TRPCError({
//           code: 'NOT_FOUND',
//           message: 'Deck not found or you do not have permission to edit it.',
//         });
//       }

//       if (result.modifiedCount === 0 && result.matchedCount === 1) {
        
//       }

//       const updatedDeck = await db.collection('CardData').findOne(filter);
//       if (!updatedDeck) {
//          // Should not happen if matchedCount was 1, but as a safeguard
//         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve updated deck.' });
//       }
//       return updatedDeck;
//     }),
// });