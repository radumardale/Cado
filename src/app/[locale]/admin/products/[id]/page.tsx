import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminUpdateProductForm from '@/components/admin/products/id/AdminUpdateProductForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import { serverHelper } from '@/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

export default async function AdminProductPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params;

    const helpers = serverHelper;
    await helpers.products.getProductById.prefetch({ id });
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

    return (
        <>
            <AdminSidebar page={AdminPages.PRODUCTS} />
            <div className='col-span-12 grid grid-cols-12 h-screen gap-x-6'>
                <AdminHeader id={"#" + id} href='/admin/products' page={AdminPages.PRODUCTS} />
                <HydrationBoundary state={dehydratedState}>
                  <AdminUpdateProductForm id={id}/>
                </HydrationBoundary>
            </div>
        </>
    )
}
