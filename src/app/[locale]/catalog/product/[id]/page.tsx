import { getQueryClient, HydrateClient, prefetch, trpc } from '@/app/_trpc/server';
import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import LinksMenu from '@/components/LinksMenu';
import ProductInfo from '@/components/product/ProductInfo';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { generateProductBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
export const dynamic = 'force-static'
export const revalidate = 3600;
// @ts-expect-error ggg
import { htmlToText } from 'html-to-text';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) : Promise<Metadata> {
  
  const { locale, id } = await params;

  const queryClient = getQueryClient();

  const queryOptions = trpc.products.getProductById.queryOptions({ id });
  const productData = await queryClient.fetchQuery(queryOptions);

  const title = productData.product?.title[locale] || 'Product';
  const descriptionResponse = productData.product?.long_description?.[locale] || '';
  const description = htmlToText(descriptionResponse);

  const image = `${productData.product?.images?.[0]}` || 'https://your-default-image-url.com/default.jpg';

  return {
    title: title,
    description: description,
    openGraph: {
      title : title,
      description : description ,
      images: [
        {
          url: image,
          alt: title
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

    const queryClient = getQueryClient();

    const queryOptions = trpc.products.getProductById.queryOptions({ id }, { staleTime: 10000 });
    await prefetch(queryOptions);

    // Access cached product data for breadcrumb generation (no additional database call)
    const productData = queryClient.getQueryData(queryOptions.queryKey) ||
      await queryClient.fetchQuery(queryOptions); // Fallback if not cached

    // Generate breadcrumb schema
    const baseUrl = process.env.BASE_URL || 'https://cado.md';
    const breadcrumbSchema = generateProductBreadcrumbSchema(
      baseUrl,
      locale,
      productData.product?.title[locale] || 'Product',
      id,
      productData.product?.categories?.[0], // Use first category if available
      productData.product?.ocasions?.[0] // Use first ocasion if available
    );

    return (
      <>
      <BreadcrumbJsonLd breadcrumbSchema={breadcrumbSchema} />
      <HydrateClient>
        <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
          <ProductInfo id={id} />
          <Recommendations indProductSection={true} />
          <Faq />
        </div>
        <Footer />
        <LinksMenu />
      </HydrateClient>
      </>
    );
}