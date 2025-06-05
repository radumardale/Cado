import { useRouter } from '@/i18n/navigation'
import { COLORS } from '@/lib/colors/colors'
import { easeInOutCubic } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

interface CatalogMenuButtonProps {
  isCatalogMenuOpen: boolean,
  setCatalogButtonActive: (v: boolean) => void
}

const overlayVariants = {
  initial: {
    clipPath: 'inset(0px 0px 0px 0px)'
  },
  open: {
    clipPath: ["inset(100% 0px 0px 0px)", "inset(0px 0px 0px 0px)"]
  },
  close: {
    clipPath: ["inset(0px 0% 0% 0px)", "inset(0px 0% 100% 0px)"],
  }
}

export default function CatalogMenuButton({isCatalogMenuOpen, setCatalogButtonActive}: CatalogMenuButtonProps) {
  const router = useRouter();
  return (
    <div onClick={() => {router.push("/catalog")}} className={`flex items-center gap-2 rounded-3xl h-12 py-3 px-6 border border-black transition duration-500 relative cursor-pointer ${isCatalogMenuOpen ? "text-white" : ""}`} onMouseEnter={() => {setCatalogButtonActive(true)}} onMouseLeave={() => {setCatalogButtonActive(false)}}>
        <motion.div 
            className="absolute -z-10 bg-black left-0 top-0 w-full h-full rounded-3xl" 
            variants={overlayVariants} 
            initial={false}
            animate={isCatalogMenuOpen ? "open" : "close"}
            transition={{ease: easeInOutCubic, duration: .3}}>
          </motion.div>
        <span className='font-semibold font-manrope'>Catalog</span>
        <ChevronDown className={`size-5 transition duration-300 ${isCatalogMenuOpen ? "rotate-180" : ""}`} strokeWidth={2} color={isCatalogMenuOpen ? COLORS.white : COLORS.black}/>
    </div>
  )
}