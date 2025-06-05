import { HydrateClient, prefetch, trpc } from '@/app/_trpc/server';
import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import LinksMenu from '@/components/LinksMenu';
import ProductInfo from '@/components/product/ProductInfo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
export const dynamic = 'force-static'
export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata() {
    const t = await getTranslations('index.meta');
   
    return {
      title: t('title'),
      description: t('description'),
    };
  }

  export default async function Product({ params }: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    await prefetch(
      trpc.products.getProductById.queryOptions({ id }, { staleTime: 10000 })
    );

    return (
      <HydrateClient>
        <ProductInfo id={id} />
        <Recommendations indProductSection={true} />
        <Faq />
        <Footer />
        <LinksMenu />
      </HydrateClient>
    );
}