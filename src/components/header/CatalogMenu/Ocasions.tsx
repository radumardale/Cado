import CustomLink from '@/components/CustomLink'
import { MenuOcasionsArr } from '@/lib/enums/Ocasions'
import { useTranslations } from 'next-intl'

export default function Ocasions() {
  const t = useTranslations("ocasions")
  return (
    <div className="flex flex-col gap-4 col-span-2">
        <p className='font-manrope font-semibold'>Ocazie</p>
        {
          MenuOcasionsArr.map(ocasion => {
            return <CustomLink key={ocasion} href="/catalog" ocasion={ocasion} value={t(`${ocasion}.title`)} />
          })
        }
    </div>
  )
}