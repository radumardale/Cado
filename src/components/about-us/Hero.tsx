import React from 'react'
import SeeMoreButton from '../buttons/SeeMoreButton'
import AboutUsCards from './AboutUsCards'
import Image from 'next/image'

export default function Hero() {
  return (
    <>
        <div className='absolute top-85 lg:top-48 z-0 w-full overflow-hidden'>
          <Image quality={100} priority src="/ribbon/about-us-ribbon.png" alt="waving ribbon" width={3840} height={1358} className='w-[calc(100%+20rem)] -translate-x-40 lg:translate-0 lg:w-full max-w-none' />
        </div>
        <div className='col-span-full lg:col-start-5 2xl:col-start-6 lg:col-span-7 2xl:col-span-5 mb-58 lg:mb-66 relative'>
          <h3 className='mt-16 lg:mt-32 text-center font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-8 lg:mb-6'>CADO — cadouri care <br/> nu se redăruiesc</h3>
          <p className='text-center mb-8 lg:mb-12 text-sm lg:text-lg lg:leading-5'>Cadourile noastre sunt create cu gândul la impactul emoțional — pentru ca fiecare gest să devină o amintire și fiecare set să transmită grijă autentică.</p>
          <SeeMoreButton text="Vezi catalog" />
        </div>
        <AboutUsCards />
    </>
  )
}
