import { ProductInterface } from '@/models/product/types/productInterface'
import { Minus, Plus } from 'lucide-react';
import { useLocale } from 'next-intl'
import React, { useEffect, useState } from 'react'
import AdditionalInfo from './AdditionalInfo';
import { useLenis } from 'lenis/react';

interface ProductContentInterface {
    product: ProductInterface
}

export default function ProductContent({product}: ProductContentInterface) {
    const locale = useLocale();
    const lenis = useLenis();
    const [productQuantity, setProductQuantity] = useState(1);

    useEffect(() => {
        lenis?.scrollTo(0, {immediate: true})
    }, [])

    return (
        <div className='col-span-5 pb-31 mt-16 sticky h-screen top-25 flex flex-col justify-between'>
            <div>
                <h1 className='font-manrope text-[2rem] font-semibold leading-9'>{product.title[locale]}</h1>
                <div className="flex items-center gap-4 my-4">
                    <div className='font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{product.price} MDL</div>
                    <div className="flex gap-2 items-center ">
                        <div className={`size-2 rounded-full ${product.stock_availability > 0 ? "bg-green" : "bg-red"}`}></div>
                        <p className={`${product.stock_availability > 0 ? "text-green" : "text-red"}`}>{product.stock_availability > 0 ? "În stoc" : "Stoc epuizat"}</p>
                    </div>
                </div>
                <p className='leading-5 whitespace-pre-line mb-8'>
                    {product.description[locale].replace(/\\n/g, '\n')}
                </p>
                <div className="grid grid-cols-5 gap-x-6 col-span-5">
                    <div className='col-span-2 flex justify-between font-manrope font-semibold py-2 px-6 border border-gray rounded-3xl'>
                        <button disabled={productQuantity === 1} className='cursor-pointer disabled:pointer-events-none disabled:text-gray' onClick={() => {setProductQuantity(productQuantity - 1 <= 0 ? productQuantity : productQuantity - 1)}}><Minus strokeWidth={1.5} className='w-6' /></button>
                        <span className='text-2xl'>{productQuantity}</span>
                        <button disabled={productQuantity === product.stock_availability} onClick={() => {setProductQuantity(productQuantity + 1 > product.stock_availability ? productQuantity : productQuantity + 1)}} className='cursor-pointer disabled:pointer-events-none disabled:text-gray'><Plus strokeWidth={1.5} className='w-6' /></button>
                    </div>
                    <button className='h-12 col-span-3 bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-200'>Adaugă în coș</button>
                </div>
            </div>

            <AdditionalInfo product={product} locale={locale} />
        </div>
    )
}
