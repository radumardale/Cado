import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ClientContent from "@/components/admin/client-data/ClientContent";
import ClientFilter from "@/components/admin/client-data/ClientFilter";
import { AdminPages } from "@/lib/enums/AdminPages";
import SortBy from "@/lib/enums/SortBy";
import { serverHelper } from "@/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ClientData() {
    const helpers = serverHelper;
    await helpers.getAllClients.prefetchInfinite({
      limit: 8,
      sortBy: SortBy.LATEST,
    });
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <>
       <AdminSidebar page={AdminPages.CLIENTS} />
        <div className='col-span-full xl:col-span-12 grid grid-cols-12 h-fit gap-x-6'>  
          <AdminHeader href='/admin/orders' page={AdminPages.CLIENTS} />
          <ClientFilter />
          <HydrationBoundary state={dehydratedState}>
            <ClientContent />
          </HydrationBoundary>
        </div>
    </>
  )
}
