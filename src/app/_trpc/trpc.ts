import { AppRouter } from '@/server';
import { createTRPCContext } from '@trpc/tanstack-react-query';
 
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();