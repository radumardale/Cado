import CheckoutSection from '@/components/checkout/CheckoutSection'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import LinksMenu from '@/components/LinksMenu'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata() {
  const t = await getTranslations('PageTitles');
 
  return {
    title: t('checkout'),
    description: '',
  };
}

export default function Checkout() {
  return (
    <>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
          <Header />
          <CheckoutSection />
          <LinksMenu />
      </div>
      <Footer />
    </>
  )
}
