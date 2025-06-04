import ConfirmationContent from '@/components/confirmation/ConfirmationContent';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { getQueryClient, HydrateClient, prefetch, trpc } from '@/app/_trpc/server';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await prefetch(
        trpc.order.getOrderById.queryOptions({ id })
    );
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.order.getOrderById.queryOptions({ id }));

    return (
        <HydrateClient>
            <Header />
            <ConfirmationContent id={id} />
            <Footer />
        </HydrateClient>
    );
}