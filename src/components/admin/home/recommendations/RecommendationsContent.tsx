'use client';
import { useTRPC } from '@/app/_trpc/client';
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid';
import { ProductInterface } from '@/models/product/types/productInterface';
import React, { useState } from 'react'
import AdminRecommendationsCard from './AdminRecommendationsCard';
import AdminRecommnendationsSearch from './AdminRecommendationsSearch';

import { useQuery } from "@tanstack/react-query";

export default function RecommendationsContent() {
    const trpc = useTRPC();
    const { data, isLoading, refetch } = useQuery(trpc.products.getRecProduct.queryOptions());
    const [isAddProductOpen, setAddProductOpen] = useState(false);
    const [replaceProduct, setReplaceProduct] = useState<ProductInterface | null>(null)

    const handleRefresh = () => {
        refetch();
    };

    const closePopup = () => {
        setAddProductOpen(false);
    }

    return (
      <>
          {
              isAddProductOpen && replaceProduct &&
              <div className='fixed top-0 left-0 w-full h-full bg-black/75 z-[60] flex justify-center items-center' onMouseDown={() => {setAddProductOpen(false)}}>
                  <div className='py-16 px-34 rounded-3xl bg-white' onMouseDown={(e) => {e.stopPropagation()}}>
                     <AdminRecommnendationsSearch replaceProduct={replaceProduct} handleRefresh={handleRefresh} closePopup={closePopup}/>
                  </div>
              </div>
          }
          <h2 className='col-span-full font-manrope font-semibold text-3xl leading-11 mb-12'>RECOMANDĂRILE NOASTRE</h2>
          <div className={`col-span-full grid grid-cols-15 gap-x-6`}>
                  {
                      isLoading || !data?.products ? <LoadingGrid gridLayout={true} length={5} /> :
                      data?.products.map((product: {product: ProductInterface}, index: number) => (
                              <AdminRecommendationsCard key={index} product={product.product} setAddProductOpen={() => {setAddProductOpen(true); setReplaceProduct(product.product)}} />
                      ))
                  }
          </div>
      </>
    )
}
