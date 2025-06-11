import { getQueryClient, HydrateClient, prefetch, trpc } from '@/app/_trpc/server';
import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import LinksMenu from '@/components/LinksMenu';
import ProductInfo from '@/components/product/ProductInfo';
import { setRequestLocale } from 'next-intl/server';
export const dynamic = 'force-static'
export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) {
  
  const { locale, id } = await params;

  const queryClient = getQueryClient();

  const queryOptions = trpc.products.getProductById.queryOptions({ id });
  const productData = await queryClient.fetchQuery(queryOptions);

  const title = productData.product?.title[locale] || 'Product';
  const description = productData.product?.description?.[locale] || '';
  const image = productData.product?.images?.[0] || 'https://your-default-image-url.com/default.jpg';

  return {
    title: title,
    description: description,
    openGraph: {
      title : title,
      description : description ,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
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
        <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
          <ProductInfo id={id} />
          <Recommendations indProductSection={true} />
          <Faq />
        </div>
        <Footer />
        <LinksMenu />
      </HydrateClient>
    );
}