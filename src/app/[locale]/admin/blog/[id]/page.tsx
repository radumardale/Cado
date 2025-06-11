import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBlogForm from '@/components/admin/blog/id/AdminBlogForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('admin_blog'),
    description: "",
  };
}

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