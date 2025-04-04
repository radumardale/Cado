import { easeInOutCubic } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const texts = [
    ["MAIB Moldova", "Bancă comercială"],
    ["Event Republic", "Republica Kyrgyzstan"],
    ["MAIB Moldova", "Bancă comercială"],
]

interface TitlesCarouselInterface {
    slide: number
    isAnimationPlaying: boolean
    moveItemsBackward: () => void
    moveItemsForward: () => void
}

export default function TitlesCarousel({slide, isAnimationPlaying, moveItemsBackward, moveItemsForward}: TitlesCarouselInterface) {
  return (
    <div className='flex justify-center col-start-6 col-span-5 mb-42'>
        <div className="w-40 h-11 relative flex justify-center">
            <button className='cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 -translate-full absolute -left-8' disabled={isAnimationPlaying} onClick={moveItemsBackward}>
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
                            <p className='text-center font-manrope font-semibold mb-2'>{text[0]}</p>
                            <p className='text-center text-gray'>Bancă comercială</p>
                        </motion.div>
                    )
                })
            }
            <button className='cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 translate-full absolute -right-8' disabled={isAnimationPlaying} onClick={moveItemsForward}>
                <ArrowRight className='size-8'/>
            </button>
        </div>
    </div>
  )
}
