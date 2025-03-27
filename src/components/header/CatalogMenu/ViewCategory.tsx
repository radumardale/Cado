import Image from 'next/image'

export default function ViewCategory() {
  return (
    <div className='col-span-2 relative'>
        <div className='absolute bottom-4 left-4 w-[calc(100%-2rem)] flex justify-center items-center bg-white rounded-3xl h-12 font-semibold font-manrope'>Vezi seturi cadou</div>
        <Image src="/catalog_menu/gift_set.png" alt="gift set" className='w-full h-full object-cover rounded-2xl' width={244} height={268}/>
    </div>
  )
}
