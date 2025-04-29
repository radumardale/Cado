
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
import { use } from "react";
import { trpc } from "../_trpc/server";
import LinksMenu from "@/components/LinksMenu";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  setRequestLocale(locale);
  trpc.products.getRecProduct.prefetch();
  trpc.blog.getLimitedBlogs.prefetch({limit: 6});

  return (
    <>
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
    </>
  );
}