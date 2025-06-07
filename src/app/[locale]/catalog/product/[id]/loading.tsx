'use client'

import Header from "@/components/header/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mr-[10px] col-span-full grid grid-cols-full">
            <Header />
            <div className='col-span-full lg:col-start-2 lg:col-span-5 grid grid-cols-5 lg:grid-cols-5 mt-2 lg:mt-16 gap-x-6 mb-4 lg:mb-31 relative h-fit cursor-pointer -ml-4 w-[calc(100%+2rem)] lg:mx-0 lg:w-full px-4 lg:px-0 overflow-hidden lg:overflow-visible'>
                <Skeleton className='rounded-lg lg:rounded-2xl flex-1 relative top-0 lg:relative mb-4 w-full max-w-full cursor-grab box-border aspect-[4/5] col-span-full' />
                <div
                    className={`h-auto w-full col-span-full relative group flex gap-x-6`}
                >
                    {Array.from({length: 5}).map((_, index) => (
                        <Skeleton key={index} className='aspect-square flex-1 hidden lg:block' />
                    ))}
                </div>
            </div>
            <div className='col-span-full lg:col-start-8 lg:col-span-6 pb-24 lg:pb-31 lg:mt-16 top-25 h-fit'>
                <div>
                    <Skeleton className='h-8 lg:h-9 w-3/4 mb-4' />
                    <div className="flex items-center gap-4 my-4">
                        <Skeleton className='h-8 w-26 rounded-3xl' />
                        <div className="flex gap-2 items-center">
                            <Skeleton className='size-2 rounded-full' />
                            <Skeleton className='h-6 w-16' />
                        </div>
                    </div>
                    <Skeleton className='h-24 w-full mb-4 lg:mb-8' />
                    <Skeleton className='h-24 w-1/2 mb-4 lg:mb-8' />
                    <div className="grid grid-cols-6 gap-x-6 col-span-5 mb-8">
                        <Skeleton className='col-span-full lg:col-span-2 h-12 rounded-3xl' />
                        <Skeleton className='col-span-full lg:col-span-4 h-12 rounded-3xl' />
                    </div>
                </div>
            </div>
        </div>
    )
  }

