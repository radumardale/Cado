'use client'

import { trpc } from '@/app/_trpc/client';
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { Categories } from '@/lib/enums/Categories';
import { ProductInterface } from '@/models/product/types/productInterface';
import React from 'react'

interface SimiliarProductsInterface {
    category: Categories
}

export default function SimiliarProducts({category}: SimiliarProductsInterface) {
    const { data, isLoading } = trpc.products.getSimilarProducts.useQuery({category: category});
    return (
        <>
            <h3 className={"border-t border-black text-[2rem] leading-9 pt-6 mb-8 col-span-full font-manrope uppercase font-semibold"}>Produse similare</h3>
            <div className={"mb-24 col-span-full grid grid-cols-15 gap-x-6"}>
                {
                    isLoading ? <LoadingGrid gridLayout={true} length={5} /> :
                    data?.products.map((product: ProductInterface, index: number) => (
                        <ProductCard category={category} key={index} product={product} />
                    ))
                }
            </div>
        </>
    )
}