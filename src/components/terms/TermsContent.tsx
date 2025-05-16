import { useTranslations } from 'next-intl';
import { TermsSectionsArr } from '@/lib/enums/TermsSections'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronDown } from 'lucide-react';

interface TermsSidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
}

export default function TermsContent({activeSection, setActiveSection}: TermsSidebarProps) {
    const t = useTranslations("terms_sections");

  return (
    <div className='col-span-8 lg:col-start-5 lg:col-span-7 mt-16 mb-16 lg:mb-24'>
       <Select 
                    defaultValue={activeSection.toString()}
                    onValueChange={(e) => {setActiveSection(Number(e))}}
                >
                    <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold w-full mb-8 lg:hidden">
                        <SelectValue placeholder="Regiunea" />
                        <ChevronDown className='size-5' strokeWidth={1.5}/>
                    </SelectTrigger>
                    <SelectContent className="border-gray">
                        <SelectGroup>
                            {
                              TermsSectionsArr.map((section, index) => {
                                return (
                                  <SelectItem key={index} className="text-base cursor-pointer font-semibold font-manrope" value={index.toString()}>{t(section + '.title')}</SelectItem>
                                )
                              })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
        <h1 className='font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-12 lg:mb-16'>{t(TermsSectionsArr[activeSection] + ".title")}</h1>
        {
          t.rich(TermsSectionsArr[activeSection] + '.description', {
            title: (chunks) => <h2 className='font-manrope text-2xl lg:text-[2rem] leading-7 lg:leading-11 uppercase font-semibold my-6 lg:my-8'>{chunks}</h2>,
            item: (chunks) => <li className='ml-4'>{chunks}</li>,
            br: () => <br />,
          })
        }
    </div>
  )
}
