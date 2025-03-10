import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({params}: {params: Promise<{locale: string}>;}) {
  const t = await getTranslations('index.meta');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home({params}: {params: Promise<{locale: string}>;}) {
  const {locale} = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('index');
  return (
    <>
      <div>{t('title')}</div>
    </>
  );
}