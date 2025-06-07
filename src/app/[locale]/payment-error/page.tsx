import type { Metadata } from 'next'
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { PageContent } from './PageContent';

export const metadata: Metadata = {
    title: '',
    robots: {
        index: false,
        follow: false,
    }
}

export default function Page() {
    return (
        <>
            <Header />
            <PageContent />
            <Footer />
        </>
    );
}
