import { easeInOutCubic } from '@/lib/utils'
import { motion } from 'motion/react'
import { useLocale } from 'next-intl'

type ReviewText = {
    ro: string
    ru: string
    en: string
}

const texts: ReviewText[] = [
    {
        ro: "Am comandat cadouri prin CADO de mai multe ori și colaborăm de mulți ani. Cadourile primite de partenerii noștri creează un efect wow, astfel de cadouri nu se mai găsesc nicăieri. Livrare întotdeauna rapidă, iar calitatea este la cel mai înalt nivel.",
        ru: "Я заказывал подарки через CADO много раз, и мы сотрудничаем много лет. Подарки, полученные нашими партнерами, производят вау-эффект, такие подарки больше нигде не найти. Доставка всегда быстрая, а качество на самом высоком уровне.",
        en: "I have ordered gifts through CADO several times and we have been collaborating for many years. The gifts our partners receive create a wow effect; such gifts can't be found anywhere else. Delivery is always fast, and the quality is top-notch."
    },
    {
        ro: "Îmi place că la CADO găsesc idei de cadouri pentru orice ocazie, fără să pierd ore întregi căutând. Am comandat un set pentru un prieten apropiat și reacția lui a spus totul. Ambalaj impecabil, produse de calitate și o prezentare care face diferența.",
        ru: "Мне нравится, что в CADO я нахожу идеи подарков для любого случая, не тратя часы на поиски. Я заказал набор для близкого друга, и его реакция сказала всё. Безупречная упаковка, качественные продукты и презентация, которая имеет значение.",
        en: "I like that at CADO I find gift ideas for any occasion without spending hours searching. I ordered a set for a close friend and his reaction said it all. Impeccable packaging, quality products, and a presentation that makes a difference."
    },
    {
        ro: "Pentru evenimentele corporate, apelăm constant la serviciile CADO. Flexibilitate, livrare punctuală și un design al seturilor care ne diferențiază în relațiile cu clienții. Colaborarea este eficientă și fără bătăi de cap - exact cum ne dorim.",
        ru: "Для корпоративных мероприятий мы постоянно обращаемся к услугам CADO. Гибкость, своевременная доставка и дизайн наборов, который выделяет нас в отношениях с клиентами. Сотрудничество эффективно и без хлопот — именно так, как мы хотим.",
        en: "For corporate events, we constantly use CADO's services. Flexibility, punctual delivery, and set designs that set us apart in client relationships. The collaboration is efficient and hassle-free—just as we want."
    },
    {
        ro: "CADO a fost alegerea perfectă pentru cadoul aniversar al mamei mele. Am optat pentru un set personalizat și am fost impresionată de atenția la detalii, ambalajul elegant și livrarea promptă. A fost exact ce căutam — ceva special și diferit.",
        ru: "CADO был идеальным выбором для подарка на день рождения моей мамы. Я выбрала персонализированный набор и была впечатлена вниманием к деталям, элегантной упаковкой и быстрой доставкой. Это было именно то, что я искала — что-то особенное и необычное.",
        en: "CADO was the perfect choice for my mother's birthday gift. I chose a personalized set and was impressed by the attention to detail, elegant packaging, and prompt delivery. It was exactly what I was looking for—something special and different."
    }
]

interface TextCarouselInterface {
    slide: number
}

export default function TextCarousel({slide}: TextCarouselInterface) {

    const locale = useLocale() as "ro" | "ru" | "en"

  return (
    <motion.div className='mb-6 lg:mb-12 grid grid-cols-8 lg:grid-cols-9 col-span-full lg:col-span-9 lg:col-start-4 relative h-24 lg:h-36'>
        {
            texts.map((text, index) => {
                return(
                    <motion.p 
                        initial={false}
                        key={index} 
                        animate={index === slide ? {opacity: 1, transition: {delay: 0.4, duration: 0.8, ease:easeInOutCubic}} : {opacity: 0, transition: {duration: 0.4, ease:easeInOutCubic}}} 
                        className='text-sm lg:text-2xl leading-4 lg:leading-7 italic text-center absolute w-full self-center'>&quot;{text[locale]}&quot;
                    </motion.p>
                )
            })
        }
    </motion.div>
  )
}
