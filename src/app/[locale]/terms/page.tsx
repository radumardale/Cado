
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import TermsContainer from "@/components/terms/TermsContainer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function AboutUs({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <>
        <Header />
        <TermsContainer />
        <Footer />
    </>
  );
}