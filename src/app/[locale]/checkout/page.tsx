import CheckoutSection from '@/components/checkout/CheckoutSection'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import LinksMenu from '@/components/LinksMenu'
import React from 'react'

export default function Checkout() {
  return (
    <>
        <Header />
        <CheckoutSection />
        <Footer />
        <LinksMenu />
    </>
  )
}
