
import { HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import Hero from "@/components/blog/Hero";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
export const dynamic = 'force-static'

export async function generateMetadata() : Promise<Metadata> {
  const t = await getTranslations('PageTitles');
  const desc_t = await getTranslations('PageDescriptions');

  const locale = await getLocale();
      
      const imagePaths = {
        en: "/opengraph/en.jpg",
        ru: "/opengraph/ru.jpg",
        ro: "/opengraph/ro.jpg",
      }
    
      const imageUrl = imagePaths[locale as keyof typeof imagePaths] || imagePaths.ro;
 
  return {
    title: t('blogs'),
    description: desc_t('blogs'),
    openGraph: {
      type: "website",
      title: t('blogs'),
      description:
        desc_t('blogs'),
      images: [
        {
          url: imageUrl,
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('blogs'),
      description:
        desc_t('blogs'),
      images: [imageUrl],
    },
  };
}

export default async function AboutUs() {

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