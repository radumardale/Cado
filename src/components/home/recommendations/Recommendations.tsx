'use client'

import { trpc } from '@/app/_trpc/client';
import SeeMoreButton from '@/components/buttons/SeeMoreButton';
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { ProductInterface } from '@/models/product/types/productInterface';
import React from 'react'

interface RecommendationsInterface {
    indProductSection?: boolean
}

export default function Recommendations({indProductSection = false}: RecommendationsInterface) {
    const { data, isLoading } = trpc.products.getRecProduct.useQuery();

    return (
        <>
            <h3 className={`${indProductSection ? "border-t border-black text-[2rem] leading-9 pt-6 mb-8" : "text-3xl leading-11 text-center mb-12"} col-span-full font-manrope uppercase font-semibold`}>RECOMANDĂRILE NOASTRE</h3>
            <div className={`${indProductSection ? "mb-42" : "mb-8"} col-span-full grid grid-cols-15 gap-x-6`}>
                {
                    isLoading ? <LoadingGrid gridLayout={true} length={5} /> :
                    data?.products.map((product: ProductInterface, index: number) => (
                        <ProductCard category={null} key={index} product={product} />
                    ))
                }
            </div>
           {!indProductSection && <SeeMoreButton className='mb-42' />}
        </>
    )
}