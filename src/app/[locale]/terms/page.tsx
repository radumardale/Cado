
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import LinksMenu from "@/components/LinksMenu";
import TermsContainer from "@/components/terms/TermsContainer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('terms'),
    description: "",
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