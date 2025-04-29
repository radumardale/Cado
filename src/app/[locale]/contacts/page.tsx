import ContactForm from '@/components/contacts/ContactForm'
import Maps from '@/components/contacts/Maps'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import LinksMenu from '@/components/LinksMenu'
import React from 'react'

export default function Contacts() {
  return (
    <>
        <Header />
        <Maps />
        <ContactForm />
        <Footer />
        <LinksMenu />
    </>
  )
}
