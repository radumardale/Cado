
import { getQueryClient, HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import Catalog from "@/components/catalog/Catalog";
import Footer from "@/components/footer/Footer";
import LinksMenu from "@/components/LinksMenu";
import SortBy from "@/lib/enums/SortBy";
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

  const queryClient = getQueryClient();

  const minMax = await queryClient.fetchQuery(trpc.products.getMinMaxPrice.queryOptions());

  await prefetch(
    trpc.products.getProducts.infiniteQueryOptions({
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
    })
  )
  
  return (
    <HydrateClient>
      <div className="grid grid-cols-full gap-x-6 col-span-full">
          <Suspense>
            <Catalog />
          </Suspense>
          <Footer />
          <LinksMenu />
      </div>
    </HydrateClient>
  );
}