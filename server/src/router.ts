import { router } from './trpc';
import { userRouter } from './routers/user.router';
import { deckRouter } from './routers/deck.router';

export const appRouter = router({
  user: userRouter,
  deck: deckRouter,
});

export type AppRouter = typeof appRouter;