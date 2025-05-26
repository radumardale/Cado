import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import LinksMenu from '@/components/LinksMenu';
import ProductInfo from '@/components/product/ProductInfo';
import { Categories } from '@/lib/enums/Categories';
import { serverHelper } from '@/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('index.meta');
   
    return {
      title: t('title'),
      description: t('description'),
    };
  }

export default async function Product({params}: {params: Promise<{locale: string, id: string}>;}) {
    const {locale, id} = await params;
    setRequestLocale(locale);

    const helpers = serverHelper;
    const data = await helpers.products.getProductById.fetch({ id });
    await helpers.products.getRecProduct.prefetch();
    await helpers.products.getSimilarProducts.prefetch({category: data?.product?.categories[0] || Categories.FOR_HIM, productId: data?.product?.custom_id || ""})
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductInfo id={id} />
            <Recommendations indProductSection={true}/>
            <Faq />
            <Footer />
            <LinksMenu />
        </HydrationBoundary>
      );
    }