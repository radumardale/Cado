'use client'

import React from 'react'
import ProductImages from './ProductImages'
import ProductContent from './ProductContent'
import { trpc } from '@/app/_trpc/client'
import Header from '../header/Header'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Categories } from '@/lib/enums/Categories'
import SimiliarProducts from './SimilarProducts'

interface ProductInfoInterface {
    id: string,
}

export default function ProductInfo({id}: ProductInfoInterface) {
    const {data} = trpc.products.getProductById.useQuery({id: id});
    const locale = useLocale();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category") as Categories | null;

    if (!data?.product) {
        return;
    }

    return (
        <>
            <Header category={categoryParam ? categoryParam : data.product.categories[0]} breadcrumbs productInfo={{id: data.product.custom_id, title: data.product.title[locale]}}/>
            <div className='grid grid-cols-8 lg:grid-cols-15 col-span-8 lg:col-span-15 gap-x-6'>
                <ProductImages product={data.product}/>
                <div className='col-span-1 hidden lg:block'></div>
                <ProductContent product={data.product}/>
            </div>
            <SimiliarProducts category={categoryParam ? categoryParam : data.product.categories[0]} />
        </>
    )
}
