import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import OrdersContent from '@/components/admin/orders/OrdersContent'
import OrdersFilter from '@/components/admin/orders/OrdersFilter'
import { AdminPages } from '@/lib/enums/AdminPages'

export default async function AdminOrders() {

  return (
    <>
        <AdminSidebar page={AdminPages.ORDERS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>  
          <AdminHeader href='/admin/orders' page={AdminPages.ORDERS} />
          <OrdersFilter />
          <OrdersContent />
        </div>
    </>
  )
}
