'use client'

import { Link } from '@/i18n/navigation';
import { ResOrderInterface } from '@/models/order/types/orderInterface';
import { orderStateColors } from '@/models/order/types/orderState';
import { useTranslations } from 'next-intl';

interface OrdersTableProps {
    queryOrders: ResOrderInterface[]
}

export default function OrdersTable({queryOrders}: OrdersTableProps) {
    const t = useTranslations("Admin.AdminOrders.payment_methods");
    const orders_t = useTranslations("Admin.AdminOrders");
    const statusTexts = useTranslations("Admin.AdminOrders.order_status");
    
  return (
    <>
        <div className='col-span-12 grid grid-cols-12 mt-6 pb-2 border-b border-lightgray gap-x-6 pr-6 mb-8'>
            <p className='font-manrope font-semibold leading-5 pl-6 w-[calc(100%+1.5rem)] col-span-1 overflow-ellipsis overflow-hidden whitespace-nowrap'>{orders_t('id')}</p>
            <p className='font-manrope font-semibold leading-5 col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>{orders_t('date')}</p>
            <p className='font-manrope col-span-3 font-semibold -translate-x-1/8 leading-5'>{orders_t('email')}</p>
            <p className='col-start-7 col-span-1 w-3/2 font-manrope font-semibold leading-5'>{orders_t('phone')}</p>
            <p className='col-span-2 font-manrope font-semibold leading-5 w-3/4 translate-x-2/4 overflow-ellipsis overflow-hidden whitespace-nowrap'>{orders_t('payment_method')}</p>
            <p className='col-span-2 font-manrope font-semibold leading-5 translate-x-1/4 w-3/4 overflow-ellipsis overflow-hidden whitespace-nowrap'>{orders_t('total')}</p>
            <p className='font-manrope font-semibold leading-5'>{orders_t('status')}</p>
        </div>
        {
            queryOrders.map((order: ResOrderInterface, index) => {
                return (
                    <Link href={{pathname: "/admin/orders/[id]", params: {id: order.custom_id}}} key={index} className='grid grid-cols-12 col-span-12 gap-x-6 h-18 border border-gray hover:border-black transition duration-300 rounded-3xl items-center mb-4 last-of-type:mb-6 pr-6'>
                        <p className='pl-6 w-[calc(100%+1.5rem)] col-span-1 z-50'>{order.custom_id}</p>
                        <p className='leading-5 col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>{new Date(order.createdAt).toLocaleDateString('ro-RO')}</p>
                        <p className='col-span-3 font-semibold -translate-x-1/8'>{order.additional_info.user_data.email}</p>
                        <p className='col-start-7 col-span-1 w-3/2'>{order.additional_info.user_data.tel_number}</p>
                        <p className='col-span-2  w-3/4 translate-x-2/4'>{t(order.payment_method)}</p>
                        <p className='col-span-2 font-semibold translate-x-1/4 w-3/4 '>{order.total_cost.toLocaleString()} MDL</p>
                        <p className=' font-semibold' style={{color: orderStateColors[order.state]}}>{statusTexts(order.state)}</p>
                    </Link>
                )
            })
        }
    </>
  )
}
