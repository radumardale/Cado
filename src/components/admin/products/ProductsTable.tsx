'use client';

import { Link } from '@/i18n/navigation';
import { stockStateColors } from '@/lib/enums/StockState';
import { ProductInterface } from '@/models/product/types/productInterface';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

interface ProductsTableProps {
  queryProducts: ProductInterface[];
}

export default function ProductsTable({ queryProducts }: ProductsTableProps) {
  const t = useTranslations('ProductPage.stock_state');
  const locale = useLocale();

  const products_t = useTranslations('Admin.AdminProducts');

  return (
    <>
      <div className='col-span-12 grid grid-cols-12 mt-6 pb-2 border-b border-lightgray gap-x-6'>
        <p className='font-manrope font-semibold leading-5 pl-6 w-[calc(100%+1.5rem)] col-span-1'>
          {products_t('id')}
        </p>
        <p className='font-manrope font-semibold leading-5 col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>
          {products_t('image')}
        </p>
        <p className='font-manrope col-span-4 font-semibold -translate-x-1/8 w-[112.5%] leading-5'>
          {products_t('title')}
        </p>
        <p className='col-start-8 col-span-2 font-manrope font-semibold leading-5'>
          {products_t('price')}
        </p>
        <p className='col-span-2 font-manrope font-semibold leading-5'>{products_t('stock')}</p>
        <p className='font-manrope font-semibold leading-5'>{products_t('stock_nr')}</p>
      </div>
      <Link
        href='/admin/products/new'
        className='col-span-full h-18 flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-3xl mt-8 border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'
      >
        <Plus strokeWidth={1.5} className='size-6' />
        <p>{products_t('add_product')}</p>
      </Link>
      {queryProducts.map((product: ProductInterface, index) => {
        return (
          <Link
            href={{ pathname: '/admin/products/[id]', params: { id: product.custom_id } }}
            key={index}
            className='grid grid-cols-12 col-span-12 gap-x-6 h-18 border border-gray hover:border-black transition duration-300 rounded-3xl items-center mb-4 last-of-type:mb-6'
          >
            <p className='pl-6 w-[calc(100%+1.5rem)] col-span-1 z-50'>{product.custom_id}</p>
            <div className='col-span-2 translate-x-1/2 w-[calc(50%-.75rem)]'>
              <div className='bg-purewhite w-fit rounded-sm'>
                <Image
                  src={product.images[0]}
                  alt={product.title[locale]}
                  width={96}
                  height={128}
                  className='w-12 h-16 rounded-sm object-contain'
                />
              </div>
            </div>
            <p className='col-span-4 font-semibold -translate-x-1/8 w-[112.5%]'>
              {product.title[locale]}
            </p>
            <div className='col-span-2 font-semibold flex gap-0'>
              <p className='flex-1'>
                {product.sale && product.sale.active
                  ? product.sale.sale_price.toLocaleString()
                  : product.price.toLocaleString()}{' '}
                MDL
              </p>
              {product.sale && product.sale.active && (
                <p className='text-gray line-through flex-1'>
                  {product.price.toLocaleString()} MDL
                </p>
              )}
            </div>
            <p
              className='col-span-2 font-semibold'
              style={{ color: stockStateColors[product.stock_availability.state] }}
            >
              {t(product.stock_availability.state)}
            </p>
            <p className='font-semibold'>{product.stock_availability.stock}</p>
          </Link>
        );
      })}
    </>
  );
}
