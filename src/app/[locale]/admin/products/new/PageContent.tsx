'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminPages } from '@/lib/enums/AdminPages';
import React from 'react';
import AdminAddProductForm from '@/components/admin/products/new/AdminAddProductForm';

export default function AdminProductPage() {
  return (
    <>
      <AdminSidebar page={AdminPages.PRODUCTS} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-screen gap-x-6'>
        <AdminHeader id={'nou'} href='/admin/products' page={AdminPages.PRODUCTS} />
        <AdminAddProductForm />
      </div>
    </>
  );
}
