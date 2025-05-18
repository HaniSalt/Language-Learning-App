// server/routers/userRouter.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Users } from '../models/userModel';

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1, "Username is required"),
        userId: z.string().min(1, "Firebase User ID is required"),
        dateOfCreation: z.string().datetime("Invalid date format for creation date"),
      })
    )
    .mutation(async ({ input }) => {
      const { userName, userId, dateOfCreation } = input;

      const existingUser = await Users.findOne({ userId });
      if (existingUser) {
        console.log('User already exists in MongoDB:', existingUser);
        return {
          message: 'User already exists in MongoDB.',
          data: { 
            id: existingUser._id.toString(),
            userName: existingUser.userName,
            userId: existingUser.userId,
            dateOfCreation: existingUser.dateOfCreation,
          },
          isExisting: true,
        };
      }

      const newUser = new Users({
        userName,
        userId,
        dateOfCreation,
      });

      await newUser.save();
      console.log('User data saved to MongoDB via tRPC:', newUser);
      return {
        message: 'User registered and data saved successfully via tRPC!',
        data: {
          id: newUser._id.toString(),
          userName: newUser.userName,
          userId: newUser.userId,
          dateOfCreation: newUser.dateOfCreation,
        },
        isExisting: false,
      };
    }),
});