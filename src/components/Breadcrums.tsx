'use client'

import { Link } from '@/i18n/navigation'
import { Pathnames } from '@/i18n/routing';
import { Categories } from '@/lib/enums/Categories';
import { LangOptionsArr } from '@/lib/enums/LangOptions';
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react';

interface BreadcrumsInterface {
    category?: Categories | null,
    productInfo?: {
        title: string,
        id: string
    },
}

export default function Breadcrums({category, productInfo}: BreadcrumsInterface) {
    const pathnamesTranslations = useTranslations("pathnames");
    const paths = usePathname();
    const pathNames = paths.split('/').filter( path => !LangOptionsArr.includes(path) && path.length > 0 );
    const t = useTranslations("tags");

    return (
        <div className='mt-4 hidden lg:flex'>
            {
                <div className='flex gap-2'>
                    <Link href={'/'} className='text-gray font-semibold font-manrope uppercase whitespace-nowrap'>{pathnamesTranslations("home")}</Link>
                    <span className='text-gray font-semibold font-manrope'>/</span>
                    {
                        pathNames.map( (link, index) => {
                            const href = `/${pathNames.slice(0, index + 1).join('/')}` as Pathnames;
                            const itemLink = link[0].toUpperCase() + link.slice(1, link.length);
                            if (category && index == 0) {
                                return (
                                    <Fragment key={index}>
                                        <Link className='text-gray font-semibold font-manrope uppercase whitespace-nowrap' href={href}>{itemLink}</Link>
                                        <span className='text-gray font-semibold font-manrope'>/</span>
                                        <Link className='text-gray font-semibold font-manrope uppercase whitespace-nowrap' href={{pathname: '/catalog', query: {category: category}}}>{t(`${category}.title`)}</Link>
                                        {index + 1 < pathNames.length && <span className='text-gray font-semibold font-manrope'>/</span>}
                                    </Fragment>
                                )
                            }

                            if (productInfo && index == 1) {
                                return (
                                    <Fragment key={index}>
                                        <Link className='text-gray font-semibold font-manrope uppercase whitespace-nowrap' href={{pathname: '/catalog/product/[id]', params: {id: productInfo.id}}}>{productInfo.title}</Link>
                                    </Fragment>
                                )
                            }

                            if (index > 1) return;

                            return (
                                <Fragment key={index}>
                                    <Link className='text-gray font-semibold font-manrope uppercase whitespace-nowrap' href={href}>{itemLink}</Link>
                                    {index + 1 < pathNames.length && <span className='text-gray font-semibold font-manrope'>/</span>}
                                </Fragment>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}
