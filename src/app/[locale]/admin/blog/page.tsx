import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBlogGrid from '@/components/admin/blog/AdminBlogGrid';
import { AdminPages } from '@/lib/enums/AdminPages';
import { serverHelper } from '@/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react'

export default async function BlogAdmin() {
    const helpers = serverHelper;
    await helpers.blog.getAllBlogs.prefetch()
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <HydrationBoundary state={dehydratedState}>
        <AdminSidebar page={AdminPages.BLOG_PAGE} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>  
          <AdminHeader href='/admin/blog' page={AdminPages.BLOG_PAGE} />
          <HydrationBoundary state={dehydratedState}>
            <AdminBlogGrid />
          </HydrationBoundary>
        </div>
    </HydrationBoundary>
  )
}
