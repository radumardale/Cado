import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminPages } from '@/lib/enums/AdminPages';
import HomeBannerContent from '@/components/admin/home/homeBanner/HomeBannerContent';
import AdminHomeOcasion from '@/components/admin/home/homeOcasion/AdminHomeOcasion';
import RecommendationsContent from '@/components/admin/home/recommendations/RecommendationsContent';
import AdminSeasonCatalog from '@/components/admin/home/seasonCatalog/AdminSeasonCatalog';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');

  return {
    title: t('admin_home'),
    description: '',
  };
}

export default async function AdminHome() {
  return (
    <>
      <AdminSidebar page={AdminPages.HOME_PAGE} />
      <div className='col-span-full xl:col-span-12 grid grid-cols-12 min-h-screen gap-x-6 pb-24'>
        <AdminHeader href='/admin/home' page={AdminPages.HOME_PAGE} />
        <HomeBannerContent />
        <AdminHomeOcasion />
        <RecommendationsContent />
        <AdminSeasonCatalog />
      </div>
    </>
  );
}
