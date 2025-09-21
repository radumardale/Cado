import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminUpdateProductForm from '@/components/admin/products/id/AdminUpdateProductForm';
import { AdminPages } from '@/lib/enums/AdminPages';

export default async function AdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <AdminSidebar page={AdminPages.PRODUCTS} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-screen gap-x-6'>
        <AdminHeader id={'#' + id} href='/admin/products' page={AdminPages.PRODUCTS} />
        <AdminUpdateProductForm id={id} />
      </div>
    </>
  );
}
