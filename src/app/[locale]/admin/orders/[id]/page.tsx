import { HydrateClient, prefetch, trpc } from '@/app/_trpc/server'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminOrderForm from '@/components/admin/orders/id/AdminOrderForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import React from 'react'

export default async function AdminOrderPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params;

    await prefetch(
      trpc.order.getOrderById.queryOptions({ id }),
    );

    return (
      <HydrateClient>
        <AdminSidebar page={AdminPages.ORDERS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
          <AdminHeader id={"#" + id} href='/admin/orders' page={AdminPages.ORDERS} />
          <AdminOrderForm id={id}/>
        </div>
      </HydrateClient>
    )
}