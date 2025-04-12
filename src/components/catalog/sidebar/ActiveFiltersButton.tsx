import { COLORS } from "@/lib/colors/colors"
import { X } from "lucide-react"

interface ActiveFiltersButtonInterface {
    title: string,
    onClick: () => void
}

export const ActiveFiltersButton = ({title, onClick}: ActiveFiltersButtonInterface) => {
    return (
        <button className="bg-black h-12 px-6 text-white font-manrope font-semibold rounded-3xl flex items-center gap-1 max-w-full cursor-pointer hover:opacity-75 transition duration-300" onClick={onClick}>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
            <X color={COLORS.white} className="w-4 h-4 min-w-fit"/>
        </button>
    )
}