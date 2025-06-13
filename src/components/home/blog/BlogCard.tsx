"use client"

import { Link } from '@/i18n/navigation';
import { BlogTags } from '@/lib/enums/BlogTags';
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useSwiper } from 'swiper/react';
import { Swiper } from 'swiper/types';

interface BlogCardInterface {
    src: string;
    tag: BlogTags;
    title: string;
    id: string;
    setSwiperInstance?: (swiper: Swiper) => void;
}

export default function BlogCard({src, tag ,title, id, setSwiperInstance}: BlogCardInterface) {

    const swiper = useSwiper()

    useEffect(() => {
        if(setSwiperInstance){
            setSwiperInstance(swiper);
        }
    }, [swiper, setSwiperInstance])

    

    const t = useTranslations("HomePage.Blog.BlogTags");
  return (
    <Link href={{pathname: "/blog/[id]", params: {id: id}}} className='cursor-pointer group'>
        <div className='mb-2 lg:mb-4 overflow-hidden rounded-lg lg:rounded-2xl relative before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-2xl before:transition before:duration-300 before:z-10'>
            <Image unoptimized src={src} alt={title} width={920} height={920} className='w-full aspect-square object-cover transition-transform duration-300 ease-in-out group-hover:scale-105' />
        </div>
        <div className='h-8 lg:h-12 flex items-center px-6 text-white mb-4 w-fit rounded-3xl font-semibold text-xs lg:text-base' style={{backgroundColor: `var(${getTagColor(tag)})`}} >{t(tag)}</div>
        <p className='font-manrope text-base lg:text-2xl font-semibold leading-5 lg:leading-7'>{title}</p>
    </Link>
  )
}

const getTagColor = (tag: BlogTags) => {
    switch (tag) {
        case BlogTags.NEWS:
            return "--blue1";
        case BlogTags.EXPERIENCES:
            return "--blue2";
        case BlogTags.RECOMMENDATIONS:
            return "--blue3";
    }
}