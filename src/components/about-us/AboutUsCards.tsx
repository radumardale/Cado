'use client'

import { Link } from '@/i18n/navigation';
import { default as NextLink } from 'next/link'
import { CategoriesArr } from '@/lib/enums/Categories'
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl'
import Image from 'next/image';

export default function AboutUsCards() {
    const t = useTranslations("Tags");
    const hero_t = useTranslations("AboutPage.Hero.Cards")
  return (
    <div className='col-span-full lg:col-start-2 lg:col-span-13 mb-24 lg:mb-42 z-10'>
        <div className="grid col-span-full grid-cols-8 lg:grid-cols-13 gap-x-6 gap-y-4 lg:gap-y-0 mb-6">
            <div className='bg-blue-2 py-6 lg:py-14 px-4 lg:px-8 col-span-8 rounded-2xl lg:rounded-3xl order-2 lg:order-1'>
                <p className='text-white font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-6 lg:mb-8 lg:w-7/8'>{ hero_t("card_1_title") }</p>
                <p className='mb-8 text-white text-sm lg:text-2xl leading-4 lg:leading-7'>{hero_t("card_1_description_slice_1")} <span className='font-semibold'>{hero_t("card_1_description_slice_2")}</span>{hero_t("card_1_description_slice_3")} <span className='font-semibold'>{hero_t("card_1_description_slice_4")}</span> {hero_t("card_1_description_slice_5")}:</p>
                <div className="flex gap-2 mb-8 flex-wrap">
                    {
                        CategoriesArr.map((category, index) => {
                            if (index < 5) return(
                                <Link href={{pathname: '/catalog', query: {category: category}}} key={index} className='rounded-3xl h-12 px-6 flex items-center text-white font-semibold hover:opacity-75 transition duration-300' style={{backgroundColor: `var(--blue${index + 1 === 2 ? 4 : index + 1})`}}>{t(`${category}.title`)}</Link>
                            )
                        })
                    }
                </div>
                <p className='mb-8 lg:mb-10 text-white text-sm lg:text-2xl leading-4 lg:leading-7'>{hero_t("card_1_text")}</p>
                <Link href="/catalog" className='bg-white rounded-3xl h-12 px-6 flex items-center gap-2 text-blue-2 font-semibold hover:opacity-75 transition duration-300 w-fit'>
                    <span>{hero_t("see_catalog")}</span>
                    <ArrowRight className='size-5' />
                </Link>
            </div>
            <Image unoptimized quality={100} priority src="/about-us/hero1.jpg" alt='hero image' width={580} height={600} className='col-span-full w-full lg:col-span-5 h-56 lg:h-full object-cover rounded-2xl lg:rounded-3xl order-1 lg:order-2' />
        </div>
        <div className="grid col-span-full grid-cols-13 gap-x-6 bg-blue-4 rounded-2xl lg:rounded-3xl pt-4 pb-6 lg:py-8 px-4 lg:px-0 lg:pl-8">
            <div className='col-span-full lg:col-span-6 h-full relative box-border'>
                <Image unoptimized quality={100} priority src="/about-us/hero2.jpg" alt='hero image' width={913} height={536} className='h-full w-full object-cover rounded-2xl lg:rounded-3xl lg:absolute' />
            </div>

            <div className='lg:py-6 lg:pr-8 col-span-full lg:col-span-7 mt-6 lg:mt-0'>
                <p className='text-white font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-6 lg:mb-8 lg:w-7/8'>{hero_t("card_2_title")}</p>
                <p className='mb-8 lg:mb-17 text-white text-sm lg:text-2xl leading-4 lg:leading-7'>{hero_t("card_2_paragraph_1_slice_1")} <span className='font-semibold'> {hero_t("card_2_paragraph_1_slice_2")}</span> {hero_t("card_2_paragraph_1_slice_3")} <br/><br/> {hero_t("card_2_paragraph_2_slice_1")} <span className='font-semibold'>{hero_t("card_2_paragraph_2_slice_2")}</span>{hero_t("card_2_paragraph_2_slice_3")} <br/><br/> {hero_t("card_2_paragraph_3_slice_1")} <NextLink href="https://eventrepublic.md" className='underline'>www.eventrepublic.md</NextLink> {hero_t("card_2_paragraph_3_slice_2")} </p>
                <NextLink href="https://eventrepublic.md" target="_blank" className='bg-white rounded-3xl h-12 px-6 flex items-center gap-2 text-blue-4 font-semibold hover:opacity-75 transition duration-300 w-fit'>
                    <span>{hero_t("visit")}</span>
                    <ArrowRight className='size-5' />
                </NextLink>
            </div>
        </div>
    </div>
  )
}
