'use client'

import React, { useRef } from 'react'
import BlogCard from './BlogCard'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import BlogTitle from './BlogTitle';
import { trpc } from '@/app/_trpc/client';
import { useLocale } from 'next-intl';

export default function BlogCarousel() {
    const {data, isLoading} = trpc.blog.getLimitedBlogs.useQuery({limit: 6});
    const swiperRef = useRef<SwiperRef>(null);
    const locale = useLocale();

    const goToNextSlide = () => {
        swiperRef.current?.swiper.slideNext();
    };

    const goToPreviousSlide = () => {
        swiperRef.current?.swiper.slidePrev();
    };

  return (
    <>
        <BlogTitle goToNextSlide={goToNextSlide} goToPreviousSlide={goToPreviousSlide}/>
        <div className='col-span-15 -mr-16 overflow-hidden mb-42'>
            <div className='-mr-18 rounded-tl-2xl mt-8'>
                <Swiper
                    ref={swiperRef}
                    slidesPerView={4}
                    loop={true}
                    className="h-auto"
                    speed={400}
                    style={{
                        "--swiper-transition-timing-function": "cubic-bezier(0.65, 0, 0.35, 1)"
                    } as React.CSSProperties}
                >
                    {
                        isLoading || !data?.blogs ? 
                        <>
                        </>
                        :
                        <>
                            {data.blogs.map((blog, index) => (
                                <SwiperSlide key={index} className='pr-6 mb-1'>
                                    <BlogCard src={blog.image} tag={blog.tag} title={blog.title[locale]}/>
                                </SwiperSlide>
                            ))}
                        </>
                    }
                </Swiper>
            </div>
        </div>
    </>
  )
}
