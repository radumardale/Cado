import { ProductInterface } from '@/models/product/types/productInterface'
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'
import {motion} from 'motion/react';
import { easeInOutCubic } from '@/lib/utils';

interface ImagesCarouselInterface {
    setCarouselOpen: (v: boolean) => void,
    product: ProductInterface,
    locale: string,
    initialActive?: number
}

export default function ImagesCarousel({setCarouselOpen, product, locale, initialActive = 0}: ImagesCarouselInterface) {
    const [activeImage, setActiveImage] = useState(initialActive);

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, ease: easeInOutCubic}}}  exit={{opacity: 0, transition: {duration: .2, ease: easeInOutCubic}}} className='fixed bg-darkblue/75 w-screen h-screen top-0 left-0 z-50 backdrop-blur-xs flex flex-col items-center py-6' onMouseDown={(e) => {e.stopPropagation(); setCarouselOpen(false)}}>
        <div className='flex-1 aspect-[738/919] relative mb-4' onMouseDown={(e) => {e.stopPropagation()}}>
            {
                product.images.map((image, index) => {
                    return(
                        <Image key={index} src={image} alt={product.title[locale]} width={738} height={919} className={`w-full h-full object-cover rounded-2xl absolute left-0 top-0 transition duration-300 ${activeImage === index ? "z-10 opacity-100" : "z-0 opacity-0"}`} />
                    )
                })
            }
        </div>
        <div className="flex gap-4 justify-center" onMouseDown={(e) => {e.stopPropagation()}}>
            {
                product.images.map((image, index) => {
                    return(
                        <button key={index} onClick={() => {setActiveImage(index)}} className={`cursor-pointer relative after:content-[''] after:absolute after:w-full after:h-full after:rounded-lg after:bg-black after:top-0 after:left-0 after:transition after:duration-200 ${activeImage === index ? "after:opacity-0" : "after:opacity-50"}`}>
                            <Image src={image} alt={product.title[locale]} width={97} height={97} className='rounded-lg size-24 object-cover' />
                        </button>
                    )
                })
            }
        </div>
        <button className='absolute right-16 top-1/2 -translate-y-1/2 cursor-pointer' onMouseDown={(e) => {e.stopPropagation()}} onClick={() => {setActiveImage(activeImage + 1 >= product.images.length ? 0 : activeImage + 1)}}>
            <ArrowRight className='text-white size-8' strokeWidth={1.5} />
        </button>
        <button className='absolute left-16 top-1/2 -translate-y-1/2 cursor-pointer' onMouseDown={(e) => {e.stopPropagation()}} onClick={() => {setActiveImage(activeImage - 1 < 0 ? product.images.length - 1 : activeImage - 1)}}>
            <ArrowLeft className='text-white size-8' strokeWidth={1.5} />
        </button>
        <button className='absolute right-16 top-6 cursor-pointer'>
            <X className='text-white size-8' strokeWidth={1.5} />
        </button>
    </motion.div>
  )
}
