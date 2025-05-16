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
            product.nr_of_items > 1 && 
            <Accordion productAccordion open={activeIndex == 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title="Cadoul include">
                <p className={`text-sm lg:text-base leading-4 lg:leading-5`}>
                    {product.set_description[locale]}
                </p>
            </Accordion>
        }
        <Accordion productAccordion open={activeIndex == 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}} title="Descriere">
                <p className={`text-sm lg:text-base leading-4 lg:leading-5`}>
                    {product.long_description[locale]}
                </p>
        </Accordion>
        <Accordion productAccordion last open={activeIndex == 2} setActiveIndex={() => {setActiveIndex(activeIndex === 2 ? -1 : 2)}} title="Caracteristici">
            {
                product.optional_info && product.optional_info.material[locale] !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Material:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{product.optional_info.material[locale]}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.dimensions !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Dimensiuni:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.dimensions}`}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.weight !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Greutate:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.weight}`}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.color[locale] !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Culoare:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.color[locale]}`}</p>
                </div>
            }
            <div className='flex gap-x-1 not-first:mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Categorie principală:</p>
                {
                    product.categories.map((category, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`tags.${category}.title`)}{index < product.categories.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Conținut:</p>
                {
                    product.product_content.map((product_content, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`product_content.${product_content}`)} {index < product.product_content.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>Ocazie:</p>
                {
                    product.ocasions.map((ocasions, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`ocasions.${ocasions}.title`)} {index < product.ocasions.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            {
                product.nr_of_items > 1 && <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4 font-semibold'>Numărul obiectelor în cadou: {product.nr_of_items}</p>
            }
            <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4 font-semibold'>ID produs: <span className='font-normal'>{product.custom_id}</span></p>
        </Accordion>
    </div>
  )
}