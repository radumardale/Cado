
import Catalog from "@/components/catalog/Catalog";
import Footer from "@/components/footer/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";

export async function generateMetadata() {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CatalogPage({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <div className="grid grid-cols-full gap-x-6 col-span-full">
        <Suspense>
          <Catalog />
        </Suspense>
        <Footer />
    </div>
  );
}