'use client'

import { BlogTags } from '@/lib/enums/BlogTags'
import React, { useRef } from 'react'
import BlogCard from './BlogCard'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import BlogTitle from './BlogTitle';

const blogs = [
    {
        image: "/categories/ACCESSORIES.jpg",
        tag: BlogTags.RECOMMENDATIONS,
        title: "De ce cadourile corporate de la CADO sunt mai mult decât un set clasic?"
    },
    {
        image: "/categories/FOR_HIM.jpg",
        tag: BlogTags.NEWS,
        title: "Christmas World 2025 unde dorințele devin realitate"
    },
    {
        image: "/categories/FOR_HER.jpg",
        tag: BlogTags.EXPERIENCES,
        title: "Ce nu ar trebui să fie într-un cadou: ce excludem și nu vă recomandăm"
    },
    {
        image: "/categories/FOR_KIDS.jpg",
        tag: BlogTags.RECOMMENDATIONS,
        title: "CADO: Povestea transformării și creșterii"
    },
     {
        image: "/categories/ACCESSORIES.jpg",
        tag: BlogTags.RECOMMENDATIONS,
        title: "De ce cadourile corporate de la CADO sunt mai mult decât un set clasic?"
    },
]

export default function BlogCarousel() {
    const swiperRef = useRef<SwiperRef>(null);

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
            <div className='-mr-18 overflow-hidden rounded-tl-2xl mt-8'>
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
                    {blogs.map((blog, index) => (
                        <SwiperSlide key={index} className='pr-6'>
                            <BlogCard src={blog.image} tag={blog.tag} title={blog.title}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    </>
  )
}
