'use client'

import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function BlogSectionSkeleton() {
  return (
    <div className='col-span-7 col-start-5 mt-16 mb-42'>
      {/* Title skeleton */}
      <Skeleton className='h-12 w-3/4 font-manrope text-3xl leading-11 mb-6 rounded-md'/>
      
      {/* Tag and reading info skeleton */}
      <div className="flex justify-between items-center mb-12">
        <Skeleton className='h-12 w-36 rounded-3xl'/>
        <div className="flex gap-4">
          <Skeleton className='h-6 w-24 rounded-md'/>
          <Skeleton className='h-6 w-32 rounded-md'/>
        </div>
      </div>
      
      {/* Main image skeleton */}
      <Skeleton className='w-full aspect-[824/544] rounded-2xl mb-4'/>
      
      {/* First section */}
      <Skeleton className='h-10 w-1/2 my-8 rounded-md'/>
      <Skeleton className='h-24 w-full rounded-md mb-8'/>
      
      {/* Second section */}
      <Skeleton className='h-10 w-2/3 my-8 rounded-md'/>
      <Skeleton className='h-36 w-full rounded-md mb-8'/>
    </div>
  )
}