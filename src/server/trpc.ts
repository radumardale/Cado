import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create({
});

export const createTRPCContext = async () => {
  try {
    const session = await getServerSession();
    return { session };
  } catch (error) {
    console.error("Session error:", error);
    return { session: null };
  }
};

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;