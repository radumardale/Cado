import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProductsContent from '@/components/admin/products/ProductsContent'
import ProductsFilter from '@/components/admin/products/ProductsFilter'
import { AdminPages } from '@/lib/enums/AdminPages'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('admin_products'),
  };
}

export default async function AdminProducts() {

  return (
    <>
        <AdminSidebar page={AdminPages.PRODUCTS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
          <AdminHeader href='/admin/products' page={AdminPages.PRODUCTS} />
          <ProductsFilter />
          <ProductsContent />
        </div>
    </>
  )
}
