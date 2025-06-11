import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl';
import Image from 'next/image'

export default function ViewCategory() {
  const t = useTranslations("NavBar");
  const router = useRouter();
  return (
    <div className='col-span-2 relative cursor-pointer group aspect-[244/268]' onClick={() => {router.push({pathname: '/catalog', query: {category: "GIFT_SET"}})}}>
        <div className='absolute left-0 top-0 w-full h-full bg-pureblack opacity-0 group-hover:opacity-25 pointer-events-none z-0 rounded-2xl transition duration-300'></div>
        <div className='absolute bottom-4 left-4 w-[calc(100%-2rem)] flex justify-center items-center bg-white rounded-3xl h-12 font-semibold font-manrope'>{ t("cta") }</div>
        <Image unoptimized src="/catalog_menu/gift_set.png" alt="gift set" className='w-full h-full object-cover rounded-2xl' width={244} height={268}/>
    </div>
  )
}