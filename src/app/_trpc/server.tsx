/* eslint-disable  @typescript-eslint/no-explicit-any */

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
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    await queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.prefetchQuery(queryOptions);
  }
}