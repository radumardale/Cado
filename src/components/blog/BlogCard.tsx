import { BlogTags } from '@/lib/enums/BlogTags';
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

interface BlogCardInterface {
    src: string;
    tag: BlogTags;
    title: string;
    date: string;
}

export default function BlogCard({src, tag ,title, date}: BlogCardInterface) {
    const t = useTranslations("blog_tags");

  return (
    <div className='cursor-pointer col-span-6'>
        <Image src={src} alt={title} width={460} height={460} className='w-full aspect-[708/464] rounded-2xl object-cover mb-4' />
        <div className="flex justify-between items-center">
            <div className='h-12 flex items-center px-6 text-white mb-4 w-fit rounded-3xl font-semibold' style={{backgroundColor: `var(${getTagColor(tag)})`}} >{t(tag)}</div>
            <p className='text-gray font-manrope font-semibold'>{date}</p>
        </div>  
        <p className='font-manrope text-2xl font-semibold leading-7'>{title}</p>
    </div>
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