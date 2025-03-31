'use client'

import { trpc } from '@/app/_trpc/client';
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { ProductInterface } from '@/models/product/types/productInterface';
import { ArrowRight } from 'lucide-react';
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
            <div className='col-span-full flex justify-center mb-42'>
                <button className='cursor-pointer bg-blue-2 rounded-3xl h-12 px-6 text-white font-manrope font-semibold flex items-center gap-2'>
                    <span>Vezi mai multe</span>
                    <ArrowRight className='size-6'/>
                </button>
            </div>
        </>
    )
}