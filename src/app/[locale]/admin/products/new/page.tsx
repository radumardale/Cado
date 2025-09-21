import { getTranslations } from 'next-intl/server';
import AdminProductPage from './PageContent';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');

  return {
    title: t('admin_new_product'),
  };
}

export default function Page() {
  return <AdminProductPage />;
}
