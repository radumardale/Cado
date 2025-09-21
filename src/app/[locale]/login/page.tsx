import { getLocale, getTranslations } from "next-intl/server";
import { generateHreflangMetadata } from '@/components/seo/HreflangLinks';

import AdminPage from "./PageContent";

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
  const locale = await getLocale();

  const hreflangMeta = generateHreflangMetadata({
    pathname: '/login',
    locale: locale as 'ro' | 'ru' | 'en'
  });

  return {
    title: t('login'),
    ...hreflangMeta,
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default function Page() {
  return <AdminPage />
}
