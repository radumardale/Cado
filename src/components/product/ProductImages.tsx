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
    const [isDesktop, setIsDesktop] = useState(false);
  
    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
        <div className='col-span-full lg:col-start-2 lg:col-span-7 grid grid-cols-8 lg:grid-cols-6 mt-2 lg:mt-16 gap-x-6 mb-4 lg:mb-31 relative'>
            <div className='col-span-full lg:col-span-1 flex lg:flex-col h-fit gap-2 lg:gap-4 lg:sticky top-25 left-0 order-2 lg:order-1'>    
                {
                    product.images.map((image, index) => {
                        return(
                            <button className={`cursor-pointer w-1/4 aspect-[339/425] lg:w-full ${index >= 4 ? "hidden lg:block" : ""}`}key={index} onClick={() => {setImageIndex(index); setCarouselOpen(true)}}>
                                <Image src={image} alt={product.title[locale]} width={97} height={121} className='rounded-sm lg:rounded-xl w-full h-full object-cover' />
                            </button>
                        )
                    })
                }
            </div>
            <div className='col-span-full lg:col-span-5 flex flex-col gap-2 order-1 lg:order-2'>
                {
                    product.images.map((image, index) => {
                        return(
                            <button key={index} onClick={() => {if (!isDesktop) setCarouselOpen(true)}}>
                                <Image src={image} alt={product.title[locale]} width={578} height={723} className={`rounded-lg lg:rounded-xl w-full ${index > 0 ? "hidden lg:block" : ""}`} />
                            </button>
                        )
                    })
                }
            </div>
        </div>

    </>
  )
}
