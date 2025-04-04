'use client'

import { useState } from 'react'
import Accordion from './Accordion'
import SeeMoreButton from '@/components/buttons/SeeMoreButton'
import { useTranslations } from 'next-intl';

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(0);

    const t = useTranslations("index.faq");

    const setCurrActiveIndex = (index: number) => {
        setActiveIndex(index);
    }

  return (
    <>
        <h3 className='col-span-full text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-16'>ÎNTREbări frecvente</h3>
        {
            Array.from({ length: 5 }).map((_, index) => {
                return (
                    <Accordion key={index} open={activeIndex == index} setActiveIndex={() => {setCurrActiveIndex(activeIndex === index ? -1 : index)}} title={t(`${index}.title`)}>
                        <p>{t(`${index}.description`)}</p>
                    </Accordion>
                )
            })
        }
        <p className='col-span-full text-center mt-8'>Nu ai găsit răspunsul la întrebarea ta? Poți consulta oricând lista noastră cu informații esențiale aici:</p>
        <SeeMoreButton className='mt-4 mb-24' />
    </>
  )
}
