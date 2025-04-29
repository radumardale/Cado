'use client'

import { trpc } from '@/app/_trpc/client';
import { productsLimit } from '@/lib/constants';
import { useProductsSearchStore } from '@/states/admin/ProductsSearchState';
import React, { useEffect, useRef, useState } from 'react'
import ProductsGrid from './ProductsGrid';
import ProductsTable from './ProductsTable';

export default function ProductsContent() {
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchText = useProductsSearchStore((store) => store.search);
    const sortBy = useProductsSearchStore((store) => store.sortBy);
    const gridLayout = useProductsSearchStore((store) => store.gridLayout);
    const observerRef = useRef<HTMLDivElement>(null);
    const [queryText, setQueryText] = useState('');

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.products.getAdminProducts.useInfiniteQuery({
        limit: productsLimit,
        title: queryText.length > 2 ? queryText.split(" ").join("+") : null,
        sortBy: sortBy
    },
    { 
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const [queryProducts, setQueryProducts] = useState(data?.pages.flatMap(page => page.products) || []);

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
        if (data?.pages) setQueryProducts(data.pages.flatMap(page => page.products));
    }, [data?.pages])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If the element is visible and we have more pages to load
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                // Trigger when element is 90% visible
                threshold: 0.1,
                rootMargin: "0px 0px 200px 0px" // Preload when within 200px of viewport
            }
        );

        // Start observing the sentinel element
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        // Clean up the observer
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
        {
            gridLayout ? 
            <ProductsGrid queryProducts={queryProducts}/> :
            <ProductsTable queryProducts={queryProducts}/>
        }
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
