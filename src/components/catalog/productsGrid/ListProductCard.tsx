import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl';
import Image from 'next/image'
import React from 'react'

interface ProductCardInterface {
    product: ProductInterface
}

export default function ListProductCard({product}: ProductCardInterface) {
    const locale = useLocale();

  return (
    <div className='col-span-full grid grid-cols-10 gap-x-6 border-b border-gray pb-6'>
        <div className='relative col-span-3 group aspect-[339/425]'>
          <Image src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full h-full object-cover object-top rounded-2xl opacity-100 group-hover:opacity-0 z-10 transition duration-300'/>  
          <Image src={product.images[1]} width={798} height={1198} alt={product.title.ro} className='absolute left-0 top-0 h-full w-full object-cover object-top rounded-2xl transition duration-300 -z-10'/>  
        </div>
        <div className='col-span-4 flex flex-col'>
            <p className='font-manrope font-semibold text-2xl'>{product.title[locale]}</p>
            <div>
                <p className='font-manrope font-semibold mb-4 mt-8'>Descriere</p>
                <p className='text-darkgray mb-6'>Setul cadou „Christmas Fairytale” este o alegere excelentă pentru cei dragi, familie, prieteni sau parteneri de afaceri.

Este ideal pentru a crea amintiri speciale de Crăciun și a oferi un sentiment unic de bucurie și recunoștință. De asemenea, este perfect pentru companii care doresc să impresioneze partenerii sau echipa.</p>
                {/* <p className='font-manrope font-semibold mb-4'>Cadoul include</p> */}
                {/* <p className='text-darkgray'>Vin 750 ml / șampanie <br/>
                    Fructe uscate în ciocolată <br/>
                    Ciocolată neagră - 100 g, decorată <br/>
                    Lampă de veghe „Carte” <br/>
                    Suporturi pentru cărți „Iron Men” <br/>
                    Jucărie de Crăciun „Om cu zăpadă” <br/>
                    Felicitare hand made <br/>
                    Crengi de molid olandez cu jucării de Crăciun <br/>
                    Cutie de carton artistic cu toartă și branding <br/></p> */}
            </div>
        </div>
        <div className='col-span-3 relative flex flex-col items-end gap-2'>
            <button className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border'>Adaugă în coș</button>
            <button className='h-12 w-full border border-black rounded-3xl font-manrope font-semibold cursor-pointer'>Vezi produsul</button>
            <div className='absolute bottom-0 right-0 font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{product.price} MDL</div>
        </div>
    </div>
  )
}
