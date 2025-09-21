import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBlogGrid from '@/components/admin/blog/AdminBlogGrid';
import { AdminPages } from '@/lib/enums/AdminPages';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');

  return {
    title: t('admin_blog'),
    description: '',
  };
}

export default async function BlogAdmin() {
  return (
    <>
      <AdminSidebar page={AdminPages.BLOG_PAGE} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
        <AdminHeader href='/admin/blog' page={AdminPages.BLOG_PAGE} />
        <AdminBlogGrid />
      </div>
    </>
  );
}
