import { easeInOutCubic } from '@/lib/utils'
import { motion } from 'motion/react'

const texts = [
    "Am comandat cadouri prin CADO de mai multe ori și colaborăm de mulți ani. Cadourile primite de partenerii noștri creează un efect wow, astfel de cadouri nu se mai găsesc nicăieri. Livrare întotdeauna rapidă, iar calitatea este la cel mai înalt nivel.",
    "Comandarea este simplă: alegeți produsele, adăugați-le în coș și finalizați comanda urmând pașii indicați. Oferim posibilitatea de a modifica conținutul cadoului după preferințe și creăm seturi personalizate pentru clienți corporate, inclusiv branding. Dacă aveți nevoie de ajutor, ne puteți contacta direct aici.",
    "Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate."
]

interface TextCarouselInterface {
    slide: number
}

export default function TextCarousel({slide}: TextCarouselInterface) {
  return (
    <motion.div layout className='mb-12 grid grid-cols-9 col-span-9 lg:col-start-3 2xl:col-start-4 relative h-36'>
        {
            texts.map((text, index) => {
                return(
                    <motion.p 
                        key={index} 
                        animate={index === slide ? {opacity: 1, transition: {delay: 0.4, duration: 0.8, ease:easeInOutCubic}} : {opacity: 0, transition: {duration: 0.4, ease:easeInOutCubic}}} 
                        className='text-2xl italic text-center absolute w-full'>&quot;{text}&quot;
                    </motion.p>
                )
            })
        }
    </motion.div>
  )
}
