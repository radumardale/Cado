import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ImagesCarousel from './ImagesCarousel'
import { useLenis } from 'lenis/react'
import { AnimatePresence } from 'motion/react'

interface ProductImagesInterface {
    product: ProductInterface
}

export default function ProductImages({product}: ProductImagesInterface) {
    const [isCarouselOpen, setCarouselOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const locale = useLocale();
    const lenis = useLenis();

    useEffect(() => {
        if (isCarouselOpen) {
            lenis?.stop();
            window.document.body.classList.add('carousel')
        } else {
            lenis?.start();
            window.document.body.classList.remove('carousel')
        }
    }, [isCarouselOpen])

  return (
    <>
        <AnimatePresence>
            {isCarouselOpen && <ImagesCarousel initialActive={imageIndex} product={product} locale={locale} setCarouselOpen={setCarouselOpen} />}
        </AnimatePresence>
        <div className='col-start-2 col-span-7 grid grid-cols-6 mt-16 gap-x-6 mb-31 relative'>
            <div className='col-span-1 flex flex-col h-fit gap-4 sticky top-25 left-0'>    
                {
                    product.images.map((image, index) => {
                        return(
                            <button className='cursor-pointer' key={index} onClick={() => {setImageIndex(index); setCarouselOpen(true)}}>
                                <Image src={image} alt={product.title[locale]} width={97} height={121} className='rounded-xl w-full' />
                            </button>
                        )
                    })
                }
            </div>
            <div className='col-span-5 flex flex-col gap-2'>
                {
                    product.images.map((image, index) => {
                        return(
                            <button key={index}>
                                <Image src={image} alt={product.title[locale]} width={578} height={723} className='rounded-xl w-full' />
                            </button>
                        )
                    })
                }
            </div>
        </div>

    </>
  )
}
