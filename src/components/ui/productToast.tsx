'use client';

import { useCartStore } from '@/states/CartState';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { toast as sonnerToast } from 'sonner';

export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(id => (
    <ToastCustom id={id} title={toast.title} image={toast.image} price={toast.price} />
  ));
}

function ToastCustom(props: ToastProps) {
  const { title, image, price, id } = props;
  const setCartOpen = useCartStore(store => store.setOpen);

  const t = useTranslations('ProductPage.Toast');

  return (
    <div className='py-4 px-6 rounded-2xl bg-white border border-gray w-full lg:w-94'>
      <div className='flex justify-between items-center mb-4'>
        <p className='font-manrope leading-5 font-semibold'>{t('added')}</p>
        <button
          className='cursor-pointer'
          onClick={() => {
            sonnerToast.dismiss(id);
          }}
        >
          <X strokeWidth={1.25} />
        </button>
      </div>
      <div className='flex gap-2 mb-6'>
        <div className='w-32 aspect-[339/425] bg-purewhite rounded-lg overflow-hidden relative'>
          <Image
            src={image}
            alt={title}
            width={129}
            height={164}
            className='w-full absolute top-1/2 -translate-y-1/2'
          />
        </div>
        <div>
          <p className='font-manrope text-sm font-semibold mb-2'>{title}</p>
          <div className='font-manrope font-semibold py-2 px-4 border border-gray rounded-3xl w-fit'>
            {price.toLocaleString()} MDL
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          sonnerToast.dismiss(id);
          setCartOpen(true);
        }}
        className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300'
      >
        {t('see')}
      </button>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  image: string;
  price: number;
}
