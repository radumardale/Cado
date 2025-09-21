import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';

const t = initTRPC.create({});

const enforceUserIsAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session,
      user: session.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
