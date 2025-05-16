
import Hero from "@/components/blog/Hero";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { serverHelper } from "@/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutUs({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const helpers = serverHelper;
  await helpers.blog.getAllBlogs.prefetch();
  await helpers.products.getRecProduct.prefetch();
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <HydrationBoundary state={dehydratedState}>
        <Header />
        <Hero />
        <Recommendations />
        <Faq />
        <Footer />
        <LinksMenu />
    </HydrationBoundary>
  );
}