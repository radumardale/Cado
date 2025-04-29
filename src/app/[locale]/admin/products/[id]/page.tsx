import { trpc } from '@/app/_trpc/server'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminUpdateProductForm from '@/components/admin/products/id/AdminUpdateProductForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import React from 'react'

export default async function AdminProductPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params;
    trpc.products.getProductById.prefetch({id});

    return (
        <>
            <AdminSidebar page={AdminPages.PRODUCTS} />
            <div className='col-span-12 grid grid-cols-12 h-screen gap-x-6'>
                <AdminHeader id={"#" + id} href='/admin/products' page={AdminPages.PRODUCTS} />
                <AdminUpdateProductForm id={id}/>
            </div>
        </>
    )
}
