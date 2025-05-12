import { Link, useRouter } from '@/i18n/navigation'
import { CartInterface } from '@/lib/types/CartInterface'
import { addToCart } from '@/lib/utils'
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface SearchProductsProps {
    products: ProductInterface[] | undefined | null,
    recProducts: ProductInterface[] | undefined | null,
    productsCount: number | undefined | null,
    searchText: string,
    closeMenu: () => void,
    isLoading: boolean
}

export default function SearchProducts({products, productsCount, searchText, closeMenu, recProducts}: SearchProductsProps) {
    const locale = useLocale();
    const router = useRouter();
    const [value, setValue] = useLocalStorage<CartInterface[]>('cart', []);
    const [isImageLoaded, setImageLoaded] = useState(false);
    const [localProducts, setLocalProducts] = useState<ProductInterface[]>(recProducts ? recProducts : []);
    const [localCount, setLocalCount] = useState<number>(5);

    useEffect(() => {
        if (products) setLocalProducts(products);
    }, [products])

    useEffect(() => {
        if (productsCount !== undefined && productsCount !== null) setLocalCount(productsCount);
    }, [productsCount])

  return (
    <div className='col-span-full h-full lg:h-97.5 lg:mx-auto'>
        {
            localCount > 0 &&
            <button className='font-manrope font-semibold border border-black rounded-3xl w-fit px-6 h-12 flex items-center gap-2 mx-auto cursor-pointer mb-4' onClick={() => {router.push({pathname: "/catalog", query: (productsCount !== undefined && productsCount !== null && productsCount > 0) ? {keywords: searchText.split(/\s+/).filter(word => word.length > 1).join("+")} : undefined}); closeMenu()}}>
                <span className='font-semibold leading-5 font-manrope'>Vezi toate rezultatele</span>
                <span className='text-gray font-semibold font-manrope leading-5'>({localCount})</span>
            </button>
        }
        <div className='col-span-full relative h-full'>
            {
                localCount == 0 &&
                <div className='absolute left-1/2 top-1/2 -translate-1/2 w-full lg:w-auto px-13 lg:px-0 flex flex-col items-center'>
                    <Image unoptimized src="/icons/shopping-bag-sad.svg" alt='sad shopping bag' width={48} height={48} className='size-12' />
                    <p className='mt-2 text-sm leading-4 lg:leading-5 lg:text-base text-center mb-12'>Ups! Nimic nu se potrivește cu ce ai căutat. Încearcă din nou sau vezi toate produsele disponibile.</p>
                    <Link href={'/catalog'} className='font-manrope font-semibold bg-blue-2 rounded-3xl w-fit px-6 py-3.5 flex gap-2 mx-auto cursor-pointer hover:opacity-75 transition duration-300' onClick={() => {router.push({pathname: "/catalog", query: (productsCount !== undefined && productsCount !== null && productsCount > 0) ? {keywords: searchText.split(/\s+/).filter(word => word.length > 1).join("+")} : undefined}); closeMenu()}}>
                        <span className='font-semibold leading-5 font-manrope text-white'>Vezi întreg catalog</span>
                    </Link>
                </div>
            }
            <div className='grid grid-cols-2 lg:flex gap-x-2 gap-y-6 lg:gap-y-0 lg:w-228'>
                {
                    localCount > 0 &&
                    localProducts.map((product, index) => {
                        return (
                            <div key={index} className='w-44 flex flex-col group' onClick={() => {router.push({pathname: "/catalog/product/[id]", params: {id: product.custom_id}})}}>
                                <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-lg before:lg:rounded-2xl before:transition before:duration-300 before:z-10 mb-2'>
                                    {
                                        product.sale && product.sale.active &&
                                        <div className='absolute top-2 right-2 h-8 flex items-center justify-center bg-red px-4 rounded-3xl text-white z-[5]'>
                                            <span className='font-semibold text-xs leading-3.5'>Reducere</span>
                                        </div>
                                    }
                                    <Image unoptimized onLoad={() => setImageLoaded(true)} src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full aspect-[339/425] object-cover rounded-lg object-top lg:rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
                                    <Image unoptimized src={product.images[1]} width={798} height={1198} alt={product.title.ro} className={`${isImageLoaded ? "" : "hidden"} absolute left-0 top-0 h-full w-full object-cover rounded-lg object-top lg:rounded-2xl transition duration-300 -z-10`}/>  
                                    <button onClick={(e) => {e.stopPropagation(); addToCart(product, 1, value, setValue, locale)}} className='absolute left-2 -bottom-10 h-10 w-[calc(100%-1rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-2 font-semibold cursor-pointer hover:bg-lightgray text-sm'>Adaugă în coș</button>
                                </div>
                                <Link href={{pathname: "/catalog/product/[id]", params: {id: product.custom_id}}} className='group cursor-pointer flex flex-col flex-1 justify-between'>
                                    <p className={`font-manrope font-semibold mb-2 text-left text-sm leading-4`}>{product.title[locale]}</p>
                                    <div className={`flex gap-1 items-center`}>
                                        {
                                            product.sale && product.sale.active &&
                                            <p className='text-gray text-sm leading-4 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                                        }
                                        <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit px-2 py-1.5`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
                                    </div>
                                </Link>
                            </div>
                        )
                    }) 
                }
            </div>
        </div>
    </div>
  )
}
