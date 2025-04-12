'use client';

import { Mail, X } from 'lucide-react';
import React from 'react';
import { toast as sonnerToast } from 'sonner';

export function toast() {
  return sonnerToast.custom((id) => (
    <ToastCustom
      id={id}
    />
  ));
}

function ToastCustom(props: ToastProps) {
  const { id } = props;

  return (
    <div className="py-4 px-6 rounded-2xl bg-white border border-gray w-94 relative">
      <button className='cursor-pointer absolute right-3 top-3' onClick={() => {sonnerToast.dismiss(id);}}>
        <X strokeWidth={1.25} className='size-6'/>
      </button>
      <Mail strokeWidth={1.25} className='size-12 mx-auto' />
      <p className='mt-2 font-manrope font-semibold text-center leading-4'>Mesaj trimis cu succes</p>
      <p className='mt-4 font-manrope font-semibold text-center text-sm leading-4'>Echipa noastră a primit solicitarea ta și va reveni cu un răspuns în cel mai scurt timp posibil.</p>
    </div>
  );
}

interface ToastProps {
  id: string | number;
}