import React from 'react'
import SeeMoreButton from '../buttons/SeeMoreButton'
import AboutUsCards from './AboutUsCards'
import Image from 'next/image'

export default function Hero() {
  return (
    <>
        <Image src="/ribbon/about-us-ribbon.png" alt="waving ribbon" width={1920} height={679} className='w-full absolute top-48 z-0' />
        <div className='lg:col-start-5 2xl:col-start-6 lg:col-span-7 2xl:col-span-5 mb-66 relative'>
          <h3 className='mt-32 text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-6'>CADO — cadouri care <br/> nu se redăruiesc</h3>
          <p className='text-center mb-12'>Cadourile noastre sunt create cu gândul la impactul emoțional — pentru ca fiecare gest să devină o amintire și fiecare set să transmită grijă autentică.</p>
          <SeeMoreButton  />
        </div>
          <AboutUsCards />
    </>
  )
}
