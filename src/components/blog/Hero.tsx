import React from 'react'
import BlogGrid from './BlogGrid'

export default function Hero() {
  return (
    <>
         <div className='lg:col-start-5 2xl:col-start-6 lg:col-span-7 2xl:col-span-5 mt-16 relative'>
            <h3 className='text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-6'>LISTA NOUTĂȚILOR</h3>
            <p className='text-center mb-16'>De la selecție la livrare, vă ghidăm pas cu pas pentru a crea cadouri corporate personalizate, potrivite brandului dumneavoastră.</p>
        </div>
        <BlogGrid />
    </>
  )
}
