import { Link, usePathname } from '@/i18n/navigation';
import { easeInOutCubic } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Searchbar from './CatalogMenu/Searchbar';
import Accordion from '../catalog/sidebar/Accordion';
import { useTranslations } from 'next-intl';

interface MobileMenuInterface {
    setSidebarOpen: (v: boolean) => void,
}


export default function MobileMenu({setSidebarOpen}: MobileMenuInterface) {
    const t = useTranslations("tags");
    const pathname = usePathname();

  return (
    <motion.div 
        initial={{x: '-100%'}} 
        animate={{x: 0, transition: {duration: .4, ease: easeInOutCubic}}} 
        exit={{x: '-100%', transition: {duration: .4, ease: easeInOutCubic}}} 
        className='fixed w-screen h-full top-0 left-0 z-50 bg-white lg:w-1/3 pt-3 lg:pt-6 px-4 lg:pl-6 lg:pr-8 flex flex-col' 
        onMouseDown={(e) => {e.stopPropagation()}}
    >
        <button className='absolute left-4 top-4 cursor-pointer' onClick={() => {setSidebarOpen(false)}}>
            <X className='size-6' strokeWidth={1.5} />
        </button>
        <Link href="/" onClick={() => {if (pathname === "/") setSidebarOpen(false)}}>
            <Image src="/logo/logo-white.svg" width={228} height={56} alt='logo' className='h-8 w-fit mx-auto mb-4'/>
        </Link>
        <Searchbar />
        <Accordion title='Catalog' isMenuAccordion>
            <div className='flex flex-col gap-4 pb-2 pl-4'>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog'}} className='font-manrope font-semibold'>{t("ALL_PRODUCTS.title")}</Link>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog', query: {category: "FOR_HER"}}} className='font-manrope font-semibold'>{t("FOR_HER.title")}</Link>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog', query: {category: "FOR_HIM"}}} className='font-manrope font-semibold'>{t("FOR_HIM.title")}</Link>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog', query: {category: "FOR_KIDS"}}} className='font-manrope font-semibold'>{t("FOR_KIDS.title")}</Link>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog', query: {category: "ACCESSORIES"}}} className='font-manrope font-semibold'>{t("ACCESSORIES.title")}</Link>
                <Link onClick={() => {if (pathname === "/catalog") setSidebarOpen(false)}} href={{pathname: '/catalog', query: {category: "FLOWERS_AND_BALLOONS"}}} className='font-manrope font-semibold'>{t("FLOWERS_AND_BALLOONS.title")}</Link>
            </div>
        </Accordion>
        <Link className='py-4 border-b border-lightgray' href="/" onClick={() => {if (pathname === "/") setSidebarOpen(false)}}>
            <span className='pl-2 font-manrope font-semibold leading-5'>Acasă</span>
        </Link>
        <Link className='py-4 border-b border-lightgray' href="/about-us" onClick={() => {if (pathname === "/about-us") setSidebarOpen(false)}}>
            <span className='pl-2 font-manrope font-semibold leading-5'>Despre Noi</span>
        </Link>
        <Link className='py-4 border-b border-lightgray' href="/blogs" onClick={() => {if (pathname === "/blogs") setSidebarOpen(false)}}>
            <span className='pl-2 font-manrope font-semibold leading-5'>Blog</span>
        </Link>
        <Link className='py-4 border-b border-lightgray' href="/contacts" onClick={() => {if (pathname === "/contacts") setSidebarOpen(false)}}>
            <span className='pl-2 font-manrope font-semibold leading-5'>Contacte</span>
        </Link>
    </motion.div>
  )
}
