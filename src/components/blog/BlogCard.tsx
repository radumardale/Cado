import { Link } from '@/i18n/navigation';
import { BlogTags } from '@/lib/enums/BlogTags';
import { getTagColor } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

interface BlogCardInterface {
    id: string;
    src: string;
    tag: BlogTags;
    title: string;
    date: string;
}

export default function BlogCard({src, tag ,title, date, id}: BlogCardInterface) {
    const t = useTranslations("blog_tags");

  return (
    <Link href={{pathname: '/blog/[id]', params: {id: id}}} className='cursor-pointer col-span-6 group block'>
        <div className="overflow-hidden rounded-2xl mb-4 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-2xl before:transition before:duration-300 before:z-10">
            <Image src={src} alt={title} width={460} height={460} className='w-full aspect-[708/464] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105' />
        </div>
        <div className="flex justify-between items-center">
            <div className='h-12 flex items-center px-6 text-white mb-4 w-fit rounded-3xl font-semibold' style={{backgroundColor: `var(${getTagColor(tag)})`}} >{t(tag)}</div>
            <p className='text-gray font-manrope font-semibold'>{date}</p>
        </div>  
        <p className='font-manrope text-2xl font-semibold leading-7'>{title}</p>
    </Link>
  )
}