import { Link, useRouter } from '@/i18n/navigation';
import { Categories } from '@/lib/enums/Categories';
import { CartInterface } from '@/lib/types/CartInterface';
import { addToCart } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl';
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts';

interface ProductCardInterface {
    product: ProductInterface,
    category?: Categories | null
}

export default function ProductCard({product, category}: ProductCardInterface) {
    const locale = useLocale();
    const router = useRouter();
    const [value, setValue] = useLocalStorage<CartInterface[]>('cart', []);

  return (
    <div className='col-span-3 group' onClick={() => {router.push({pathname: "/catalog/product/[id]", params: {id: product.custom_id}, query: category ? {category: category} : {}})}}>
        <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-2xl before:transition before:duration-300 before:z-10 mb-4'>
          <Image src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full aspect-[339/425] object-cover object-top rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
          <Image src={product.images[1]} width={798} height={1198} alt={product.title.ro} className='absolute left-0 top-0 h-full w-full object-cover object-top rounded-2xl transition duration-300 -z-10'/>  
          <button onClick={(e) => {e.stopPropagation(); addToCart(product, 1, value, setValue, locale)}} className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer hover:bg-lightgray'>Adaugă în coș</button>
        </div>
        <Link href={{pathname: "/catalog/product/[id]", params: {id: product.custom_id}, query: category ? {category: category} : {}}} className='col-span-3 group cursor-pointer'>
            <p className='font-manrope font-semibold mb-2'>{product.title[locale]}</p>
            <div className='font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{product.price.toLocaleString()} MDL</div>
        </Link>
    </div>
  )
}