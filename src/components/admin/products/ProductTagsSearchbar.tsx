import Searchbar from '@/components/admin/Searchbar';
import { Categories, findCategoriesByText } from '@/lib/enums/Categories';
import { findOcasionsByText, Ocasions } from '@/lib/enums/Ocasions';
import { findProductContentByText, ProductContent } from '@/lib/enums/ProductContent';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface ProductTagsSearchbarProps {
    handleAddCategory: (v: Categories) => void,
    handleAddProductContent: (v: ProductContent) => void,
    handleAddOcasion: (v: Ocasions) => void,
}

export default function ProductTagsSearchbar({ handleAddCategory, handleAddOcasion, handleAddProductContent }: ProductTagsSearchbarProps) {
    const t = useTranslations('');
    const [categories, setCategories] = useState<Categories[]>([]);
    const [productContents, setProductContents] = useState<ProductContent[]>([]);
    const [ocasions, setOcasions] = useState<Ocasions[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setCategories(findCategoriesByText(searchText));
        setProductContents(findProductContentByText(searchText));
        setOcasions(findOcasionsByText(searchText));
    }, [searchText]);

  return (
    <>
        <Searchbar className='col-span-6' searchText={searchText} setSearchText={setSearchText} />
        <p className={`${categories.length > 0 ? "" : "hidden"} col-span-full font-manrope font-semibold`}>Categorie principală:</p>
        <div className={`${categories.length > 0 ? "flex" : "hidden"} col-span-6 gap-2 flex-wrap`}>
            {
                categories.map((category, index) => {
                    return(
                        <button key={index} className="bg-blue-2 h-12 px-6 text-white font-manrope font-semibold rounded-3xl flex items-center gap-1 max-w-full cursor-pointer hover:opacity-75 transition duration-300" onClick={(e) => {e.preventDefault(); handleAddCategory(category)}}>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{t(`tags.${category}.title`)}</p>
                        </button>
                    )
                })
            }
        </div>
        <p className={`${productContents.length > 0 ? "" : "hidden"} col-span-full font-manrope font-semibold`}>Conținut:</p>
        <div className={`${productContents.length > 0 ? "flex" : "hidden"} col-span-6 gap-2 flex-wrap`}>
            {
                productContents.map((productContent, index) => {
                    return(
                        <button key={index} className="bg-blue-2 h-12 px-6 text-white font-manrope font-semibold rounded-3xl flex items-center gap-1 max-w-full cursor-pointer hover:opacity-75 transition duration-300" onClick={(e) => {e.preventDefault(); handleAddProductContent(productContent)}}>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{t(`product_content.${productContent}`)}</p>
                        </button>
                    )
                })
            }
        </div>
        <p className={`${ocasions.length > 0 ? "" : "hidden"} col-span-full font-manrope font-semibold`}>Ocazie:</p>
        <div className={`${ocasions.length > 0 ? "flex" : "hidden"} col-span-6 gap-2 flex-wrap`}>
            {
                ocasions.map((ocasion, index) => {
                    return(
                        <button key={index} className="bg-blue-2 h-12 px-6 text-white font-manrope font-semibold rounded-3xl flex items-center gap-1 max-w-full cursor-pointer hover:opacity-75 transition duration-300" onClick={(e) => {e.preventDefault(); handleAddOcasion(ocasion)}}>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{t(`ocasions.${ocasion}.title`)}</p>
                        </button>
                    )
                })
            }
        </div>
    </>
  )
}
