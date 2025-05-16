import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminOrderForm from '@/components/admin/orders/id/AdminOrderForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import { serverHelper } from '@/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

export default async function AdminOrderPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params;

    const helpers = serverHelper;
    await helpers.order.getOrderById.prefetch({ id });
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

    return (
        <>
            <AdminSidebar page={AdminPages.ORDERS} />
            <div className='col-span-12 grid grid-cols-12 h-screen gap-x-6'>
                <AdminHeader id={"#" + id} href='/admin/orders' page={AdminPages.ORDERS} />
                <HydrationBoundary state={dehydratedState}>
                  <AdminOrderForm id={id}/>
                </HydrationBoundary>
            </div>
        </>
    )
}