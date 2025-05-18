// import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
// import superjson from 'superjson';

// // Helper to get the base URL dynamically
// const getBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return '';
//   }
  
//   const port = process.env.CLIENT_PORT || 3001;
//   return `http://localhost:${port}`;
// };

// // Create a generic tRPC client without specific router types
// export const trpcClient = createTRPCClient({
//   transformer: superjson,
//   links: [
//     loggerLink({
//       enabled: (opts) => 
//         process.env.NODE_ENV === 'development' || 
//         (opts.direction === 'down' && opts.result instanceof Error),
//     }),
//     httpBatchLink({
//       url: `${getBaseUrl()}/api/trpc`,
//       // You can add headers here if needed
//       headers: () => {
//         const headers = new Headers();
        
//         // Add any headers you might need
//         if (typeof window !== 'undefined') {
//           // Add client-side specific auth token if available
//           const token = localStorage.getItem('token');
//           if (token) {
//             headers.append('Authorization', `Bearer ${token}`);
//           }
//         }
        
//         return Object.fromEntries(headers.entries());
//       },
//     }),
//   ],
// });

// export function typedClient<T>() {
//   return trpcClient as any as T;
// }