import React, { useState } from 'react'
import Accordion from '../home/faq/Accordion'
import { ProductInterface } from '@/models/product/types/productInterface';
import { useTranslations } from 'next-intl';

interface AdditionalInfoInterface {
    product: ProductInterface,
    locale: string
}

export default function AdditionalInfo({product, locale}: AdditionalInfoInterface) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const t = useTranslations();

  return (
    <div className='mt-12 lg:mt-0'>
        {
            product.set_description && 
            <Accordion open={activeIndex == 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title="Cadoul include">
                <p className={`[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden text-sm lg:text-base leading-4 lg:leading-5 whitespace-pre-line`}>
                    {product.set_description[locale]}
                </p>
            </Accordion>
        }
        <Accordion open={activeIndex == 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}} title="Descriere">
                <p className={`[display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden text-sm lg:text-base leading-4 lg:leading-5 whitespace-pre-line`} style={{WebkitLineClamp: `calc(${window.innerHeight} / (1.25 * var(--current-rem)) / 4.3)`}}>
                    {product.long_description[locale]}
                </p>
        </Accordion>
        <Accordion last open={activeIndex == 2} setActiveIndex={() => {setActiveIndex(activeIndex === 2 ? -1 : 2)}} title="Caracteristici">
            <div className='flex gap-x-1'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5'>Categorie principală:</p>
                {
                    product.categories.map((category, index) => {
                        return (
                            <p key={index} className='text-gray text-sm lg:text-base leading-4 lg:leading-5'>{t(`tags.${category}.title`)}<span className='text-black'>{index < product.categories.length - 1 && ","}</span></p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5'>Conținut:</p>
                {
                    product.product_content.map((product_content, index) => {
                        return (
                            <p key={index} className='text-gray text-sm lg:text-base leading-4 lg:leading-5'>{t(`product_content.${product_content}`)}<span className='text-black'>{index < product.product_content.length - 1 && ","}</span></p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5'>Ocazie:</p>
                {
                    product.ocasions.map((ocasions, index) => {
                        return (
                            <p key={index} className='text-gray text-sm lg:text-base leading-4 lg:leading-5'>{t(`ocasions.${ocasions}.title`)}<span className='text-black'>{index < product.ocasions.length - 1 && ","}</span></p>
                        )
                    })
                }
            </div>
            {
                product.set_description && <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4'>Numărul obiectelor în cadou: 8</p>
            }
            <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4'>ID produs: {product.custom_id}</p>
        </Accordion>
    </div>
  )
}