
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Blog from "@/components/blog/Blog";
import CategoriesGrid from "@/components/home/categories/CategoriesGrid";
import Collaboration from "@/components/home/collaboration/Collaboration";
import Faq from "@/components/home/faq/Faq";
import Hero from "@/components/home/hero/Hero";
import Recommendations from "@/components/home/recommendations/Recommendations";
import Reviews from "@/components/home/reviews/Reviews";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import LinksMenu from "@/components/LinksMenu";
import { HydrateClient, prefetch, trpc } from "../_trpc/server";
import { Metadata } from "next";
import { generateHreflangMetadata } from "@/components/seo/HreflangLinks";
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

  const hreflangMeta = generateHreflangMetadata({
    pathname: '/',
    locale: locale as 'ro' | 'ru' | 'en'
  });

  return {
    title: t('home'),
    description: desc_t('home'),
    ...hreflangMeta,
    openGraph: {
      type: "website",
      title: t('home'),
      description:
        desc_t('home'),
      images: [
        {
          url: imageUrl,
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('home'),
      description:
        desc_t('home'),
      images: [imageUrl],
    },
  };
}

export default async function Home({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = await params;
  setRequestLocale(locale);

  await prefetch(
    trpc.home_banner.getFirstHomeBanner.queryOptions(undefined, {staleTime: Infinity}),
  );

  return (
    <HydrateClient>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <Hero />
        <CategoriesGrid />
        <Recommendations />
        <Collaboration />
        <Reviews />
        <Blog />
        <Faq />
        <LinksMenu />
      </div>
      <Footer />
    </HydrateClient>
  );
}