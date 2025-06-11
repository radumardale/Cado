import { easeInOutCubic } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useLocale } from 'next-intl'

const texts = [
    {
        ro: ["MAIB Moldova", "Bancă comercială"],
        ru: ["MAIB Moldova", "Коммерческий банк"],
        en: ["MAIB Moldova", "Commercial bank"],
    },
    {
        ro: ["Ecaterina Suruceanu", "Antreprenoare"],
        ru: ["Ecaterina Suruceanu", "Предпринимательница"],
        en: ["Ecaterina Suruceanu", "Entrepreneur"],
    },
    {
        ro: ["Uniplast", "Producător și distribuitor"],
        ru: ["Uniplast", "Производитель и дистрибьютор"],
        en: ["Uniplast", "Manufacturer and distributor"],
    },
    {
        ro: ["Sabina Morari", "Office Manager"],
        ru: ["Sabina Morari", "Офис-менеджер"],
        en: ["Sabina Morari", "Office Manager"],
    },
]

interface TitlesCarouselInterface {
    slide: number
    isAnimationPlaying: boolean
    moveItemsBackward: () => void
    moveItemsForward: () => void
}

export default function TitlesCarousel({slide, isAnimationPlaying, moveItemsBackward, moveItemsForward}: TitlesCarouselInterface) {

    const locale = useLocale() as "ro" | "ru" | "en"

  return (
    <div className='flex justify-center col-span-full lg:col-start-6 lg:col-span-5 mb-32 lg:mb-42'>
        <div className="w-40 h-11 relative flex justify-center">
            <button className='hidden lg:block cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 -translate-full absolute -left-8' disabled={isAnimationPlaying} onClick={moveItemsBackward}>
                <ArrowLeft className='size-8'/>
            </button>
            {
                texts.map((text, index) => {
                    return(
                        <motion.div
                            initial={false}
                            key={index}
                            animate={index === slide ? {opacity: 1, transition: {delay: 0.4, duration: 0.8, ease:easeInOutCubic}} : {opacity: 0, transition: {duration: 0.4, ease:easeInOutCubic}}}
                            className='absolute'
                        >
                            <p className='text-sm lg:text-base leading-4 lg:leading-5 text-center font-manrope font-semibold mb-2'>{text[locale][0]}</p>
                            <p className='text-sm lg:text-base leading-4 lg:leading-5 text-center text-gray'>{text[locale][1]}</p>
                        </motion.div>
                    )
                })
            }
            <button className='hidden lg:block cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 translate-full absolute -right-8' disabled={isAnimationPlaying} onClick={moveItemsForward}>
                <ArrowRight className='size-8'/>
            </button>
        </div>
    </div>
  )
}
