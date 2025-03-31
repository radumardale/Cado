import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl';
import Image from 'next/image'

interface ProductCardInterface {
    product: ProductInterface
}

export default function ProductCard({product}: ProductCardInterface) {
    const locale = useLocale();

  return (
    <div className='col-span-3 group cursor-pointer'>
        <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-2xl before:transition before:duration-300 before:z-10 mb-4'>
          <Image src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full aspect-[339/425] object-cover object-top rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
          <Image src={product.images[1]} width={798} height={1198} alt={product.title.ro} className='absolute left-0 top-0 h-full w-full object-cover object-top rounded-2xl transition duration-300 -z-10'/>  
          <button className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer'>Adaugă în coș</button>
        </div>
        <p className='font-manrope font-semibold mb-2'>{product.title[locale]}</p>
        <div className='font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{product.price} MDL</div>
    </div>
  )
}
