import { ProductInterface } from '@/models/product/types/productInterface'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import Controls from './Controls'
import ListProductCard from './ListProductCard'
import { motion, useAnimate } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils'
import LoadingGrid from './LoadingGrid'
import SortBy from '@/lib/enums/SortBy'
import { Categories } from '@/lib/enums/Categories'

interface ProductsGridProps {
    products: ProductInterface[],
    loading: boolean,
    setSortBy: (v: SortBy) => void,
    sortBy: SortBy,
    category: Categories | null
}

export default function ProductsGrid({products, loading, setSortBy, sortBy, category}: ProductsGridProps) {
    const [gridLayout, setGridLayout] = useState(true);
    const [scope, animate] = useAnimate()

    useEffect(() => {
        if (loading) return;
        const controls = animate( scope.current, { y: [20, 0], opacity: [0, 1] }, {ease: easeInOutCubic, duration: .3} );
    
        return () => controls.stop();
      }, [gridLayout, loading])

  return (
    <motion.div className='col-start-4 col-span-10 2xl:col-span-12 grid grid-cols-12 mt-12 gap-6 h-fit'>
        <Controls gridLayout={gridLayout} setGridLayout={setGridLayout} setSortBy={setSortBy} sortBy={sortBy}/>
        <div ref={scope} className='col-span-full grid grid-cols-12 gap-6'>
            {
                loading ? 
                (
                    <LoadingGrid gridLayout={gridLayout} length={8}/> 
                ) : (
                    products.map((product, index) => {
                        return (
                            gridLayout ? <ProductCard category={category} key={index} product={product} /> : <ListProductCard key={index} product={product}/>
                        )
                    })
                )
            }
        </div>
    </motion.div>
  )
}
