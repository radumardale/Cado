'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const LangPicker = ({ language, setLanguage }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive]);

  const getLocaleName = (locale: string) => {
    switch (locale) {
      case 'ro':
        return 'Română';
      case 'ru':
        return 'Русский';
      case 'en':
        return 'English';
      default:
        return locale;
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative flex items-center gap-[0.25rem] cursor-pointer'
      onClick={() => setIsActive(!isActive)}
    >
      <div className='w-full h-[3rem] px-[1.5rem] flex items-center justify-between border border-[#929292] rounded-[1.5rem]'>
        <p className={`text-[1rem] font-manrope font-bold select-none`}>
          {getLocaleName(language)}
        </p>
        <ChevronDown size={16} className={`${isActive && 'rotate-180'} transition-transform`} />
      </div>
      {isActive && (
        <div className='absolute w-full bg-[#FAFAFA] rounded-[1rem] top-[110%] left-[50%] -translate-x-[50%] flex flex-col items-center shadow-custom border border-[#929292] '>
          <div className='p-[0.25rem] flex flex-col text-base w-full'>
            <div
              onClick={() => {
                setLanguage('ro');
              }}
              className='hover:bg-gray/10 w-full leading-[2.5] px-[1.5rem] rounded-[0.5rem] transition-colors duration-300 select-none'
            >
              Română
            </div>
            <div
              onClick={() => {
                setLanguage('ru');
              }}
              className='hover:bg-gray/10 w-full leading-[2.5] px-[1.5rem] rounded-[0.5rem] transition-colors duration-300 select-none'
            >
              Русский
            </div>
            <div
              onClick={() => {
                setLanguage('en');
              }}
              className='hover:bg-gray/10 w-full leading-[2.5] px-[1.5rem] rounded-[0.5rem] transition-colors duration-300 select-none'
            >
              English
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LangPicker;
