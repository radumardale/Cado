'use client'

import React, { Fragment } from 'react'
import BlogCard from './BlogCard';
import { trpc } from '@/app/_trpc/client';
import { useLocale } from 'next-intl';
import BlogSkeleton from './BlogSkeleton';

export default function BlogGrid() {
    const {data, isLoading} = trpc.blog.getLimitedBlogs.useQuery({limit: 4});
    const locale = useLocale();

  return (
    <div className='col-start-2 col-span-13 grid grid-cols-13 gap-y-12 gap-x-6 mb-42'>
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
                data.blogs.map((blog, index) => {
                    return (
                        <Fragment key={index}>
                            <BlogCard 
                                id={blog._id}
                                src={blog.image} 
                                tag={blog.tag} 
                                title={blog.title[locale]} 
                                date={new Date(blog.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')} 
                            />
                            {(index + 1) % 2 !== 0 && <div className='col-span-1'></div>}
                        </Fragment>
                    )
                })
            }
            </>
        }
    </div>
  )
}