'use client'

import { trpc } from '@/app/_trpc/client';
import { Categories } from '@/lib/enums/Categories';
import React, { useEffect, useState } from 'react'
import PcSimilarProducts from './PcSimilarProducts';
import MobileSimilarProducts from './MobileSimilarProducts';

interface SimiliarProductsInterface {
    category: Categories
}

export default function SimiliarProducts({category}: SimiliarProductsInterface) {
    const { data, isLoading } = trpc.products.getSimilarProducts.useQuery({category: category});
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  
    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();
        
        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            <h3 className={"text-center lg:text-left lg:border-t lg:border-black text-2xl lg:text-[2rem] leading-7 lg:leading-9 lg:pt-6 mb-8 col-span-full font-manrope uppercase font-semibold"}>Produse similare</h3>
            {
                isDesktop ? 
                <PcSimilarProducts data={data} category={category} isLoading={isLoading} /> :
                <MobileSimilarProducts data={data} isLoading={isLoading} />
            }
        </>
    )
}