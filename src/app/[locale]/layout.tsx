/* eslint-disable  @typescript-eslint/no-explicit-any */

import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import "./globals.css";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "../_trpc/client";
import { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata() : Promise<Metadata> {

  const locale = await getLocale();

  const imagePaths = {
    en: "/opengraph/en.jpg",
    ru: "/opengraph/ru.jpg",
    ro: "/opengraph/ro.jpg",
  }

  return {
    openGraph: {
      type: "website",
      images: [
        {
          url: imagePaths[locale as keyof typeof imagePaths] || imagePaths.en,
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [imagePaths[locale as keyof typeof imagePaths] || imagePaths.en],
    },
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {

  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="scroll-bar-custom">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <TRPCReactProvider>
              <SmoothScroll>
                {children} 
              </SmoothScroll>
            </TRPCReactProvider>
        <Toaster 
          position="top-right"
          visibleToasts={2} 
          duration={2000} 
        />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
