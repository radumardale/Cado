'use client'

import { trpc } from '@/app/_trpc/client';
import SeeMoreButton from '@/components/buttons/SeeMoreButton';
import React, { useEffect, useState } from 'react'
import PCRecommendations from './PCRecommendations';
import MobileRecommendations from './MobileRecommendations';
import { ProductInterface } from '@/models/product/types/productInterface';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';

interface RecommendationsInterface {
    indProductSection?: boolean
}

export default function Recommendations({indProductSection = false}: RecommendationsInterface) {
    const { data, isLoading } = trpc.products.getRecProduct.useQuery();
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();
        
        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        setIsMounted(true);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            <h3 className={`${indProductSection ? "lg:border-t lg:border-black text-2xl lg:text-[2rem] leading-7 lg:leading-9 lg:pt-6 mb-8 text-center lg:text-left" : "text-2xl lg:text-3xl leading-7 lg:leading-11 text-center mb-8 lg:mb-12"} col-span-full font-manrope uppercase font-semibold`}>PRODUSE RECOMANDATE</h3>
            {
                !isMounted ? 
                <div className={`${indProductSection ? "mb-24 lg:mb-42" : "mb-8"} col-span-8 -mr-4 lg:mr-0 overflow-hidden lg:overflow-auto lg:col-span-full lg:grid lg:grid-cols-15 lg:gap-x-6`}>
                    <div className='-mr-12 lg:mr-0 rounded-tl-2xl lg:col-span-full'>
                        <div className='w-full lg:col-span-full lg:grid lg:grid-cols-15 lg:gap-x-6 flex flex-nowrap'>
                            {
                                data?.products.map((product: {product: ProductInterface}, index: number) => (
                                    <div className='min-w-1/2 lg:min-w-0 pr-2 lg:pr-0 lg:col-span-3 h-auto mb-1 lg:mb-0' key={index}>
                                        <ProductCard category={null} product={product.product} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div> :
                isDesktop ? 
                <PCRecommendations data={data} indProductSection={indProductSection} isLoading={isLoading} /> :
                <MobileRecommendations data={data} isLoading={isLoading} indProductSection={indProductSection}/>
            }
           {!indProductSection && <SeeMoreButton className='mb-24 lg:mb-42' />}
        </>
    )
}