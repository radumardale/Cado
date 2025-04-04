'use client'

import React, { Fragment } from 'react'
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const BgMap = dynamic(() => import("./BgMap"), { ssr:false })

export default function Maps() {
    const t = useTranslations("maps");
  return (
    <>
        {
            Array.from({length: 2}).map((_, index) => {
                return(
                    <Fragment key={index}>
                        <h3 className='col-start-2 col-span-full mt-16 mb-12 font-manrope text-3xl leading-11 uppercase font-semibold'>{t(`${index}.full_city`)}</h3>
                        <div className={`col-span-full grid grid-cols-15 relative py-12 pl-12 ${index === 0 ? "mb-26" : "mb-42"}`}>
                            <BgMap lat={index === 0 ? 47.04353256638208 : 45.65773024819346} lng={index === 0 ? 28.867875299999998 : 25.631321310197404} />
                            <div className='z-10 p-8 rounded-3xl col-span-5' style={{backgroundColor: `var(--blue${(index + 1) * 2})`}}>
                                <p className='col-start-2 col-span-full font-manrope text-white text-[2rem] leading-11 uppercase font-semibold mb-6'>{t(`${index}.city`)}</p>
                                <p className='text-white mb-4'>
                                    {
                                        t.rich(`${index}.address`, {
                                            br: () => <br/>
                                        })
                                    }
                                </p>
                                <p className='text-white mb-4'>{t(`${index}.work_hours`)}</p>
                                <p className='text-white mb-4'>{t(`${index}.phone`)}</p>
                                <p className='text-white mb-4'>{t(`${index}.email_support`)}</p>
                                <p className='text-white mb-4'>{t(`${index}.email_orders`)}</p>
                                <p className='text-white mb-4'>
                                    {
                                        t.rich(`${index}.additional_info`, {
                                            br: () => <br/>,
                                        })
                                    }
                                </p>
                            </div>
                        </div>
                    </Fragment>
                )
            })
        }
        
    </>
  )
}
