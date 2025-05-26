'use client'

import { ClientInterface } from '@/models/client/types/clientInterface';

interface ClientTableProps {
    queryClients: ClientInterface[]
}

export default function ClientTable({queryClients}: ClientTableProps) {
  return (
    <>
        <div className='col-span-12 grid grid-cols-12 mt-6 pb-2 border-b border-lightgray gap-x-6 pr-6 mb-8'>
            <p className='font-manrope font-semibold leading-5 col-span-3'>Email</p>
            <p className='font-manrope font-semibold leading-5 col-span-3'>Prenume, Nume</p>
            <p className='font-manrope col-span-2 font-semibold leading-5'>Telefon</p>
            <p className='font-manrope font-semibold leading-5 col-span-2'>№ comenzi</p>
        </div>
        {
            queryClients.map((client: ClientInterface, index) => {
                return (
                    <div key={index} className='grid grid-cols-12 col-span-12 gap-x-6 h-18 border border-gray hover:border-black transition duration-300 rounded-3xl items-center mb-4 last-of-type:mb-6 pr-6'>
                        <p className='col-span-3 pl-6 font-semibold'>{client.email}</p>
                        <p className='leading-5 col-span-3'>{client.firstname}, {client.lastname}</p>
                        <p className='col-span-2'>{client.tel_number}</p>
                        <p className='col-span-2'>{client.orders.length}</p>
                    </div>
                )
            })
        }
    </>
  )
}
