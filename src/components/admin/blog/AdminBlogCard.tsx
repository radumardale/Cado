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

export default function AdminBlogCard({src, tag ,title, date, id}: BlogCardInterface) {
    const t = useTranslations("HomePage.Blog.BlogTags");
    const blog_t = useTranslations("Admin.AdminBlog");

  return (
    <Link href={{pathname: '/admin/blog/[id]', params: {id: id}}} className='cursor-pointer col-span-7 xl:col-span-6 group block'>
        <div className="overflow-hidden rounded-lg lg:rounded-2xl mb-2 lg:mb-4 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-2xl before:transition before:duration-300 before:z-10">
            <button className='absolute left-4 -bottom-12 h-12 w-[calc(100%-2rem)] bg-white rounded-3xl font-manrope z-20 opacity-100 transition-all duration-300 group-hover:bottom-4 font-semibold cursor-pointer hover:bg-lightgray'>{blog_t('edit_blog')}</button>
            <Image 
            unoptimized
            src={src} 
            alt={title} 
            width={920} 
            height={920} 
            className='w-full aspect-[708/464] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105' 
            />
        </div>
        <div className="flex justify-between items-center mb-4">
            <div className='h-8 lg:h-12 flex items-center px-6 text-white w-fit rounded-3xl font-semibold text-xs leading-3 lg:text-base lg:leading-5' style={{backgroundColor: `var(${getTagColor(tag)})`}} >{t(tag)}</div>
            <p className='text-gray font-manrope font-semibold text-sm leading-4 lg:text-base lg:leading-5'>{date}</p>
        </div>  
        <p className='font-manrope text-base lg:text-2xl font-semibold leading-5 lg:leading-7'>{title}</p>
    </Link>
  )
}