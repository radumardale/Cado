import Accordion from '@/components/home/faq/Accordion';
import { Link } from '@/i18n/navigation';
import { CartInterface } from '@/lib/types/CartInterface';
import { addToCart } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl';
import Image from 'next/image'
import React, { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts';

interface ProductCardInterface {
    product: ProductInterface
}

export default function ListProductCard({product}: ProductCardInterface) {
    const locale = useLocale();
    const [value, setValue] = useLocalStorage<CartInterface[]>("cart", []);
    const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='col-span-full grid grid-cols-8 lg:grid-cols-10 gap-x-2 lg:gap-x-6 lg:not-last:border-b lg:not-last:border-gray lg:not-last:pb-6 not-last:mb-2 lg:not-last:mb-0'>
        <Link href={{pathname: '/catalog/product/[id]', params: {id: product.custom_id}}} className='relative col-span-full lg:col-span-3 group aspect-[339/425] h-full max-w-full'>
          <Image src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full h-full object-cover object-top rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
          <Image src={product.images[1]} width={798} height={1198} alt={product.title.ro} className='absolute left-0 top-0 h-full w-full object-cover object-top rounded-2xl transition duration-300 -z-10'/>  
        </Link>
        <div className='col-span-full lg:col-span-4 flex flex-col mt-4 lg:mt-0'>
            <p className='font-manrope font-semibold text-2xl'>{product.title[locale]}</p>
            <div className='font-manrope font-semibold border border-gray rounded-3xl w-fit px-3 lg:px-4 py-2 mt-2'>{product.price.toLocaleString()} MDL</div>
            
            <div className='hidden lg:block'>
                <p className='font-manrope font-semibold mb-4 mt-8'>Descriere</p>
                <p className='text-black mb-6'>Setul cadou „Christmas Fairytale” este o alegere excelentă pentru cei dragi, familie, prieteni sau parteneri de afaceri.Este ideal pentru a crea amintiri speciale de Crăciun și a oferi un sentiment unic de bucurie și recunoștință. De asemenea, este perfect pentru companii care doresc să impresioneze partenerii sau echipa.</p>
                {
                  product.set_description &&
                  <>
                    <p className='font-manrope font-semibold mb-4'>Cadoul include</p>
                    <p className='text-black whitespace-pre-line'> {product.set_description[locale].replace(/\\n/g, '\n')}</p>
                  </>
                }
            </div>
            <div className='lg:hidden my-4'>
                <Accordion open={activeIndex === 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title='Descriere' >
                  <p>Setul cadou „Christmas Fairytale” este o alegere excelentă pentru cei dragi, familie, prieteni sau parteneri de afaceri. Este ideal pentru a crea amintiri speciale de Crăciun și a oferi un sentiment unic de bucurie și recunoștință. De asemenea, este perfect pentru companii care doresc să impresioneze partenerii sau echipa.</p>
                </Accordion>
                <Accordion last open={activeIndex === 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}}  title='Cadoul include' >
                  <p>Setul cadou „Christmas Fairytale” este o alegere excelentă pentru cei dragi, familie, prieteni sau parteneri de afaceri. Este ideal pentru a crea amintiri speciale de Crăciun și a oferi un sentiment unic de bucurie și recunoștință. De asemenea, este perfect pentru companii care doresc să impresioneze partenerii sau echipa.</p>
                </Accordion>
            </div>
        </div>
        <div className='col-span-full lg:col-span-3 relative flex flex-col items-end justify-end gap-2'>
            <button onClick={() => {addToCart(product, 1, value, setValue, locale)}} className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border transition duration-300 hover:opacity-75'>Adaugă în coș</button>
            <Link href={{pathname: "/catalog/product/[id]", params: {id: product.custom_id}}} className='w-full'>
              <button className='h-12 w-full border border-black rounded-3xl font-manrope font-semibold cursor-pointer transition duration-300 hover:bg-black hover:text-white'>Vezi produsul</button>
            </Link>
            <div className='hidden lg:block absolute top-0 right-0 font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{product.price.toLocaleString()} MDL</div>
        </div>
    </div>
  )
}
