import { Checkbox } from "@/components/ui/checkbox"
import { Ocasions } from "@/lib/enums/Ocasions";
import { useTranslations } from "next-intl"

interface CheckboxListProps {
    translationTitle: string,
    activeValues: string[],
    values: string[],
    updateValues: (value: Ocasions) => void,
}

export default function CheckboxList({activeValues, translationTitle, values, updateValues}: CheckboxListProps) {
    const t = useTranslations(translationTitle);
    
  return (
    <div className="flex flex-col gap-4">
        {
            values.map(value => {
                return (
                    <div key={value} className="flex items-center gap-2">
                        <Checkbox className="border-gray size-4 cursor-pointer" checked={activeValues.includes(value)} id={value} onClick={() => {updateValues(value as Ocasions)}} />
                        <label htmlFor={value} className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            {t(value)}
                        </label>
                    </div>
                )
            })
        }
    </div>    
    )
}
