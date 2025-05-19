'use client'

import SeeMoreButton from '@/components/buttons/SeeMoreButton'
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Faq() {
    const t = useTranslations("index.faq");

  return (
    <>
        <h3 className='col-span-full text-center font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-8 lg:mb-16'>ÎNTREbări frecvente</h3>
        {
            Array.from({ length: 5 }).map((_, index) => {
                return (
                    <Accordion key={index} type="single" collapsible className={`col-span-full lg:col-start-4 lg:col-span-9  ${index === 4 ? "border-y border-lightgray" : "border-t border-lightgray"}`}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='font-semibold font-manrope text-base lg:text-2xl cursor-pointer'>{t(`${index}.title`)}</AccordionTrigger>
                            <AccordionContent className='text-base'>
                                {t(`${index}.description`)}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )
            })
        }
        <p className='col-span-full text-center mt-8 text-sm lg:text-base'>Nu ai găsit răspunsul la întrebarea ta? Poți consulta oricând lista noastră cu informații esențiale aici:</p>
        <SeeMoreButton href='/terms' className='mt-4 mb-16 lg:mb-24' />
    </>
  )
}