import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { DeckModel, ICard } from '../models';
import { TRPCError } from '@trpc/server';

const cardSchemaInput = z.object({
  id: z.number(),
  front: z.string(),
  back: z.string(),
  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

const deckSchemaInput = z.object({
  id: z.number(),
  name: z.string().min(1),
  cards: z.array(cardSchemaInput),
  userId: z.string().min(1),
});

export const deckRouter = router({
  getDecksByUserId: publicProcedure 
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const decks = await DeckModel.find({ userId: input.userId });
        return decks.map(deck => deck.toObject());
      } catch (error: any) {
        console.error('Error fetching decks by user ID:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch decks.' });
      }
    }),

  createDeck: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        userId: z.string().min(1),
        cards: z.array(cardSchemaInput).optional().default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newDeckId = Date.now();
        const newDeck = new DeckModel({
          id: newDeckId,
          name: input.name,
          cards: input.cards,
          userId: input.userId,
        });
        await newDeck.save();
        return newDeck.toObject();
      } catch (error: any) {
        console.error('Error creating deck:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create deck.' });
      }
    }),

  updateDeck: publicProcedure
    .input(
      z.object({
        deckId: z.number(),
        userId: z.string().min(1),
        name: z.string().min(1).optional(),
        cards: z.array(cardSchemaInput).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { deckId, userId, ...updateData } = input;
        const deck = await DeckModel.findOne({ id: deckId, userId: userId });

        if (!deck) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found or user does not have access.' });
        }

        if (updateData.name) deck.name = updateData.name;
        if (updateData.cards) deck.cards = updateData.cards as ICard[];

        await deck.save();
        return deck.toObject();
      } catch (error: any) {
        console.error('Error updating deck:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update deck.' });
      }
    }),

  deleteDeck: publicProcedure
    .input(
      z.object({
        deckId: z.number(),
        userId: z.string().min(1), // Ensure user owns the deck
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await DeckModel.findOneAndDelete({ id: input.deckId, userId: input.userId });
        if (!result) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Deck not found or user does not have access.' });
        }
        return { message: 'Deck deleted successfully' };
      } catch (error: any) {
        console.error('Error deleting deck:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete deck.' });
      }
    }),

  importDecks: publicProcedure
    .input(
      z.object({
        decks: z.array(deckSchemaInput.omit({ userId: true })),
        userId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decksWithUserId = input.decks.map(deck => ({
          ...deck,
          id: deck.id || Date.now() + Math.random(),
          userId: input.userId,
          cards: deck.cards.map(card => ({ ...card, id: card.id || Date.now() + Math.random()}))
        }));

        const uniqueIds = new Set();
        for (const deck of decksWithUserId) {
            if (uniqueIds.has(deck.id)) {
                throw new TRPCError({code: 'BAD_REQUEST', message: `Duplicate deck ID ${deck.id} in import batch.`});
            }
            uniqueIds.add(deck.id);
            const existingDeck = await DeckModel.findOne({ id: deck.id });
            if (existingDeck) {
                 throw new TRPCError({code: 'CONFLICT', message: `Deck with ID ${deck.id} already exists.`});
            }
        }

        await DeckModel.insertMany(decksWithUserId);
        return { message: 'Decks imported successfully' };
      } catch (error: any) {
        console.error('Error importing decks:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to import decks.' });
      }
    }),
});