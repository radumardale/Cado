'use client';
import React, { useEffect, useRef, useState } from 'react';
import BlogCard from './BlogCard';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import BlogTitle from './BlogTitle';
import { useTRPC } from '@/app/_trpc/client';
import { useLocale } from 'next-intl';

import { useQuery } from '@tanstack/react-query';
import { Autoplay } from 'swiper/modules';

import { Swiper as SwiperType } from 'swiper/types';

export default function BlogCarousel() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.blog.getLimitedBlogs.queryOptions({ limit: 6 }));
  const swiperRef = useRef<SwiperRef>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const locale = useLocale();
  const [slidesPerView, setSlidesPerView] = useState(2); // Default to mobile view
  const [isMounted, setIsMounted] = useState(false);

  const updateSlidesPerView = () => {
    setSlidesPerView(window.innerWidth >= 1024 ? 4 : 2);
  };

  useEffect(() => {
    // Set initial value
    updateSlidesPerView();

    // Add resize listener
    window.addEventListener('resize', updateSlidesPerView);
    setIsMounted(true);

    // Clean up
    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
    };
  }, []);

  const goToNextSlide = () => {
    // if (swiperRef.current?.swiper) {
    //     swiperRef.current.swiper.slideNext();
    // }
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goToPreviousSlide = () => {
    // if (swiperRef.current?.swiper) {
    //     swiperRef.current.swiper.slidePrev();
    // }
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  if (isLoading || !data?.blogs || data?.blogs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BlogTitle goToNextSlide={goToNextSlide} goToPreviousSlide={goToPreviousSlide} />
      <div className='col-span-8 lg:col-span-15 -mr-4 lg:-mr-16 overflow-hidden mb-24 lg:mb-42'>
        <div className='-mr-12 lg:-mr-18 rounded-tl-2xl mt-8'>
          {!isMounted ? (
            <div className='flex'>
              {data?.blogs?.map((blog, index) => (
                <div key={index} className='pr-2 lg:pr-6 mb-1 min-w-1/2 lg:min-w-1/4'>
                  <BlogCard
                    id={blog._id}
                    src={blog.image}
                    tag={blog.tag}
                    title={blog.title[locale]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              ref={swiperRef}
              slidesPerView={slidesPerView}
              slidesPerGroup={1}
              loop={true}
              className='h-auto'
              speed={400}
              style={
                {
                  '--swiper-transition-timing-function': 'cubic-bezier(0.65, 0, 0.35, 1)',
                } as React.CSSProperties
              }
            >
              {isLoading || !data?.blogs ? (
                <></>
              ) : (
                <>
                  {data.blogs.map((blog, index) => (
                    <SwiperSlide key={index} className='pr-2 lg:pr-6 mb-1'>
                      <BlogCard
                        setSwiperInstance={index === 0 ? setSwiperInstance : undefined}
                        id={blog._id}
                        src={blog.image}
                        tag={blog.tag}
                        title={blog.title[locale]}
                      />
                    </SwiperSlide>
                  ))}
                </>
              )}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
}
