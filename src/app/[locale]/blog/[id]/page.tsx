import { getQueryClient, HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params } : {params: Promise<{locale: string, id: string}>}) {
  
  const { locale, id } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  const queryOptions = trpc.blog.getBlogById.queryOptions({ id });
  const blogData = await queryClient.fetchQuery(queryOptions);

  return {
    title: blogData.blog?.title[locale] || 'Blog',
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
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <BlogSection id={id}/>
        <Recommendations />
        <Faq />
      </div>
      <Footer />
      <LinksMenu />
    </HydrateClient>
  );
}