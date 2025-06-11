'use client'

import { Link, useRouter } from '@/i18n/navigation';
import { ProductInterface } from '@/models/product/types/productInterface';
import { Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface ProductsGridProps {
    queryProducts: ProductInterface[]
}

export default function ProductsGrid({queryProducts}: ProductsGridProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isImageLoaded, setImageLoaded] = useState(false);

    const t = useTranslations("Admin.AdminProducts")

  return (
    <div className='grid grid-cols-12 col-span-12 gap-6 py-8'>
        <Link href="/admin/products/new" className='col-span-3 aspect-[339/425] flex flex-col gap-2 items-center justify-center bg-[#F0F0F0] rounded-2xl border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'>
            <Plus strokeWidth={1.5} className='size-12'/>
            <p>{t("add_product")}</p>
        </Link>
        {
            queryProducts.map((product: ProductInterface, index) => {
                return (
                    <div key={index} className='col-span-4 lg:col-span-3 group' onClick={() => {router.push({pathname: "/admin/products/[id]", params: {id: product.custom_id}})}}>
                        <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-lg before:lg:rounded-2xl before:transition before:duration-300 before:z-20 mb-4'>
                            {
                                product.sale && product.sale.active &&
                                <div className='absolute top-2 lg:top-4 right-2 lg:right-4 h-8 lg:h-12 flex items-center justify-center bg-red px-4 lg:px-6 rounded-3xl text-white z-[5]'>
                                    <span className='font-semibold text-xs lg:text-base leading-3.5 lg:leading-5'>{t("discount")}</span>
                                </div>
                            }
                            <Image unoptimized onLoad={() => setImageLoaded(true)} src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full aspect-[339/425] object-cover rounded-lg object-top lg:rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
                            <Image unoptimized src={product.images.length > 1 ? product.images[1] : product.images[0]} width={798} height={1198} alt={product.title.ro} className={`${isImageLoaded ? "" : "hidden"} absolute left-0 top-0 h-full w-full object-cover rounded-lg object-top lg:rounded-2xl transition duration-300 -z-10`}/>  
                            <button className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer hover:bg-lightgray'>{t('edit_product')}</button>
                        </div>
                        <Link href={{pathname: "/admin/products/[id]", params: {id: product.custom_id}}} className='col-span-3 group cursor-pointer'>
                            <p className={`font-manrope font-semibold mb-2 lg:text-left`}>{product.title[locale]}</p>
                            <div className="flex gap-1 items-center">
                                {
                                    product.sale && product.sale.active &&
                                    <p className='text-gray leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                                }
                                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit mx-0 px-3 py-1.5 lg:mx-0`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
                            </div>
                        </Link>
                    </div>
                )
            })
        }
    </div>
  )
}
