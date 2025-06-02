import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import LinksMenu from '@/components/LinksMenu';
import ProductInfo from '@/components/product/ProductInfo';
import { serverHelper } from '@/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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

    const helpers = serverHelper;
    
    try {
        // Critical path: Get main product data first
        const productData = await helpers.products.getProductById.fetch({ id });
        
        if (!productData?.product) {
            notFound();
        }
        
        // Parallel prefetch of non-critical data
        await Promise.all([
            // Only prefetch essential recommendations
            helpers.products.getRecProduct.prefetch(),
            // Prefetch similar products if we have category data
            productData.product.categories[0] 
                ? helpers.products.getSimilarProducts.prefetch({
                    category: productData.product.categories[0],
                    productId: productData.product.custom_id
                  })
                : Promise.resolve()
        ]);
        
        const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

        return (
            <HydrationBoundary state={dehydratedState}>
                {/* Critical content loads immediately */}
                <ProductInfo id={id} />
                
                {/* Non-critical content loads progressively */}
                <Suspense fallback={<RecommendationsLoading />}>
                    <Recommendations indProductSection={true} />
                </Suspense>
                
                <Suspense fallback={<FaqLoading />}>
                    <Faq />
                </Suspense>
                
                <Footer />
                <LinksMenu />
            </HydrationBoundary>
        );
    } catch (error) {
        console.error('Error loading product page:', error);
        notFound();
    }
}

// Loading components for Suspense
function RecommendationsLoading() {
  return (
      <div className="py-16">
          <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-[3/4]" />
                  ))}
              </div>
          </div>
      </div>
  );
}

function FaqLoading() {
  return (
      <div className="py-16">
          <div className="container mx-auto space-y-4">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-16" />
              ))}
          </div>
      </div>
  );
}