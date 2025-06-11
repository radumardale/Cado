
import Hero from "@/components/about-us/Hero";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Blog from "@/components/blog/Blog";
import Collaboration from "@/components/home/collaboration/Collaboration";
import Faq from "@/components/home/faq/Faq";
import Reviews from "@/components/home/reviews/Reviews";
import { getTranslations } from "next-intl/server";
import LinksMenu from "@/components/LinksMenu";
import { Metadata } from "next";

export async function generateMetadata() : Promise<Metadata> {
  const t = await getTranslations('PageTitles');
  const desc_t = await getTranslations('PageDescriptions');
 
  return {
    title: t('about'),
    description: desc_t('about'),
    openGraph: {
      type: "website",
      url: "https://metatags.io/",
      title: t('about'),
      description:
        desc_t('about'),
      images: [
        {
          url: "https://metatags.io/images/meta-tags.png",
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('about'),
      description:
        desc_t('about'),
      images: ["https://metatags.io/images/meta-tags.png"],
      site: "https://metatags.io/",
    },
  };
}

export default function AboutUs() {

  return (
    <>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
          <Header />
          <Hero />
          <Collaboration />
          <Reviews />
          <Blog />
          <Faq />
      </div>
      <Footer />
      <LinksMenu />
    </>
  );
}