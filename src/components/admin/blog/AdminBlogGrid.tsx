'use client';
import React, { Fragment } from 'react'
import { useTRPC } from '@/app/_trpc/client';
import { useLocale } from 'next-intl';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import BlogSkeleton from '@/components/blog/BlogSkeleton';
import AdminBlogCard from './AdminBlogCard';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';

import { useQuery } from "@tanstack/react-query";

export default function AdminBlogGrid() {
    const trpc = useTRPC();
    const {data, isLoading} = useQuery(trpc.blog.getAllBlogs.queryOptions());
    const locale = useLocale();

    return (
        <div className='col-span-full xl:col-span-12 grid grid-cols-14 xl:grid-cols-12 gap-y-8 lg:gap-y-12 gap-x-6 mt-16 mb-24 lg:mb-42'>
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
                    <Link href="/admin/blog/new" className='col-span-7 xl:col-span-6 aspect-[708/464] flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-2xl border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'>
                        <Plus strokeWidth={1.5} className='size-6'/>
                        <p>Adaugă noutate</p>
                    </Link>
                    {
                        data.blogs.map((blog: BlogInterface, index: number) => {
                            return (
                                <Fragment key={index}>
                                    <AdminBlogCard 
                                        id={blog._id}
                                        src={blog.image} 
                                        tag={blog.tag} 
                                        title={blog.title[locale]} 
                                        date={new Date(blog.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')} 
                                    />
                                </Fragment>
                            );
                        })
                    }
                </>
            }
        </div>
    );
}