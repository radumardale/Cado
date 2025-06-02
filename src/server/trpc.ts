// trpc.ts
import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { cache } from "react";
import superjson from 'superjson';
import type { NextRequest } from 'next/server';

// Update context to include req/res for caching
export const createTRPCContext = cache(async (opts?: { req?: NextRequest }) => {
  try {
    const session = await getServerSession();
    return { 
      session,
      req: opts?.req
    };
  } catch (error) {
    console.error("Session error:", error);
    return { 
      session: null,
      req: opts?.req
    };
  }
});

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;