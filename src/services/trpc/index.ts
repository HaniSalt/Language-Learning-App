    import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query';
    import type { AppRouter } from '../../../server/routers/_app'; // Adjust path to your server's AppRouter
    import { AuthContextType, useAuth } from '../../contexts/authContexts/index'; // Import your auth context
    import superjson from 'superjson'; // If you used it on the server

    export const trpc = createTRPCReact<AppRouter>();

    // This function will be used to create the trpcClient instance dynamically
    // based on the auth state.
    export const createTrpcClient = (getAuthToken: () => Promise<string | null>) => {
    return trpc.createClient({
        transformer: superjson, // Make sure this matches server transformer
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