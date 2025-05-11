import { easeInOutCubic } from '@/lib/utils'
import { motion } from 'motion/react'

const texts = [
    "Am comandat cadouri prin CADO de mai multe ori și colaborăm de mulți ani. Cadourile primite de partenerii noștri creează un efect wow, astfel de cadouri nu se mai găsesc nicăieri. Livrare întotdeauna rapidă, iar calitatea este la cel mai înalt nivel.",
    "Îmi place că la CADO găsesc idei de cadouri pentru orice ocazie, fără să pierd ore întregi căutând. Am comandat un set pentru un prieten apropiat și reacția lui a spus totul. Ambalaj impecabil, produse de calitate și o prezentare care face diferența.",
    "Pentru evenimentele corporate, apelăm constant la serviciile CADO. Flexibilitate, livrare punctuală și un design al seturilor care ne diferențiază în relațiile cu clienții. Colaborarea este eficientă și fără bătăi de cap - exact cum ne dorim.",
    "CADO a fost alegerea perfectă pentru cadoul aniversar al mamei mele. Am optat pentru un set personalizat și am fost impresionată de atenția la detalii, ambalajul elegant și livrarea promptă. A fost exact ce căutam — ceva special și diferit."
]

interface TextCarouselInterface {
    slide: number
}

export default function TextCarousel({slide}: TextCarouselInterface) {
  return (
    <motion.div className='mb-6 lg:mb-12 grid grid-cols-8 lg:grid-cols-9 col-span-full lg:col-span-9 lg:col-start-4 relative h-24 lg:h-36'>
        {
            texts.map((text, index) => {
                return(
                    <motion.p 
                        initial={false}
                        key={index} 
                        animate={index === slide ? {opacity: 1, transition: {delay: 0.4, duration: 0.8, ease:easeInOutCubic}} : {opacity: 0, transition: {duration: 0.4, ease:easeInOutCubic}}} 
                        className='text-sm lg:text-2xl leading-4 lg:leading-7 italic text-center absolute w-full self-center'>&quot;{text}&quot;
                    </motion.p>
                )
            })
        }
    </motion.div>
  )
}
