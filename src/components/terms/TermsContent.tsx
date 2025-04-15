import { useTranslations } from 'next-intl';
import { TermsSectionsArr } from '@/lib/enums/TermsSections'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronDown } from 'lucide-react';

interface TermsSidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
}

export default function TermsContent({activeSection, setActiveSection}: TermsSidebarProps) {
    const t = useTranslations("terms_sections");

  return (
    <div className='col-span-8 lg:col-start-5 lg:col-span-7 mt-16'>
       <Select 
                    defaultValue={activeSection.toString()}
                    onValueChange={(e) => {setActiveSection(Number(e))}}
                >
                    <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold w-full mb-8 lg:hidden">
                        <SelectValue placeholder="Regiunea" />
                        <ChevronDown className='size-5' strokeWidth={1.5}/>
                    </SelectTrigger>
                    <SelectContent className="border-gray">
                        <SelectGroup>
                            {
                              TermsSectionsArr.map((section, index) => {
                                return (
                                  <SelectItem key={index} className="text-base cursor-pointer font-semibold font-manrope" value={index.toString()}>{t(section)}</SelectItem>
                                )
                              })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
        <h1 className='font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-12 lg:mb-16'>{t(TermsSectionsArr[activeSection])}</h1>
        <p className='mb-8'>These Terms of Service (“Terms”) govern your use of our website located at https://leflairstudios.com (the “Site”) and your purchase of products from our online store. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to all of these Terms, do not use the Site.</p>
        <h2 className='font-manrope text-2xl lg:text-[2rem] leading-7 lg:leading-11 uppercase font-semibold mb-6 lg:mb-8'>General conditions</h2>
        <p className='mb-8'>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (excluding credit card information) may be transmitted unencrypted and may involve (a) transmissions over various networks, and (b) modifications to conform and adapt to the technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, the use of the Service, or access to the Service, or any contact on the website through which the Service is provided, without our express written permission. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
        <h2 className='font-manrope text-2xl lg:text-[2rem] leading-7 lg:leading-11 uppercase font-semibold mb-6 lg:mb-8'>Use of the site</h2>
        <p className='mb-16 lg:mb-24'>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (excluding credit card information) may be transmitted unencrypted and may involve (a) transmissions over various networks, and (b) modifications to conform and adapt to the technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, the use of the Service, or access to the Service, or any contact on the website through which the Service is provided, without our express written permission. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
    </div>
  )
}
