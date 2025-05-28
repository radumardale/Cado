'use client'

import { trpc } from '@/app/_trpc/client';
import { getTagColor } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image';
import React, { Fragment } from 'react'
import BlogSectionSkeleton from './BlogSectionSkeleton';
import { redirect } from 'next/navigation';

interface BlogSectionInteface {
    id: string
}

export default function BlogSection({id}: BlogSectionInteface) {
    const locale = useLocale();
    const t = useTranslations("blog_tags");
    const {data, isLoading} = trpc.blog.getBlogById.useQuery({id: id});

    if (isLoading) {
        return <BlogSectionSkeleton />
    }

    if (!data?.blog) {
        redirect('/blogs');
    }

  return (
    <div className='col-span-full lg:col-span-7 lg:col-start-5 mt-16 mb-24 lg:mb-42'>
        <h1 className='font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 font-semibold mb-4 lg:mb-6'>{data.blog.title[locale]}</h1>
        <div className="flex justify-between items-center mb-10 lg:mb-12">
            <div className='h-8 lg:h-12 flex items-center px-6 text-white w-fit rounded-3xl font-semibold text-xs leading-3 lg:text-base lg:leading-5' style={{backgroundColor: `var(${getTagColor(data.blog.tag)})`}} >{t(data.blog.tag)}</div>
            <div className="flex gap-2 lg:gap-4">
                <p className='font-manrope font-semibold text-sm leading-4 lg:text-base lg:leading-5'>{data.blog.sections.length} MIN. READ</p>
                <p className='text-gray font-manrope font-semibold text-sm leading-4 lg:text-base lg:leading-5'>{new Date(data.blog.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}</p>
            </div>
        </div>  
        <Image 
            src={data.blog.image} 
            alt={data.blog.title[locale]} 
            width={824} 
            height={544} 
            className='w-full aspect-[824/544] object-cover lg:mb-4 rounded-lg lg:rounded-2xl' 
            sizes="(max-width: 1024px) 100vw, 824px" 
        />
        <>
            {
                data.blog.sections.map((section, index) => {
                    return (
                        <Fragment key={index}>
                            <h2 className='font-manrope text-2xl lg:text-[2rem] leading-7 lg:leading-9 uppercase font-semibold my-6 lg:my-8 first-of-type:mt-8'>{section.subtitle[locale]}</h2>
                            <p className='text-sm lg:text-base leading-4 lg:leading-5 whitespace-pre-line'>
                                {section.content[locale]}
                            </p>
                        </Fragment>
                    )
                })
            }
        </>
    </div>
  )
}
