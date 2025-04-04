'use client'

import { trpc } from '@/app/_trpc/client';
import SeeMoreButton from '@/components/buttons/SeeMoreButton';
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { ProductInterface } from '@/models/product/types/productInterface';
import React from 'react'

export default function Recommendations() {
    const { data, isLoading } = trpc.products.getRecProduct.useQuery();

    return (
        <>
            <h3 className='col-span-full text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-12'>RECOMANDĂRILE NOASTRE</h3>
            <div className='col-span-full grid grid-cols-15 gap-x-6 mb-8'>
                {
                    isLoading ? <LoadingGrid gridLayout={true} length={5} /> :
                    data?.products.map((product: ProductInterface, index: number) => (
                        <ProductCard key={index} product={product} />
                    ))
                }
            </div>
           <SeeMoreButton className='mb-42' />
        </>
    )
}