import { Checkbox } from "@/components/ui/checkbox"
import { Ocasions } from "@/lib/enums/Ocasions";
import { checkboxUpdateUrlParams } from "@/lib/utils";
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from 'next/navigation';

interface CheckboxListProps {
    translationTitle: string,
    activeValues: string[],
    values: string[],
    updateValues: (value: Ocasions) => void,
    paramName?: string,
}

export default function CheckboxList({
    activeValues, 
    translationTitle, 
    values, 
    updateValues,
    paramName
}: CheckboxListProps) {
    const t = useTranslations(translationTitle);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const urlParamName = paramName || translationTitle;
    
    const handleValueChange = (value: string) => {
        updateValues(value as Ocasions);
        
        const newActiveValues = activeValues.includes(value) 
            ? activeValues.filter(item => item !== value)
            : [...activeValues, value];
            
            checkboxUpdateUrlParams(urlParamName, searchParams, router, newActiveValues);
    };
  
    return (
        <div className="flex flex-col gap-4">
            {values.map(value => (
                <div key={value} className="flex items-center gap-2">
                    <Checkbox 
                        className="border-gray size-4 cursor-pointer" 
                        checked={activeValues.includes(value)} 
                        id={value} 
                        onClick={() => handleValueChange(value)}
                    />
                    <label 
                        htmlFor={value} 
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        {t(value)}
                    </label>
                </div>
            ))}
        </div>    
    )
}