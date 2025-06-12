import { ProductInterface } from '@/models/product/types/productInterface'
import React, { Fragment, useState } from 'react'
import ProductCard from './ProductCard'
import Controls from './Controls'
import ListProductCard from './ListProductCard'
import LoadingGrid from './LoadingGrid'
import SortBy from '@/lib/enums/SortBy'
import { Categories } from '@/lib/enums/Categories'
import { useTranslations } from 'next-intl'

interface ProductsGridProps {
    products: ProductInterface[],
    loading: boolean,
    setSortBy: (v: SortBy) => void,
    category: Categories | null,
    setSidebarOpen: (v: boolean) => void,
    isSidebarOpen: boolean,
    searchText: string | null,
    countProducts: number
}

export default function ProductsGrid({products, loading, setSortBy, category, setSidebarOpen, isSidebarOpen, searchText, countProducts}: ProductsGridProps) {
    const [gridLayout, setGridLayout] = useState(true);

    const t = useTranslations('CatalogPage.ProductsSection');

  return (
    <div className='col-span-full lg:col-start-4 lg:col-span-12 grid grid-cols-8 lg:grid-cols-12 mt-16 lg:mt-12 gap-x-2 lg:gap-y-6 lg:gap-6 h-fit min-h-screen'>
        <Controls gridLayout={gridLayout} setGridLayout={setGridLayout} setSortBy={setSortBy} setSidebarOpen={setSidebarOpen} isSidebarOpen={isSidebarOpen} searchText={searchText} countProducts={countProducts}/>
        <div className='col-span-full grid grid-cols-8 lg:grid-cols-12 gap-x-2 gap-y-6 lg:gap-6'>
            {
                loading ? 
                (
                    <LoadingGrid gridLayout={gridLayout} length={8}/> 
                ) : (
                    products.map((product, index) => {
                        return (
                            <Fragment key={index}>
                                {
                                    products[index].relevance < 1 && products[index - 1] && products[index - 1].relevance > 0 && 
                                    <>
                                        {
                                            gridLayout && <div key={'line' + index} className='col-span-full h-[1px] w-full bg-black'></div>
                                        }
                                        <p className='col-span-full font-manrope text-2xl leading-7 uppercase font-semibold'>{t("general")}</p>
                                    </>
                                }
                                {
                                    gridLayout ? <ProductCard section='CATALOG' category={category} product={product} newLine={products[index].relevance < 1 && products[index - 1] && products[index - 1].relevance > 0} /> : <ListProductCard key={index} product={product}/>
                                }
                            </Fragment>
                        )
                    })
                )
            }
        </div>
    </div>
  )
}
