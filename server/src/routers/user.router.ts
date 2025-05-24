import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { UserModel, DeckModel } from '../models';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  registerUser: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1),
        userId: z.string().min(1), 
        dateOfCreation: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const existingUser = await UserModel.findOne({ userId: input.userId });
        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this ID already exists.',
          });
        }

        const newUser = new UserModel({
          userName: input.userName,
          userId: input.userId,
          dateOfCreation: input.dateOfCreation,
        });
        await newUser.save();

        const defaultDecksData = [
          { id: Date.now(), name: 'Spanish Basics', cards: [{ id: Date.now() + 1, front: 'Hola', back: 'Hello' }], userId: input.userId },
          { id: Date.now() + 100, name: 'French Vocabulary', cards: [{ id: Date.now() + 101, front: 'Bonjour', back: 'Hello' }], userId: input.userId }
        ];

        await DeckModel.insertMany(defaultDecksData);

        return {
          message: 'User registered and default decks created successfully!',
          user: newUser.toObject(), // Convert Mongoose doc to plain object
        };
      } catch (error: any) {
        console.error('Error registering user:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to register user.',
        });
      }
    }),
});