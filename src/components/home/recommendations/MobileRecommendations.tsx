'use client'

import React, { useRef } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { ProductInterface } from '@/models/product/types/productInterface';


interface MobileRecommendationsProps {
    isLoading: boolean;
    data: {
        success: boolean;
        error?: string | undefined;
        products?: ProductInterface[];
    } | undefined
}

export default function MobileRecommendations({isLoading, data}: MobileRecommendationsProps) {
    const swiperRef = useRef<SwiperRef>(null);

    return (
        <div className='col-span-8 lg:col-span-15 -mr-4 lg:-mr-16 overflow-hidden mb-8'>
            <div className='-mr-18 rounded-tl-2xl'>
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 5000,
                    }}
                    ref={swiperRef}
                    slidesPerView={2}
                    loop={true}
                    className="h-auto"
                    speed={400}
                    style={{
                        "--swiper-transition-timing-function": "cubic-bezier(0.65, 0, 0.35, 1)"
                    } as React.CSSProperties}
                >
                    {
                        isLoading || !data?.products ? 
                        <></> :
                        <>
                            {data.products.map((product: ProductInterface, index: number) => (
                                <SwiperSlide key={index} className='pr-2 lg:pr-6 mb-1'>
                                    <ProductCard category={null} key={index} product={product} />
                                </SwiperSlide>
                            ))}
                        </>
                    }
                </Swiper>
            </div>
        </div>
    );
}