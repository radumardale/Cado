import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import './globals.css';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '../_trpc/client';

type Locale = (typeof routing.locales)[number];

function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className='scroll-bar-custom'>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <TRPCReactProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </TRPCReactProvider>
          <Toaster position='top-right' visibleToasts={2} duration={2000} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
