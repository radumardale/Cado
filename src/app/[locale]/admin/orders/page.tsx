import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import OrdersContent from '@/components/admin/orders/OrdersContent'
import OrdersFilter from '@/components/admin/orders/OrdersFilter'
import { AdminPages } from '@/lib/enums/AdminPages'
// import SortBy from '@/lib/enums/SortBy'
import { serverHelper } from '@/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

export default async function AdminOrders() {
  const helpers = serverHelper;
  // const orders = await helpers.order.getAllOrders.fetchInfinite({
  //   limit: 8,
  //   sortBy: SortBy.LATEST,
  // });
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  // console.log(orders.pages[0])

  return (
    <>
        <AdminSidebar page={AdminPages.ORDERS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>  
          <AdminHeader href='/admin/orders' page={AdminPages.ORDERS} />
          <OrdersFilter />
          <HydrationBoundary state={dehydratedState}>
            <OrdersContent />
          </HydrationBoundary>
        </div>
    </>
  )
}
