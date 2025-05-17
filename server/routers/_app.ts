import { router } from '../trpc';
// import { cardRouter } from './cardRouter';
import { userRouter } from './userRouter';

export const appRouter = router({
  // cards: cardRouter, 
    user: userRouter
});

export type AppRouter = typeof appRouter;