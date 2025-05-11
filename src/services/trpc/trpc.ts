import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/trpcServer';

export const trpc = createTRPCReact<AppRouter>();