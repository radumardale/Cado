'use client'

import { Link } from '@/i18n/navigation';
import { ResOrderInterface } from '@/models/order/types/orderInterface';
import { orderStateColors } from '@/models/order/types/orderState';
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl';

interface OrdersTableProps {
    queryOrders: ResOrderInterface[]
}

export default function OrdersTable({queryOrders}: OrdersTableProps) {
    const t = useTranslations("payment_methods");
    const statusTexts = useTranslations("order_status");
    
  return (
    <>
        <div className='col-span-12 grid grid-cols-12 mt-6 pb-2 border-b border-lightgray gap-x-6 pr-6'>
            <p className='font-manrope font-semibold leading-5 pl-6 w-[calc(100%+1.5rem)] col-span-1 whitespace-nowrap'>ID comandă</p>
            <p className='font-manrope font-semibold leading-5 col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>Data</p>
            <p className='font-manrope col-span-2 font-semibold -translate-x-1/4 w-[125%] leading-5'>Email</p>
            <p className='col-start-6 col-span-2 font-manrope font-semibold leading-5'>Telefon</p>
            <p className='col-span-2 font-manrope font-semibold leading-5'>Metoda de achitare</p>
            <p className='col-span-2 font-manrope font-semibold leading-5'>Total comandă</p>
            <p className='font-manrope font-semibold leading-5'>Status</p>
        </div>
        <Link href="/admin/orders/new" className='col-span-full h-18 flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-3xl mt-8 border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'>
            <Plus strokeWidth={1.5} className='size-6'/>
            <p>Adaugă comandă</p>
        </Link>
        {
            queryOrders.map((order: ResOrderInterface, index) => {
                return (
                    <Link href={{pathname: "/admin/orders/[id]", params: {id: order.custom_id}}} key={index} className='grid grid-cols-12 col-span-12 gap-x-6 h-18 border border-gray hover:border-black transition duration-300 rounded-3xl items-center mb-4 last-of-type:mb-6 pr-6'>
                        <p className='pl-6 w-[calc(100%+1.5rem)] col-span-1 z-50'>{order.custom_id}</p>
                        <p className='leading-5 col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>{new Date(order.createdAt).toLocaleDateString('ro-RO')}</p>
                        <p className='col-span-2 font-semibold -translate-x-1/4 w-[125%]'>{order.additional_info.user_data.email}</p>
                        <p className='col-start-6 col-span-2'>{order.additional_info.user_data.tel_number}</p>
                        <p className='col-span-2'>{t(order.payment_method)}</p>
                        <p className='col-span-2 font-semibold'>{order.total_cost.toLocaleString()} MDL</p>
                        <p className='font-semibold' style={{color: orderStateColors[order.state]}}>{statusTexts(order.state)}</p>
                    </Link>
                )
            })
        }
    </>
  )
}
