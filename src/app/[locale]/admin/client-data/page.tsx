import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ClientContent from '@/components/admin/client-data/ClientContent';
import ClientFilter from '@/components/admin/client-data/ClientFilter';
import { AdminPages } from '@/lib/enums/AdminPages';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');

  return {
    title: t('admin_client_data'),
    description: '',
  };
}

export default async function ClientData() {
  return (
    <>
      <AdminSidebar page={AdminPages.CLIENTS} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>
        <AdminHeader href='/admin/orders' page={AdminPages.CLIENTS} />
        <ClientFilter />
        <ClientContent />
      </div>
    </>
  );
}
