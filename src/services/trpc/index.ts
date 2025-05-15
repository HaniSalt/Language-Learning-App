import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query';
import type { AppRouter } from '../../../server/routers/_app';
import { AuthContextType, useAuth } from '../../contexts/authContexts/index';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const createTrpcClient = (getAuthToken: () => Promise<string | null>) => 
    {
    return trpc.createClient
    ({
        transformer: superjson,
        links: [
        loggerLink({
            enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
            url: 'http://localhost:4000/trpc',
            async headers() {
            const token = await getAuthToken();
            if (token) {
                return {
                authorization: `Bearer ${token}`,
                };
            }
            return {};
            },
        }),
        ],
    });
};