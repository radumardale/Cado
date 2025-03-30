import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <div className='col-span-full overflow-hidden'>
        <Image src="/hero/hero1.jpg" alt="hero1" width={1792} height={800}/>
    </div>
  )
}
