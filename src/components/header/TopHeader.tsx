import React from 'react';

export default function TopHeader() {
  return (
    <div className='grid grid-cols-full gap-x-2 lg:gap-x-6 col-span-full border-lightgray border-b bg-white z-50'>
      <div className='col-start-1 lg:col-start-2 2xl:col-start-2 col-span-8 lg:col-span-11 2xl:col-span-13 h-15 lg:h-12 flex justify-between items-center relative w-full'>
        <div className='flex flex-col lg:flex-row lg:gap-4'>
          <p className='text-sm lg:text-base text-gray'>order@cado.md</p>
          <p className='text-sm lg:text-base text-gray hidden lg:block'>/</p>
          <p className='text-sm lg:text-base text-gray'>info@cado.md</p>
        </div>
        <div className='flex flex-col lg:flex-row lg:gap-4'>
          <p className='text-sm lg:text-base text-gray'>+373 (69) 645 153</p>
          <p className='text-sm lg:text-base text-gray hidden lg:block'>/</p>
          <p className='text-sm lg:text-base text-gray'>+373 (68) 501 809</p>
        </div>
      </div>
    </div>
  );
}
