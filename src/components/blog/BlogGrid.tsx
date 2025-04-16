'use client'

import React, { Fragment } from 'react'
import BlogCard from './BlogCard';
import { trpc } from '@/app/_trpc/client';
import { useLocale } from 'next-intl';
import BlogSkeleton from './BlogSkeleton';
import { BlogInterface } from '@/models/blog/types/BlogInterface';

export default function BlogGrid() {
    const {data, isLoading} = trpc.blog.getAllBlogs.useQuery();
    const locale = useLocale();

  return (
    <div className='col-span-full lg:col-start-2 lg:col-span-13 grid grid-cols-13 gap-y-8 lg:gap-y-12 gap-x-6 mb-24 lg:mb-42'>
        {
            isLoading || !data?.blogs ?
            <>
                {
                    Array.from({length: 4}).map((_, index) => {
                        return (
                            <Fragment key={index}>
                                <BlogSkeleton />
                                {(index + 1) % 2 !== 0 && <div className='col-span-1'></div>}
                            </Fragment>
                        )
                    })
                }
            </>
            :
            <>
            {
                data.blogs.map((blog: BlogInterface, index: number) => {
                    return (
                        <Fragment key={index}>
                            <BlogCard 
                                id={blog._id}
                                src={blog.image} 
                                tag={blog.tag} 
                                title={blog.title[locale]} 
                                date={new Date(blog.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')} 
                            />
                            {(index + 1) % 2 !== 0 && <div className='col-span-1 hidden lg:block'></div>}
                        </Fragment>
                    )
                })
            }
            </>
        }
    </div>
  )
}