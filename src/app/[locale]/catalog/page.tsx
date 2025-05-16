
import Catalog from "@/components/catalog/Catalog";
import Footer from "@/components/footer/Footer";
import LinksMenu from "@/components/LinksMenu";
import SortBy from "@/lib/enums/SortBy";
import { serverHelper } from "@/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CatalogPage({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const helpers = serverHelper;

  const minMax = await helpers.products.getMinMaxPrice.fetch();

  await helpers.products.getProducts.prefetchInfinite({
    title: null,
    category: null,
    limit: 8,
    sortBy: SortBy.RECOMMENDED,
    price: {
      min: minMax.minPrice || 0,
      max: minMax.maxPrice || 0
    },
    ocasions: [],          
    productContent: []
  });
  

  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid grid-cols-full gap-x-6 col-span-full">
          <Suspense>
            <Catalog />
          </Suspense>
          <Footer />
          <LinksMenu />
      </div>
    </HydrationBoundary>
  );
}