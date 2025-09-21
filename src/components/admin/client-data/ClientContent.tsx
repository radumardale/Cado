'use client';
import { useTRPC } from '@/app/_trpc/client';
import { productsLimit } from '@/lib/constants';
import React, { useEffect, useRef, useState } from 'react';
import ClientTable from './ClientTable';
import { useClientSearchStore } from '@/states/admin/ClientsSearchState';

import { useInfiniteQuery } from '@tanstack/react-query';

export default function ClientContent() {
  const trpc = useTRPC();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchText = useClientSearchStore(store => store.search);
  const sortBy = useClientSearchStore(store => store.sortBy);
  const observerRef = useRef<HTMLDivElement>(null);
  const [queryText, setQueryText] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.getAllClients.infiniteQueryOptions(
      {
        limit: productsLimit,
        searchQuery: queryText.length > 2 ? queryText.split(' ').join('+') : undefined,
        sortBy: sortBy,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );

  const [queryClients, setQueryClients] = useState(data?.pages.flatMap(page => page.clients) || []);

  useEffect(() => {
    if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);

    closeTimeoutRef.current = setTimeout(() => {
      setQueryText(searchText);
    }, 200);

    return () => {
      if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
    };
  }, [searchText]);

  useEffect(() => {
    if (data?.pages) setQueryClients(data.pages.flatMap(page => page.clients));
  }, [data?.pages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 200px 0px',
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <ClientTable queryClients={queryClients} />
      <div ref={observerRef} className='col-span-full lg:col-span-12 flex justify-center'>
        {isFetchingNextPage && (
          <div className='animate-pulse flex justify-center py-4'>
            <div className='h-4 w-4 bg-blue-1 rounded-full mr-1'></div>
            <div className='h-4 w-4 bg-blue-1 rounded-full mr-1 animate-pulse-delay-200'></div>
            <div className='h-4 w-4 bg-blue-1 rounded-full animate-pulse-delay-400'></div>
          </div>
        )}
      </div>
    </>
  );
}
