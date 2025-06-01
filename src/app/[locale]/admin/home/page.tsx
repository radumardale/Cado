import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminPages } from '@/lib/enums/AdminPages'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { serverHelper } from '@/server'
import HomeBannerContent from '@/components/admin/home/homeBanner/HomeBannerContent'
import AdminHomeOcasion from '@/components/admin/home/homeOcasion/AdminHomeOcasion'
import RecommendationsContent from '@/components/admin/home/recommendations/RecommendationsContent'

export default async function AdminHome() {

    const helpers = serverHelper;
    await helpers.home_banner.getAllHomeBanners.prefetch();
    await helpers.homeOcasion.getHomeOcasion.prefetch();
    await helpers.products.getRecProduct.prefetch();
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <>
        <AdminSidebar page={AdminPages.HOME_PAGE} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 min-h-screen gap-x-6 pb-24'>
            <AdminHeader href='/admin/home' page={AdminPages.HOME_PAGE} />

            <HydrationBoundary state={dehydratedState}>
                <HomeBannerContent />
                <AdminHomeOcasion />
                <RecommendationsContent />
            </HydrationBoundary>
        </div>
    </>
  )
}
