import React, { useState } from 'react'
import Accordion from '../home/faq/Accordion'
import { ProductInterface } from '@/models/product/types/productInterface';
import { useTranslations } from 'next-intl';

import styles from './product.module.scss';

interface AdditionalInfoInterface {
    product: ProductInterface,
    locale: string
}

export default function AdditionalInfo({product, locale}: AdditionalInfoInterface) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const t = useTranslations();

    const prod_t = useTranslations("ProductPage");

  return (
    <div className='mt-12 lg:mt-0'>
        {
            product.nr_of_items > 1 && 
            <Accordion productAccordion open={activeIndex == 0} setActiveIndex={() => {setActiveIndex(activeIndex === 0 ? -1 : 0)}} title={prod_t('includes')}>
                <div 
                    className={styles.productDescription + " text-sm lg:text-base leading-4 lg:leading-5"}
                    dangerouslySetInnerHTML={{ __html: product.set_description[locale] }}
                ></div>

                <p className='mb-6 font-bold text-sm lg:text-base'>*{prod_t('includes_info')} <a href="mailto:order@cado.md" className='underline'>order@cado.md</a></p>
            </Accordion>
        }
        <Accordion productAccordion open={activeIndex == 1} setActiveIndex={() => {setActiveIndex(activeIndex === 1 ? -1 : 1)}} title={prod_t('description')}>
                <div 
                    className={styles.productDescription + " text-sm lg:text-base leading-4 lg:leading-5"}
                    dangerouslySetInnerHTML={{ __html: product.long_description[locale] }}
                ></div>
        </Accordion>
        <Accordion productAccordion last open={activeIndex == 2} setActiveIndex={() => {setActiveIndex(activeIndex === 2 ? -1 : 2)}} title={prod_t('features')}>
            {
                product.optional_info && product.optional_info.material[locale] !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('material')}:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{product.optional_info.material[locale]}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.dimensions !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('dimensions')}:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.dimensions}`}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.weight !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('weight')}:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.weight}`}</p>
                </div>
            }
            {
                product.optional_info && product.optional_info.color[locale] !== "" &&
                <div className='flex gap-x-1 not-first:mt-4'>
                    <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('color')}:</p>
                    <p className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{`${product.optional_info.color[locale]}`}</p>
                </div>
            }
            <div className='flex gap-x-1 not-first:mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('category')}:</p>
                {
                    product.categories.map((category, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`Tags.${category}.title`)}{index < product.categories.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('content')}:</p>
                {
                    product.product_content.map((product_content, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`product_content.${product_content}`)} {index < product.product_content.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            <div className='flex gap-x-1 flex-wrap mt-4'>
                <p className='text-sm lg:text-base leading-4 lg:leading-5 font-semibold'>{prod_t('ocasion')}:</p>
                {
                    product.ocasions.map((ocasions, index) => {
                        return (
                            <p key={index} className='text-black text-sm lg:text-base leading-4 lg:leading-5'>{t(`ocasions.${ocasions}.title`)} {index < product.ocasions.length - 1 && ","}</p>
                        )
                    })
                }
            </div>
            {
                product.nr_of_items > 1 && <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4 font-semibold'>{prod_t('number')}: {product.nr_of_items}</p>
            }
            <p className='text-sm lg:text-base leading-4 lg:leading-5 mt-4 font-semibold'>{prod_t('id')}: <span className='font-normal'>{product.custom_id}</span></p>
        </Accordion>
    </div>
  )
}