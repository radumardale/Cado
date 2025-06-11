
import { getQueryClient, HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import Catalog from "@/components/catalog/Catalog";
import LinkMenuWrapper from "@/components/catalog/LinkMenuWrapper";
import Footer from "@/components/footer/Footer";
import SortBy from "@/lib/enums/SortBy";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = 'force-static'
export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('catalog'),
    description: '',
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

  await prefetch(
    trpc.seasonCatalog.getSeasonCatalog.queryOptions()
  )
  
  return (
    <>
    <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
      <div className="grid grid-cols-full gap-x-6 col-span-full">
          <HydrateClient>
            <Catalog />
          </HydrateClient>
          <LinkMenuWrapper /> 
      </div>
    </div>
    <Footer />
    </>
  );
}