import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBlogForm from '@/components/admin/blog/id/AdminBlogForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import React from 'react'

export default async function AdminBlogPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params;

    return (
      <>
        <AdminSidebar page={AdminPages.BLOG_PAGE} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 gap-x-6'>
          <AdminHeader id={"#" + id} href='/admin/blog' page={AdminPages.BLOG_PAGE} />
          <AdminBlogForm id={id}/>
        </div>
      </>
    )
}