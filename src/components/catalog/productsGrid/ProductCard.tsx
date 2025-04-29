import { Link, useRouter } from '@/i18n/navigation';
import { Categories } from '@/lib/enums/Categories';
import { CartInterface } from '@/lib/types/CartInterface';
import { addToCart } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl';
import Image from 'next/image'
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface ProductCardInterface {
    product: ProductInterface,
    category?: Categories | null,
    section?: string,
    newLine?: boolean
}

export default function ProductCard({product, category, section="RECOMMENDATIONS", newLine = false}: ProductCardInterface) {
    const locale = useLocale();
    const router = useRouter();
    const [value, setValue] = useLocalStorage<CartInterface[]>('cart', []);
    const [isImageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`flex flex-col ${newLine ? "col-start-1 lg:col-start-1" : ""} col-span-4 lg:col-span-3 group`} onClick={() => {router.push({pathname: "/catalog/product/[id]", params: {id: product.custom_id}, query: category ? {category: category} : {}})}}>
        <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-lg before:lg:rounded-2xl before:transition before:duration-300 before:z-10 mb-4'>
          {
              product.sale && product.sale.active &&
              <div className='absolute top-2 lg:top-4 right-2 lg:right-4 h-8 lg:h-12 flex items-center justify-center bg-red px-4 lg:px-6 rounded-3xl text-white z-[5]'>
                  <span className='font-semibold text-xs lg:text-base leading-3.5 lg:leading-5'>Reducere</span>
              </div>
          }
          <Image onLoad={() => setImageLoaded(true)} src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full aspect-[339/425] object-cover rounded-lg object-top lg:rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
          <Image src={product.images[1]} width={798} height={1198} alt={product.title.ro} className={`${isImageLoaded ? "" : "hidden"} absolute left-0 top-0 h-full w-full object-cover rounded-lg object-top lg:rounded-2xl transition duration-300 -z-10`}/>  
          <button onClick={(e) => {e.stopPropagation(); addToCart(product, 1, value, setValue, locale)}} className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer hover:bg-lightgray'>Adaugă în coș</button>
        </div>
        <Link href={{pathname: "/catalog/product/[id]", params: {id: product.custom_id}, query: category ? {category: category} : {}}} className='col-span-3 group cursor-pointer flex flex-col flex-1'>
            <p className={`flex-1 font-manrope font-semibold mb-2 ${section === "CATALOG" ? "text-left" : "text-center"} lg:text-left`}>{product.title[locale]}</p>
            <div className={`flex gap-1 items-center ${section === "CATALOG" ? "mx-0" : "mx-auto"} lg:mx-0`}>
                {
                    product.sale && product.sale.active &&
                    <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                }
                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit mx-0 ${section === "CATALOG" ? "px-2 lg:px-3 py-1.5" : "px-2 lg:px-4 py-2"}`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
            </div>
        </Link>
    </div>
  )
}