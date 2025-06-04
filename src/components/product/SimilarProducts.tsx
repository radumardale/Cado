'use client';
import { useTRPC } from '@/app/_trpc/client';
import { Categories } from '@/lib/enums/Categories';
import React, { useEffect, useState } from 'react'
import PcSimilarProducts from './PcSimilarProducts';
import MobileSimilarProducts from './MobileSimilarProducts';
import { ProductInterface } from '@/models/product/types/productInterface';
import ProductCard from '../catalog/productsGrid/ProductCard';

import { useQuery } from "@tanstack/react-query";

interface SimiliarProductsInterface {
    category: Categories,
    productId: string
}

export default function SimiliarProducts({category, productId}: SimiliarProductsInterface) {
    const trpc = useTRPC();
    const { data, isLoading } = useQuery(
        trpc.products.getSimilarProducts.queryOptions({category: category, productId})
    );
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();
        setIsMounted(true);

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            <h3 className={"text-center lg:text-left lg:border-t lg:border-black text-2xl lg:text-[2rem] leading-7 lg:leading-9 lg:pt-6 mb-8 col-span-full font-manrope uppercase font-semibold"}>Produse similare</h3>
            {
                  !isMounted ? 
                  <div className='col-span-8 -mr-4 lg:mr-0 overflow-hidden lg:overflow-auto lg:col-span-full lg:grid lg:grid-cols-15 lg:gap-x-6 mb-24'>
                      <div className='-mr-12 lg:mr-0 rounded-tl-2xl lg:col-span-full'>
                          <div className='w-full lg:col-span-full lg:grid lg:grid-cols-15 lg:gap-x-6 flex flex-nowrap'>
                              {
                                  data?.products.map((product: ProductInterface, index: number) => (
                                      <div className='min-w-1/2 lg:min-w-0 pr-2 lg:pr-0 lg:col-span-3 h-auto mb-1 lg:mb-0' key={index}>
                                          <ProductCard category={null} product={product} />
                                      </div>
                                  ))
                              }
                          </div>
                      </div>
                  </div> :
                isDesktop ? 
                <PcSimilarProducts data={data} category={category} isLoading={isLoading} /> :
                <MobileSimilarProducts data={data} isLoading={isLoading} />
            }
        </>
    )
}