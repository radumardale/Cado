'use client'

import { productsLimit } from '@/lib/constants';
import React, { useEffect, useRef, useState } from 'react'
import OrdersTable from './OrdersTable';
import { useOrdersSearchStore } from '@/states/admin/OrdersSearchState';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useTRPC } from '@/app/_trpc/client';

export default function OrdersContent() {
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchText = useOrdersSearchStore((store) => store.search);
    const startDate = useOrdersSearchStore((store) => store.startDate);
    const endDate = useOrdersSearchStore((store) => store.endDate);
    const sortBy = useOrdersSearchStore((store) => store.sortBy);
    const observerRef = useRef<HTMLDivElement>(null);
    const [queryText, setQueryText] = useState('');
    const trpc = useTRPC();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(trpc.order.getAllOrders.infiniteQueryOptions(
        {
            limit: productsLimit,
            searchQuery: queryText.length > 2 ? queryText.split(" ").join("+") : undefined,
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
            sortBy: sortBy
        },
        { 
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    ));

    const [queryProducts, setQueryProducts] = useState(data?.pages.flatMap(page => page.orders) || []);

    useEffect(() => {
        if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
    
        closeTimeoutRef.current = setTimeout(() => {
          setQueryText(searchText);
        }, 200)
    
        return () => {
          if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
        };
    }, [searchText])

    useEffect(() => {
        if (data?.pages) setQueryProducts(data.pages.flatMap(page => page.orders));
    }, [data?.pages])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px 200px 0px"
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
        <OrdersTable queryOrders={queryProducts}/>
        <div 
            ref={observerRef} 
            className="col-span-full lg:col-span-12 flex justify-center"
        >
            {isFetchingNextPage && (
                <div className="animate-pulse flex justify-center py-4">
                    <div className="h-4 w-4 bg-blue-1 rounded-full mr-1"></div>
                    <div className="h-4 w-4 bg-blue-1 rounded-full mr-1 animate-pulse-delay-200"></div>
                    <div className="h-4 w-4 bg-blue-1 rounded-full animate-pulse-delay-400"></div>
                </div>
            )}
        </div>
    </>
  )
}
