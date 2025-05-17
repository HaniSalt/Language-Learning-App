import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { MongoClient } from 'mongodb';

// Load environment variables
const ATLAS_URI = process.env.ATLAS_URI;

export const userRouter = router({
  saveUser: publicProcedure
    .input(z.object({
      userId: z.string()
    }))
    .mutation(async ({ input }) => {
      const { userId } = input;
      // Create MongoDB client
      const client = new MongoClient(ATLAS_URI as string);
      
      try {
        await client.connect();
        const db = client.db("ÖnLab");
        const usersCollection = db.collection("users");
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ userId });
        
        if (!existingUser) {
          // User doesn't exist, insert new user
          const result = await usersCollection.insertOne({
            userId,
            createdAt: new Date(),
            decks: [] // Initialize with empty decks array
          });
          
          return {
            success: true,
            isNewUser: true,
            userId
          };
        }
        
        return {
          success: true,
          isNewUser: false,
          userId
        };
      } catch (error) {
        console.error("Error saving user to MongoDB:", error);
        return {
          success: false,
          error: "Failed to save user"
        };
      } finally {
        await client.close();
      }
    }),
    
  getUserDecks: publicProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      const client = new MongoClient(ATLAS_URI as string);
      
      try {
        await client.connect();
        const db = client.db("ÖnLab");
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({ userId });
        
        if (!user) {
          return {
            success: false,
            error: "User not found"
          };
        }
        
        return {
          success: true,
          decks: user.decks || []
        };
      } catch (error) {
        console.error("Error fetching user decks:", error);
        return {
          success: false,
          error: "Failed to fetch user decks"
        };
      } finally {
        await client.close();
      }
    })
});