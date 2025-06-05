import { useTRPC } from '@/app/_trpc/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'

export default function SeasonCatalog() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.seasonCatalog.getSeasonCatalog.queryOptions());

  return (
    <>
        {
            data?.seasonCatalog?.active &&
            <div className='col-span-full lg:col-span-5 lg:col-start-4 mt-16 -mb-8 z-20'>
                <h2 className='font-manrope text-2xl lg:text-3xl font-semibold leading-7 lg:leading-11 mb-6'>CATALOG DE SEZON</h2>
                <Link target='_blank' href={data?.seasonCatalog?.link || "#"} className='px-6 bg-blue-2 h-12 rounded-3xl text-white w-fit flex items-center hover:opacity-75 transition duration-200'>Catalog WELCOME BOX</Link>
            </div>
        }
    </>
  )
}
