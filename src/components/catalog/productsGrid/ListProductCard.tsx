import Accordion from '@/components/home/faq/Accordion';
import { Link } from '@/i18n/navigation';
import { CartInterface } from '@/lib/types/CartInterface';
import { addToCart } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image'
import React, { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts';

import styles from '@/components/product/product.module.scss';

interface ProductCardInterface {
    product: ProductInterface
}

export default function ListProductCard({product}: ProductCardInterface) {

  const t = useTranslations('CatalogPage.ProductsSection.ListProduct');

    const locale = useLocale();
    const [value, setValue] = useLocalStorage<CartInterface[]>("cart", []);
    const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div className='col-span-full grid grid-cols-8 lg:grid-cols-10 gap-x-2 lg:gap-x-6 not-last:border-b not-last:border-lightgray lg:not-last:border-gray not-last:pb-4 lg:not-last:pb-6 not-last:mb-6 lg:not-last:mb-0'>
        <Link href={{pathname: '/catalog/product/[id]', params: {id: product.custom_id}}} className='relative col-span-full lg:col-span-3 group aspect-[4/5] h-full max-w-full'>
          {
              product.sale && product.sale.active &&
              <div className='absolute top-2 lg:top-4 right-2 lg:right-4 h-8 lg:h-12 flex items-center justify-center bg-red px-4 lg:px-6 rounded-3xl text-white z-[5]'>
                  <span className='font-semibold text-xs lg:text-base leading-3.5 lg:leading-5'>{t("discount")}</span>
              </div>
          }
          <div className='bg-purewhite w-full h-full rounded-lg lg:rounded-2xl overflow-hidden opacity-100 group-hover:opacity-0 z-10 transition duration-300 relative'>
            <Image unoptimized src={product.images[0]} width={1596} height={2396} alt={product.title.ro} className='max-w-full w-fit max-h-full object-contain z-10 absolute left-1/2 top-1/2 -translate-1/2'/>  
          </div>
          <div className='bg-purewhite w-full h-full absolute left-0 top-0 transition duration-300 -z-10 rounded-lg lg:rounded-2xl overflow-hidden'>
            <Image unoptimized src={product.images[1] || product.images[0]} width={1596} height={2396} alt={product.title.ro} className={`absolute left-0 top-1/2 -translate-y-1/2 max-w-full max-h-full object-contain`}/>  
          </div>
        </Link>
        <div className='col-span-full lg:col-span-4 flex flex-col mt-4 lg:mt-0'>
            <p className='font-manrope font-semibold lg:text-2xl'>{product.title[locale]}</p>
            <div className="flex gap-1 items-center mt-2 lg:hidden">
                {
                    product.sale && product.sale.active &&
                    <p className='text-gray lg:text-base lg:leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                }
                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit px-3 lg:px-4 py-2`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
            </div>
            
            <div className='hidden lg:block'>
                <p className='font-manrope font-semibold mb-4 mt-8'>{t('description')}</p>
                <div 
                      className={styles.productDescription + ' text-black mb-6'}
                      dangerouslySetInnerHTML={{ __html: product.description[locale] }}
                ></div>
                {
                  product.nr_of_items > 1 &&
                  <>
                    <p className='font-manrope font-semibold mb-4'>{t('includes')}</p>
                    <div 
                      className={styles.productDescription + ' text-black'}
                      dangerouslySetInnerHTML={{ __html: product.set_description[locale] }}
                    ></div>
                  </>
                }
            </div>
            <div className='lg:hidden my-4'>
                <Accordion last={product.nr_of_items <= 1} open={activeIndex === 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title='Descriere' >
                  <div 
                    className={styles.productDescription + ' whitespace-pre-line'}
                    dangerouslySetInnerHTML={{ __html: product.description[locale] }}
                  ></div>
                </Accordion>
                {
                  product.nr_of_items > 1 &&
                  <Accordion last open={activeIndex === 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}}  title='Cadoul include' >
                    <div 
                      className={styles.productDescription + ' whitespace-pre-line'}
                      dangerouslySetInnerHTML={{ __html: product.description[locale] }}
                    ></div>
                  </Accordion>
                }
            </div>
        </div>
        <div className='col-span-full lg:col-span-3 relative flex flex-col items-end justify-end gap-2'>
            <button onClick={() => {addToCart(product, 1, value, setValue, locale)}} className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border transition duration-300 hover:opacity-75'>{t('add_to_cart')}</button>
            <Link href={{pathname: "/catalog/product/[id]", params: {id: product.custom_id}}} className='w-full'>
              <button className='h-12 w-full border border-black rounded-3xl font-manrope font-semibold cursor-pointer transition duration-300 hover:bg-black hover:text-white'>{t('see')}</button>
            </Link>
            <div className="gap-1 items-center hidden lg:flex absolute top-0 right-0">
                {
                    product.sale && product.sale.active &&
                    <p className='text-gray leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                }
                <div className={`font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
            </div>
        </div>
    </div>
  )
}
