import { useTranslations } from 'next-intl';
import { TermsSectionsArr } from '@/lib/enums/TermsSections'

interface TermsSidebarProps {
    activeSection: number;
}

export default function TermsContent({activeSection}: TermsSidebarProps) {
    const t = useTranslations("terms_sections");

  return (
    <div className='col-start-5 col-span-7 mt-16'>
        <h1 className='font-manrope text-3xl leading-11 uppercase font-semibold mb-16'>{t(TermsSectionsArr[activeSection])}</h1>
        <p className='mb-8'>These Terms of Service (“Terms”) govern your use of our website located at https://leflairstudios.com (the “Site”) and your purchase of products from our online store. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to all of these Terms, do not use the Site.</p>
        <h2 className='font-manrope text-[2rem] leading-11 uppercase font-semibold mb-8'>General conditions</h2>
        <p className='mb-8'>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (excluding credit card information) may be transmitted unencrypted and may involve (a) transmissions over various networks, and (b) modifications to conform and adapt to the technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, the use of the Service, or access to the Service, or any contact on the website through which the Service is provided, without our express written permission. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
        <h2 className='font-manrope text-[2rem] leading-11 uppercase font-semibold mb-8'>Use of the site</h2>
        <p className='mb-24'>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (excluding credit card information) may be transmitted unencrypted and may involve (a) transmissions over various networks, and (b) modifications to conform and adapt to the technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, the use of the Service, or access to the Service, or any contact on the website through which the Service is provided, without our express written permission. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
    </div>
  )
}
