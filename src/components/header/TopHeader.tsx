import React from 'react'

export default function TopHeader() {
  return (
    <div className="grid grid-cols-full gap-x-6 col-span-full border-lightgray border-b bg-white">
        <div className='lg:col-start-2 2xl:col-start-2 lg:col-span-11 2xl:col-span-13 h-12 flex justify-between items-center relative w-full'>
            <div className='flex gap-4'>
                <p className='text-gray'>order@cado.md</p>
                <p className='text-gray'>/</p>
                <p className='text-gray'>info@cado.md</p>
            </div>
            <div className='flex gap-4'>
                <p className='text-gray'>+373 (69) 645 153</p>
                <p className='text-gray'>/</p>
                <p className='text-gray'>+373 (69) 645 153</p>
            </div>
        </div>
    </div>
  )
}
