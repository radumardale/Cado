import { ProductInterface } from '@/models/product/types/productInterface';
import React from 'react';
import LoadingGrid from '../catalog/productsGrid/LoadingGrid';
import ProductCard from '../catalog/productsGrid/ProductCard';
import { Categories } from '@/lib/enums/Categories';

interface PcSimilarProductsProps {
  isLoading: boolean;
  data:
    | {
        success: boolean;
        error?: string | undefined;
        products?: ProductInterface[];
      }
    | undefined;
  category: Categories;
}

export default function PcSimilarProducts({ isLoading, data, category }: PcSimilarProductsProps) {
  return (
    <div className={'mb-24 col-span-full grid grid-cols-15 gap-x-6'}>
      {isLoading || !data?.products ? (
        <LoadingGrid gridLayout={true} length={5} />
      ) : (
        data?.products.map((product: ProductInterface, index: number) => (
          <ProductCard category={category} key={index} product={product} />
        ))
      )}
    </div>
  );
}
