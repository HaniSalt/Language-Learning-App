import { router } from '../trpc';
import { cardRouter } from './cardRouter';
// Import other routers here (e.g., userRouter)

export const appRouter = router({
  cards: cardRouter, // Namespace your card routes under 'cards'
  // users: userRouter, // Example for other routes
});

// Export type definition of API
export type AppRouter = typeof appRouter;