'use client';

import { Link } from '@/i18n/navigation';
import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { toast as sonnerToast } from 'sonner';

export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <ToastCustom
      id={id}
      title={toast.title}
      image={toast.image}
      price={toast.price}
    />
  ));
}

function ToastCustom(props: ToastProps) {
  const { title, image, price, id } = props;

  return (
    <div className="py-4 px-6 rounded-2xl bg-white border border-gray w-94">
      <div className="flex justify-between items-center mb-4">
        <p className='font-manrope leading-5 font-semibold'>Adăugat în coș</p>
        <button className='cursor-pointer' onClick={() => {sonnerToast.dismiss(id);}}>
          <X strokeWidth={1.25}/>
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        <Image src={image} alt={title} width={129} height={164} className='w-32 rounded-lg'/>
        <div>
            <p className='font-manrope text-sm font-semibold mb-2'>{title}</p>
            <div className='font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>{price} MDL</div>
        </div>
      </div>
      <Link href="/checkout">
        <button className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300'>Spre achitare</button>
      </Link>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  image: string;
  price: number
}