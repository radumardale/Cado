import { easeInOutCubic } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect, useState } from 'react';
import { CountriesOptions, CountriesOptionsArr, CountriesOptionsInterface } from '@/lib/enums/CountriesOptions';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LangSidebarInterface {
    setSidebarOpen: (v: boolean) => void,
}


export default function LangSidebar({setSidebarOpen}: LangSidebarInterface) {
    const [country, setCountry] = useState<CountriesOptionsInterface | null>(null);
    const [language, setLanguage] = useState("");
    const t = useTranslations("lang");
    
    useEffect(() => {
        let country = window.location.hostname.split(".")[1] as CountriesOptionsInterface;

        if (!CountriesOptionsArr.includes(country)) country = CountriesOptionsInterface.md;

        setCountry(country);
        setLanguage(CountriesOptions[country ? country : 'md'][0]);
    }, [])

  return (
    <motion.div 
        onMouseDown={(e) => {e.stopPropagation(); setSidebarOpen(false)}} 
        className='fixed w-screen h-screen top-0 left-0 z-50 flex justify-end'
    >
        <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1, transition: {duration: .4, ease: easeInOutCubic}}} 
            exit={{opacity: 0, transition: {duration: .4, ease: easeInOutCubic}}} 
            className='absolute left-0 top-0 z-0 w-full h-full bg-darkblue/75 backdrop-blur-xs'
        ></motion.div>

        <motion.div 
            initial={{x: '100%'}} 
            animate={{x: 0, transition: {duration: .4, ease: easeInOutCubic}}} 
            exit={{x: '100%', transition: {duration: .4, ease: easeInOutCubic}}} 
            className='bg-white h-full w-full lg:w-1/3 z-10 pt-3 lg:pt-6 px-4 lg:pl-6 lg:pr-8 relative flex flex-col pb-32 lg:pb-42' 
            onMouseDown={(e) => {e.stopPropagation()}}
        >
            <Image src="/ribbon/lang-ribbon.png" className='absolute right-0 bottom-0 w-1/2' alt="ribbon" width={270} height={277} />
             <div className="flex justify-between items-center mb-6 lg:mb-12">
                <p className='text-2xl leading-7 font-manrope font-semibold'>Limba / Țară</p>
                <button className='cursor-pointer' onClick={() => {setSidebarOpen(false)}}>
                    <X className='size-6 lg:size-8' strokeWidth={1.5} />
                </button>
            </div>
            <div className='lg:px-12'>
                <p className='leading-5 mb-6'>Metodele de livrare și condițiile de vânzare vor fi actualizate atunci când schimbați țara.</p>
                <Select 
                    defaultValue={country ? country : "md"}
                    onValueChange={(e) => {setCountry(e as CountriesOptionsInterface); setLanguage(CountriesOptions[e as CountriesOptionsInterface][0])}}
                >
                    <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold w-full mb-2">
                        <SelectValue placeholder="Regiunea" />
                        <ChevronDown className='size-5' strokeWidth={1.5}/>
                    </SelectTrigger>
                    <SelectContent className="border-gray">
                        <SelectGroup>
                            <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value='md'>Republica Moldova (MDL)</SelectItem>
                            <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value='ro'>România (RON)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select 
                    value={language}
                    onValueChange={(value) => {setLanguage(value)}}
                >
                    <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold w-full">
                        <SelectValue placeholder="Limba" />
                        <ChevronDown className='size-5' strokeWidth={1.5}/>
                    </SelectTrigger>
                    <SelectContent className="border-gray">
                        <SelectGroup>
                            {
                                CountriesOptions[country ? country : 'md'].map((language, index) => {
                                    return (
                                        <SelectItem key={index} className="text-base cursor-pointer font-semibold font-manrope" value={language}>{t(language)}</SelectItem>
                                    )
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Link href={`/`}>
                    <button className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300 mt-6'>Actualizează</button>
                </Link>
            </div>
        </motion.div>
    </motion.div>
  )
}
