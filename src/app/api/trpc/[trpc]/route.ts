import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server";
import connectMongo from "@/lib/connect-mongo";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
        await connectMongo();
        return {}
    },
  });

export { handler as GET, handler as POST };