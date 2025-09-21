import ContactForm from '@/components/contacts/ContactForm'
import Maps from '@/components/contacts/Maps'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import LinksMenu from '@/components/LinksMenu'
import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { generateHreflangMetadata } from '@/components/seo/HreflangLinks'
import React from 'react'

export async function generateMetadata() : Promise<Metadata> {
  const t = await getTranslations('PageTitles');
  const desc_t = await getTranslations('PageDescriptions');

  const locale = await getLocale();
  
  const imagePaths = {
    en: "/opengraph/en.jpg",
    ru: "/opengraph/ru.jpg",
    ro: "/opengraph/ro.jpg",
  }

  const imageUrl = imagePaths[locale as keyof typeof imagePaths] || imagePaths.ro;

  const hreflangMeta = generateHreflangMetadata({
    pathname: '/contacts',
    locale: locale as 'ro' | 'ru' | 'en'
  });

  return {
    title: t('contact'),
    description: desc_t('contact'),
    ...hreflangMeta,
    openGraph: {
      type: "website",
      title: t('contact'),
      description:
        desc_t('contact'),
      images: [
        {
          url: imageUrl,
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('contact'),
      description:
        desc_t('contact'),
      images: [imageUrl],
    },
  };
}

export default function Contacts() {
  return (
    <>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <Maps />
        <ContactForm />
      </div>
      <Footer />
      <LinksMenu />
    </>
  )
}
