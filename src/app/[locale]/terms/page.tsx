
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import LinksMenu from "@/components/LinksMenu";
import TermsContainer from "@/components/terms/TermsContainer";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({ params }: { params: { locale: string } }) : Promise<Metadata> {
  setRequestLocale(params.locale);
  const t = await getTranslations('PageTitles');
  const desc_t = await getTranslations('PageDescriptions');
 
  return {
    title: t('terms'),
    description: desc_t('terms'),
    openGraph: {
      type: "website",
      url: "https://metatags.io/",
      title: t('terms'),
      description:
        desc_t('terms'),
      images: [
        {
          url: "https://metatags.io/images/meta-tags.png",
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('terms'),
      description:
        desc_t('terms'),
      images: ["https://metatags.io/images/meta-tags.png"],
      site: "https://metatags.io/",
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