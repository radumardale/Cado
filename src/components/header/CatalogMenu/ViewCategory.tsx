import Image from 'next/image'

export default function ViewCategory() {
  return (
    <div className='col-span-2 relative cursor-pointer group'>
        <div className='absolute left-0 top-0 w-full h-full bg-pureblack opacity-0 group-hover:opacity-50 pointer-events-none z-0 rounded-2xl transition duration-300'></div>
        <div className='absolute bottom-4 left-4 w-[calc(100%-2rem)] flex justify-center items-center bg-white rounded-3xl h-12 font-semibold font-manrope'>Vezi seturi cadou</div>
        <Image src="/catalog_menu/gift_set.png" alt="gift set" className='w-full h-full object-cover rounded-2xl' width={244} height={268}/>
    </div>
  )
}
