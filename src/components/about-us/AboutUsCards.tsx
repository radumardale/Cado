'use client'

import { CategoriesArr } from '@/lib/enums/Categories'
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl'
import Image from 'next/image';

export default function AboutUsCards() {
    const t = useTranslations("tags");
  return (
    <div className='col-start-2 col-span-13 mb-42 z-10'>
        <div className="grid col-span-full grid-cols-13 gap-x-6 mb-6">
            <div className='bg-blue-2 py-14 px-8 col-span-8 rounded-3xl'>
                <p className='text-white font-manrope text-3xl leading-11 uppercase font-semibold mb-8 w-7/8'>Misiunea noastră este să aducem emoție prin cadouri</p>
                <p className='mb-8 text-white text-2xl leading-7'>Misiunea noastră este să creăm cadouri personalizate care exprimă atenție, atât în mediul corporate, cât și în viața personală. Oferim <span className='font-semibold'>cadouri corporate pentru parteneri de afaceri</span>, dar și <span className='font-semibold'>seturi individuale</span> care aduc bucurie și lasă amintiri plăcute destinatarilor. În catalog vei găsi:</p>
                <div className="flex gap-2 mb-8">
                    {
                        CategoriesArr.map((category, index) => {
                            if (index < 5) return(
                                <div key={index} className='rounded-3xl h-12 px-6 flex items-center text-white font-semibold' style={{backgroundColor: `var(--blue${index + 1 === 2 ? 4 : index + 1})`}}>{t(`${category}.title`)}</div>
                            )
                        })
                    }
                </div>
                <p className='mb-10 text-white text-2xl leading-7'>CADO a trecut printr-un rebranding și colaborează astăzi cu parteneri din Moldova și România, oferind servicii la standarde înalte.</p>
                <button className='bg-white rounded-3xl h-12 px-6 flex items-center gap-2 text-blue-2 font-semibold'>
                    <span>Accesează catalogul</span>
                    <ArrowRight className='size-5' />
                </button>
            </div>
            <Image src="/hero/hero1.jpg" alt='hero image' width={580} height={600} className='col-span-5 h-full object-cover rounded-3xl' />
        </div>
        <div className="grid col-span-full grid-cols-13 gap-x-6 bg-blue-4 rounded-3xl">
            <div className='col-span-6 py-8 pl-8'>
                <Image src="/hero/hero1.jpg" alt='hero image' width={580} height={600} className='h-full w-full object-cover rounded-3xl' />
            </div>

            <div className='py-14 pr-8 col-span-7 rounded-3xl'>
                <p className='text-white font-manrope text-3xl leading-11 uppercase font-semibold mb-8 w-7/8'>CADO înseamnă mai mult decât cadouri — înseamnă și experiențe</p>
                <p className='mb-17 text-white text-2xl leading-7'>Dincolo de cadourile personalizate, oferim și <span className='font-semibold'> servicii complete de organizare de evenimente</span> — de la petreceri corporate la evenimente private. <br/><br/> Prin proiectul nostru <span className='font-semibold'>Event Republic</span>, aducem concepte memorabile la viață, cu profesionalism și creativitate. <br/><br/> Accesați <span className='underline'>www.eventrepublic.md</span> pentru a descoperi cum putem transforma ocaziile speciale în experiențe de neuitat. </p>
                <button className='bg-white rounded-3xl h-12 px-6 flex items-center gap-2 text-blue-2 font-semibold'>
                    <span>Accesează catalogul</span>
                    <ArrowRight className='size-5' />
                </button>
            </div>
        </div>
    </div>
  )
}
