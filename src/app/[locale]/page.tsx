
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Blog from "@/components/blog/Blog";
import CategoriesGrid from "@/components/home/categories/CategoriesGrid";
import Collaboration from "@/components/home/collaboration/Collaboration";
import Faq from "@/components/home/faq/Faq";
import Hero from "@/components/home/hero/Hero";
import Recommendations from "@/components/home/recommendations/Recommendations";
import Reviews from "@/components/home/reviews/Reviews";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LinksMenu from "@/components/LinksMenu";
import { serverHelper } from "@/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const helpers = serverHelper;
  await helpers.products.getRecProduct.prefetch();
  await helpers.blog.getLimitedBlogs.prefetch({limit: 6});
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

  return (
    <HydrationBoundary state={dehydratedState}>
        <Header />
        <Hero />
        <CategoriesGrid />
        <Recommendations />
        <Collaboration />
        <Reviews />
        <Blog />
        <Faq />
        <Footer />
        <LinksMenu />
    </HydrationBoundary>
  );
}