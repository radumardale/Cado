'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface LoadingGridInterface {
    gridLayout: boolean,
    length: number
}

export default function LoadingGrid({gridLayout, length}: LoadingGridInterface) {

  return (
    <>
        {
            Array.from({ length: length }).map((_, index) => {
                return (
                    gridLayout ? <CardSkeleton key={index} /> : <ListSkeleton key={index}/>
                )
            })
        }
    </>
  )
}

const CardSkeleton = () => {
    return (
        <div className='col-span-3'>
            <Skeleton className='aspect-[339/425] mb-4 rounded-2xl'/>     
            <Skeleton className='w-40 h-5 mb-2'/>     
            <Skeleton className='w-28 h-8 rounded-3xl'/>      
        </div> 
    )
}

const ListSkeleton = () => {
    return (
        <div className='col-span-full grid grid-cols-10 gap-x-6 mb-6'>
            <Skeleton className='col-span-3 group aspect-[339/425] rounded-2xl'/>  
            <div className='col-span-4'>
                <Skeleton className='w-80 h-6 mb-8'/>     
                <Skeleton className='w-20 h-5 mb-4'/>      
                <Skeleton className='w-full h-24'/>      
            </div>   
            <div className='col-span-3'>
                <Skeleton className='w-full h-12 rounded-3xl mb-2'/>      
                <Skeleton className='w-full h-12 rounded-3xl'/>      
            </div>
        </div> 
    )
}