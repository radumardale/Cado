import { HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutUs({params}: {params: Promise<{locale: string, id: string}>;}) {
  const {locale, id} = await params;
  setRequestLocale(locale);

  await prefetch(
    trpc.blog.getBlogById.queryOptions({ id }),
  );

  return (
    <HydrateClient>
      <Header />
      <BlogSection id={id}/>
      <Recommendations />
      <Faq />
      <Footer />
      <LinksMenu />
    </HydrateClient>
  );
}