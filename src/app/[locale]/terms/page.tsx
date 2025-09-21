
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import LinksMenu from "@/components/LinksMenu";
import TermsContainer from "@/components/terms/TermsContainer";
import { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { generateHreflangMetadata } from "@/components/seo/HreflangLinks";
import { use } from "react";

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
    pathname: '/terms',
    locale: locale as 'ro' | 'ru' | 'en'
  });

  return {
    title: t('terms'),
    description: desc_t('terms'),
    ...hreflangMeta,
    openGraph: {
      type: "website",
      title: t('terms'),
      description:
        desc_t('terms'),
      images: [
        {
          url: imageUrl,
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('terms'),
      description:
        desc_t('terms'),
      images: [imageUrl],
    },
  };
}

export default function AboutUs({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
          <Header />
          <TermsContainer />
          <LinksMenu />
      </div>
      <Footer />
    </>
  );
}