import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid'
import ProductCard from '@/components/catalog/productsGrid/ProductCard'
import { ProductInterface } from '@/models/product/types/productInterface'
import React from 'react'

interface PCRecommendationsProps {
    indProductSection: boolean;
    isLoading: boolean;
    data: {
        success: boolean;
        error?: string | undefined;
        products?: ProductInterface[];
    } | undefined
}

export default function PCRecommendations({indProductSection, isLoading, data}: PCRecommendationsProps) {
    return (
        <div className={`${indProductSection ? "mb-42" : "mb-8"} col-span-full grid grid-cols-15 gap-x-6`}>
                {
                    isLoading || !data?.products ? <LoadingGrid gridLayout={true} length={5} /> :
                    data?.products.map((product: ProductInterface, index: number) => (
                            <ProductCard category={null} key={index} product={product} />
                    ))
                }
        </div>
    )
}
