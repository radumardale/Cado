import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ImagesCarousel from './ImagesCarousel'
import { useLenis } from 'lenis/react'
import { AnimatePresence } from 'motion/react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImagesInterface {
    product: ProductInterface
}

export default function ProductImages({product}: ProductImagesInterface) {
    const [isCarouselOpen, setCarouselOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const locale = useLocale();
    const lenis = useLenis();
    const swiperRef = useRef<SwiperRef>(null);
  
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
        <div className='col-span-full lg:col-start-2 lg:col-span-5 grid grid-cols-5 lg:grid-cols-5 mt-2 lg:mt-16 gap-x-6 mb-4 lg:mb-31 relative h-fit cursor-pointer'>
            <button className='col-span-full mb-4 aspect-[3/4] w-full cursor-pointer relative' onClick={() => {setCarouselOpen(true)}}>
                {
                    product.images.map((image, index) => (
                        <Image key={index} draggable={false} priority quality={100} src={image} alt={product.title[locale]} width={1156} height={1446} className={`${index === imageIndex ? "opacity-100" : "opacity-0"} rounded-lg lg:rounded-xl max-w-full w-full absolute top-1/2 -translate-y-1/2`}/>
                    ))
                }
            </button>
            
            <div className='col-span-full relative group'>
                {
                    product.images.length >= 6 &&
                        <>
                            <button 
                                className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full cursor-pointer opacity-25 group-hover:opacity-100 transition duration'
                                onClick={() => {
                                    swiperRef.current?.swiper.slideNext();                        
                                }}    
                            >
                                <ChevronRight className='size-6' strokeWidth={1.5}/>
                            </button> 
                            <button 
                                className='absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full cursor-pointer opacity-25 group-hover:opacity-100 transition duration-200'
                                onClick={() => {
                                    swiperRef.current?.swiper.slidePrev();
                                }}    
                            >
                                <ChevronLeft className='size-6' strokeWidth={1.5}/>
                            </button> 
                        </>
                }
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 5000,
                    }}
                    onSlideNextTransitionStart={() => {
                        setImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
                    }}
                    onSlidePrevTransitionStart={() => {
                        setImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
                    }}
                    ref={swiperRef}
                    slidesPerView={5}
                    spaceBetween={16}
                    breakpoints={{
                        // For larger screens, use more space
                        1024: {
                            spaceBetween: 14 * 1.5
                        },
                        1636: {
                            spaceBetween: 16 * 1.5
                        }
                    }}
                    loop={true}
                    className={`h-auto w-full`}
                    speed={400}
                    style={{
                        "--swiper-transition-timing-function": "cubic-bezier(0.65, 0, 0.35, 1)"
                    } as React.CSSProperties}
                >
                    {
                        product.images.map((image, index) => (
                            <SwiperSlide key={index} className='aspect-square'>
                                <button className='cursor-pointer flex-1 aspect-square lg:w-full' onClick={() => {setImageIndex(index)}}>
                                    <Image quality={100} src={image} alt={product.title[locale]} width={254} height={318} className='rounded-sm lg:rounded-xl w-full h-full object-cover' />
                                </button>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>

    </>
  )
}
