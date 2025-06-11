
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
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('blogs'),
    description: '',
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
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <Hero />
        <Recommendations />
        <Faq />
      </div>
      <Footer />
      <LinksMenu />
    </HydrateClient>
  );
}