import { trpc } from '@/app/_trpc/server';
import Footer from '@/components/footer/Footer';
import Faq from '@/components/home/faq/Faq';
import Recommendations from '@/components/home/recommendations/Recommendations';
import ProductInfo from '@/components/product/ProductInfo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import React, { use } from 'react'

export async function generateMetadata() {
    const t = await getTranslations('index.meta');
   
    return {
      title: t('title'),
      description: t('description'),
    };
  }

export default function Product({params}: {params: Promise<{locale: string, id: string}>;}) {
    const {locale, id} = use(params);
    setRequestLocale(locale);
    trpc.products.getProductById.prefetch({id: id});
    trpc.products.getRecProduct.prefetch();

    return (
        <>
            <ProductInfo id={id} />
            <Recommendations indProductSection={true}/>
            <Faq />
            <Footer />
        </>
      );
    }