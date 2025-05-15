import { router } from '../trpc';
import { cardRouter } from './cardRouter';

export const appRouter = router({
  cards: cardRouter, 
});

export type AppRouter = typeof appRouter;