import React, { useState } from 'react'
import Accordion from '../home/faq/Accordion'
import { ProductInterface } from '@/models/product/types/productInterface';

interface AdditionalInfoInterface {
    product: ProductInterface,
    locale: string
}

export default function AdditionalInfo({product, locale}: AdditionalInfoInterface) {
    const [activeIndex, setActiveIndex] = useState(-1);


  return (
    <div>
        {
            product.set_description && 
            <Accordion open={activeIndex == 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title="Cadoul include">
                <p className={`[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden leading-5`}>{product.description[locale]}</p>
            </Accordion>
        }
        <Accordion open={activeIndex == 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}} title="Descriere">
            <p className={`[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden leading-5`}>{product.description[locale]}</p>
        </Accordion>
        <Accordion last open={activeIndex == 2} setActiveIndex={() => {setActiveIndex(activeIndex === 2 ? -1 : 2)}} title="Caracteristici">
            <p className={`[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden leading-5`} style={{WebkitLineClamp: `calc(${window.innerHeight} / (1.25 * var(--current-rem)) / 4.3)`}}>{product.description[locale]}</p>
        </Accordion>
    </div>
  )
}