'use client'

import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image'
import { useState } from 'react';

interface AdminRecommendationsCardInterface {
    product: ProductInterface,
    setAddProductOpen: () => void
}

export default function AdminRecommendationsCard({product, setAddProductOpen}: AdminRecommendationsCardInterface) {
    const locale = useLocale();
    const [isImageLoaded, setImageLoaded] = useState(false);

    const t = useTranslations("Admin.AdminHomePage")

  return (
    <div className={`flex flex-col h-full col-span-4 lg:col-span-3 group cursor-pointer`} onClick={setAddProductOpen}>
        <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-lg before:lg:rounded-2xl before:transition before:duration-300 before:z-10 mb-4 aspect-[339/425]'>
          {
              product.sale && product.sale.active &&
              <div className='absolute top-2 lg:top-4 right-2 lg:right-4 h-8 lg:h-12 flex items-center justify-center bg-red px-4 lg:px-6 rounded-3xl text-white z-[5]'>
                  <span className='font-semibold text-xs lg:text-base leading-3.5 lg:leading-5'>{t("discount")}</span>
              </div>
          }
          <div className='bg-purewhite w-full h-full rounded-lg lg:rounded-2xl overflow-hidden opacity-100 group-hover:opacity-0 z-10 transition duration-300 relative'>
            <Image onLoad={() => setImageLoaded(true)} src={product.images[0]} width={1596} height={2396} alt={product.title.ro} className='max-w-full w-fit max-h-full object-contain z-10 absolute left-1/2 top-1/2 -translate-1/2'/>  
          </div>
          <div className='bg-purewhite w-full h-full absolute left-0 top-0 transition duration-300 -z-10 rounded-lg lg:rounded-2xl overflow-hidden'>
            <Image src={product.images[1] || product.images[0]} width={1596} height={2396} alt={product.title.ro} className={`${isImageLoaded ? "" : "hidden"} absolute left-0 top-1/2 -translate-y-1/2 max-w-full max-h-full object-contain`}/>  
          </div>
          <button className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer hover:bg-lightergray'>{t("change_prod")}</button>
        </div>
        <div className='col-span-3 group cursor-pointer flex flex-col flex-1'>
            <p className={`flex-1 font-manrope font-semibold mb-2 text-left`}>{product.title[locale]}</p>
            <div className={`flex gap-1 items-center lg:mx-0`}>
                {
                    product.sale && product.sale.active &&
                    <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                }
                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit mx-0 px-2 lg:px-4 py-2`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
            </div>
        </div>
    </div>
  )
}