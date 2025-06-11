import { getTranslations } from "next-intl/server";

import AdminPage from "./PageContent";

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('login'),
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default function Page() {
  return <AdminPage />
}
