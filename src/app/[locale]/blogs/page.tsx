
import { HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import Hero from "@/components/blog/Hero";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = 'force-static'

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

  await prefetch(
    trpc.blog.getAllBlogs.queryOptions(),
  );

  return (
    <HydrateClient>
        <Header />
        <Hero />
        <Recommendations />
        <Faq />
        <Footer />
        <LinksMenu />
    </HydrateClient>
  );
}