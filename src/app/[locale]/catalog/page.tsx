
import Catalog from "@/components/catalog/Catalog";
import Header from "@/components/header/Header";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <div className="grid grid-cols-full gap-x-6 col-span-full px-16">
        <Header />
        <Catalog />
    </div>
  );
}