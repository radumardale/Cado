'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function BlogSkeleton() {

  return (
    <div className='col-span-6'>
        <Skeleton className='w-full aspect-[708/464] rounded-2xl mb-4'/>     
        <div className="flex justify-between items-center mb-4">
          <Skeleton className='h-12 w-38 rounded-3xl'/>     
          <Skeleton className='h-5 w-20 rounded-3xl'/>     
        </div>  
        <Skeleton className='w-full h-7 rounded-3xl'/>      
    </div> 
  )
}