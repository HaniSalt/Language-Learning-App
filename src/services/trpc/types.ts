import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter as ActualServerAppRouter } from '../../../server/routers/_app';

export type AppRouter = ActualServerAppRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;