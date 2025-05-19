import ConfirmationContent from '@/components/confirmation/ConfirmationContent';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { serverHelper } from '@/server';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const helpers = serverHelper;
    await helpers.order.getOrderById.prefetch({ id });
    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(helpers.queryClient)));

    return (
        <HydrationBoundary state={dehydratedState}>
            <Header />
            <ConfirmationContent id={id} />
            <Footer />
        </HydrationBoundary>
    );
}