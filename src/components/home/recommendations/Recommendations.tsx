'use client'

import { trpc } from '@/app/_trpc/client';
import SeeMoreButton from '@/components/buttons/SeeMoreButton';
import React, { useEffect, useState } from 'react'
import PCRecommendations from './PCRecommendations';
import MobileRecommendations from './MobileRecommendations';

interface RecommendationsInterface {
    indProductSection?: boolean
}

export default function Recommendations({indProductSection = false}: RecommendationsInterface) {
    const { data, isLoading } = trpc.products.getRecProduct.useQuery();
    const [isDesktop, setIsDesktop] = useState(false);
  
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
            <h3 className={`${indProductSection ? "border-t border-black text-[2rem] leading-9 pt-6 mb-8" : "text-2xl lg:text-3xl leading-7 lg:leading-11 text-center mb-8 lg:mb-12"} col-span-full font-manrope uppercase font-semibold`}>RECOMANDĂRILE NOASTRE</h3>
            {
                isDesktop ? 
                <PCRecommendations data={data} indProductSection={indProductSection} isLoading={isLoading} /> :
                <MobileRecommendations data={data} isLoading={isLoading} />
            }
           {!indProductSection && <SeeMoreButton className='mb-24 lg:mb-42' />}
        </>
    )
}