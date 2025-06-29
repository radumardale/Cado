import ConfirmationContent from '@/components/confirmation/ConfirmationContent';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { getQueryClient, HydrateClient, prefetch, trpc } from '@/app/_trpc/server';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('confirmation'),
    description: '',
  };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await prefetch(
        trpc.order.getOrderById.queryOptions({ id })
    );
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.order.getOrderById.queryOptions({ id }));

    return (
        <HydrateClient>
            <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
                <Header />
                <ConfirmationContent id={id} />
            </div>
            <Footer />
        </HydrateClient>
    );
}