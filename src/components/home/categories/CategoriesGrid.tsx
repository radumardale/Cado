import { Categories, CategoriesArr } from '@/lib/enums/Categories'
import CategoriesRow from './CategoriesRow';
import CustomRow from './CustomRow';
import { Ocasions } from '@/lib/enums/Ocasions';

export default function CategoriesGrid() {
  return (
    <div className='col-start-1 lg:col-start-2 col-end-9 lg:col-end-15 grid grid-cols-8 lg:grid-cols-11 gap-x-2 lg:gap-x-6 gap-y-4 mb-24 lg:mb-42'>
        <CustomRow index={1} index_2={3} category={Categories.FOR_HER} ocasion={Ocasions.MARCH_8} images={["", `/categories/${CategoriesArr[0]}.jpg`]}/>
        {
            CategoriesArr.map((category, index) => {
                if (index >= 5 || index % 2 == 0 || index == 0) return;

                let color_index_2 = 0, color_index_1 = index;

                if (index == 1) {
                    color_index_1 = 4;
                    color_index_2 = 2;
                }

                if (index == 3) {
                    color_index_1 = 1;
                    color_index_2 = 0;
                }

                return (
                    <CategoriesRow 
                        key={index} 
                        index={color_index_1} 
                        index_2={color_index_2}
                        categories={[category as Categories, CategoriesArr[index + 1] as Categories]} 
                        images={[`/categories/${category}.jpg`, `/categories/${CategoriesArr[index + 1]}.jpg`]}/>
                )
            })
        }
    </div>
  )
}
