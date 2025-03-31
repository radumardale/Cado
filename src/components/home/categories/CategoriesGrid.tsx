import { CategoriesArr } from '@/lib/enums/Categories'
import { useTranslations } from 'next-intl'
import CategoriesRow from './CategoriesRow';

export default function CategoriesGrid() {
    const t = useTranslations("tags");

  return (
    <div className='col-start-2 lg:col-end-13 2xl:col-end-15 grid grid-cols-11 gap-x-6 gap-y-4 mb-42'>
        <CategoriesRow index={0} title={['8 martie', t(`${CategoriesArr[0]}.title`)]} description={[t(`${CategoriesArr[0]}.description`), t(`${CategoriesArr[0]}.description`)]} images={["", `/categories/${CategoriesArr[0]}.jpg`]}/>
        {
            CategoriesArr.map((category, index) => {
                if (index >= 5 || index % 2 == 0 || index == 0) return;

                return (
                    <CategoriesRow 
                        key={index} 
                        index={index} 
                        title={[t(`${category}.title`), t(`${CategoriesArr[index + 1]}.title`)]} 
                        description={[t(`${category}.description`), t(`${CategoriesArr[index + 1]}.description`)]} 
                        images={[`/categories/${category}.jpg`, `/categories/${CategoriesArr[index + 1]}.jpg`]}/>
                )
            })
        }
    </div>
  )
}
