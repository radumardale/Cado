import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { cache } from "react";

const t = initTRPC.create();

export const createTRPCContext = cache(async () => {
    const session = await getServerSession();
 
  return {
    session,
  };
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;