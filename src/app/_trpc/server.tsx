import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
// import { createTRPCContext } from '@/server/trpc';
import { appRouter } from '@/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: {},
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={JSON.parse(JSON.stringify(dehydrate(queryClient)))}>
      {props.children}
    </HydrationBoundary>
  );
}
/**
 * Prefetch tRPC queries on the server.
 * Note: Uses `any` in generic constraint due to tRPC's complex type system requirements.
 * The type parameter must satisfy tRPC's ResolverDef constraint which cannot be
 * properly expressed with `unknown`. This is a limitation of TypeScript's type system
 * when working with tRPC's deeply nested generics.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    // Type assertion needed: TanStack Query types don't properly narrow based on type discriminator
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.prefetchQuery(queryOptions);
  }
}
