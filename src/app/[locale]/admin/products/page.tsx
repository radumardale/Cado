import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProductsContent from '@/components/admin/products/ProductsContent'
import ProductsFilter from '@/components/admin/products/ProductsFilter'
import { AdminPages } from '@/lib/enums/AdminPages'
import SortBy from '@/lib/enums/SortBy'
import { serverHelper } from '@/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

export default async function AdminProducts() {

  const helpers = serverHelper;
  await helpers.products.getAdminProducts.prefetchInfinite({
    title: null,
    limit: 8,
    sortBy: SortBy.LATEST,
  });
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <>
        <AdminSidebar page={AdminPages.PRODUCTS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
          <AdminHeader href='/admin/products' page={AdminPages.PRODUCTS} />
          <ProductsFilter />
          <HydrationBoundary state={dehydratedState}>
            <ProductsContent />
          </HydrationBoundary>
        </div>
    </>
  )
}
