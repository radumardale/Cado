import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOrderForm from '@/components/admin/orders/id/AdminOrderForm';
import { AdminPages } from '@/lib/enums/AdminPages';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');

  return {
    title: t('admin_orders'),
    description: '',
  };
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <AdminSidebar page={AdminPages.ORDERS} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
        <AdminHeader id={'#' + id} href='/admin/orders' page={AdminPages.ORDERS} />
        <AdminOrderForm id={id} />
      </div>
    </>
  );
}
