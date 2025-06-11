import ContactForm from '@/components/contacts/ContactForm'
import Maps from '@/components/contacts/Maps'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import LinksMenu from '@/components/LinksMenu'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata() : Promise<Metadata> {
  const t = await getTranslations('PageTitles');
  const desc_t = await getTranslations('PageDescriptions');
 
  return {
    title: t('contact'),
    description: desc_t('contact'),
    openGraph: {
      type: "website",
      url: "https://metatags.io/",
      title: t('contact'),
      description:
        desc_t('contact'),
      images: [
        {
          url: "https://metatags.io/images/meta-tags.png",
          alt: "CADO Gift Sets Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('contact'),
      description:
        desc_t('contact'),
      images: ["https://metatags.io/images/meta-tags.png"],
      site: "https://metatags.io/",
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
