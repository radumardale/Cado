'use client'

import { Link } from '@/i18n/navigation'
import { LangOptionsArr } from '@/lib/enums/LangOptions';
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react';

export default function Breadcrums() {
    const pathnamesTranslations = useTranslations("pathnames");
    const paths = usePathname();
    const pathNames = paths.split('/').filter( path => !LangOptionsArr.includes(path) && path.length > 0 );

    return (
        <div className='flex gap-2'>
            <Link href={'/'} className='text-gray font-semibold font-manrope uppercase'>{pathnamesTranslations("home")}</Link>
            {pathNames.length > 0 && <span className='text-gray font-semibold font-manrope'>/</span>}
        {
            pathNames.length > 0 && pathNames.map( (link, index) => {
                const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                const itemLink = link[0].toUpperCase() + link.slice(1, link.length);
                return (
                    <Fragment key={index}>
                            <Link className='text-gray font-semibold font-manrope uppercase' href={href}>{itemLink}</Link>
                            {index + 1 < pathNames.length && <span className='text-gray font-semibold font-manrope'>/</span>}
                    </Fragment>
                )
            })
        }
        </div>
    )
}
