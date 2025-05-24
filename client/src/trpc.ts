import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '../../server/src/router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});