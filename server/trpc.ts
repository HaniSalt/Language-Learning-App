import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import SuperJSON from 'superjson'; 
import { ZodError } from 'zod';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof TRPCError && error.cause.cause instanceof ZodError
            ? error.cause.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure; 