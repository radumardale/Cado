import { ProductInterface } from '@/models/product/types/productInterface'
import { Minus, Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import AdditionalInfo from './AdditionalInfo';
import { useLenis } from 'lenis/react';
import { addToCart } from '@/lib/utils';
import { useLocalStorage } from 'usehooks-ts';
import { CartInterface } from '@/lib/types/CartInterface';
import { StockState, stockStateColors } from '@/lib/enums/StockState';

interface ProductContentInterface {
    product: ProductInterface
}

export default function ProductContent({product}: ProductContentInterface) {
    const t = useTranslations("stock_state");
    const locale = useLocale();
    const lenis = useLenis();
    const [productQuantity, setProductQuantity] = useState(1);
    const [value, setValue] = useLocalStorage<CartInterface[]>("cart", []);
    const maxStock = product.stock_availability.state === StockState.IN_STOCK ? product.stock_availability.stock : 100;

    useEffect(() => {
        lenis?.scrollTo(0, {immediate: true})
    }, [])

    return (
        <div className='col-span-full lg:col-span-5 pb-24 lg:pb-31 lg:mt-16 lg:sticky lg:h-screen top-25 flex flex-col justify-between'>
            <div>
                <h1 className='font-manrope text-2xl lg:text-[2rem] font-semibold leading-7 lg:leading-9'>{product.title[locale]}</h1>
                <div className="flex items-center gap-4 my-4">
                    <div className="flex gap-1 items-center">
                        {
                            product.sale && product.sale.active &&
                            <p className='text-gray leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                        }
                        <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit mx-0 py-2 px-4 lg:mx-0`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <div className='size-2 rounded-full' style={{backgroundColor: stockStateColors[product.stock_availability.state]}}></div>
                        <p style={{color: stockStateColors[product.stock_availability.state]}}>{t(product.stock_availability.state)}</p>
                    </div>
                </div>
                <p className='text-sm leading-4 lg:leading-5 whitespace-pre-line mb-4 lg:mb-8 lg:text-base'>{product.description[locale]}</p>
                {
                    product.stock_availability.state !== StockState.NOT_IN_STOCK &&
                    <div className="grid grid-cols-5 gap-x-6 col-span-5">
                        <div className='col-span-full lg:col-span-2 flex justify-between font-manrope font-semibold py-2 px-6 border border-gray rounded-3xl mb-2 lg:mb-0'>
                            <button disabled={productQuantity === 1} className='cursor-pointer disabled:pointer-events-none disabled:text-gray' onClick={() => {setProductQuantity(productQuantity - 1 <= 0 ? productQuantity : productQuantity - 1)}}><Minus strokeWidth={1.5} className='w-6' /></button>
                            <span className='text-2xl leading-7'>{productQuantity}</span>
                            <button disabled={productQuantity === product.stock_availability.stock} onClick={() => {setProductQuantity(productQuantity + 1 > maxStock ? productQuantity : productQuantity + 1)}} className='cursor-pointer disabled:pointer-events-none disabled:text-gray'><Plus strokeWidth={1.5} className='w-6' /></button>
                        </div>
                        <button onClick={() => {addToCart(product, productQuantity, value, setValue, locale)}} className='h-12 col-span-full lg:col-span-3 bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300'>Adaugă în coș</button>
                    </div>
                }
            </div>

            <AdditionalInfo product={product} locale={locale} />
        </div>
    )
}
