import { useTRPC } from '@/app/_trpc/client';
import { Link } from '@/i18n/navigation';
import { CartInterface } from '@/lib/types/CartInterface';
import { easeInOutCubic } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

interface CartSidebarInterface {
  setSidebarOpen: (v: boolean) => void;
  items: CartInterface[];
  locale: string;
  setValue: (v: CartInterface[]) => void;
}

export default function CartSidebar({
  items,
  locale,
  setSidebarOpen,
  setValue,
}: CartSidebarInterface) {
  const t = useTranslations('Cart');

  const trpc = useTRPC();
  const { data, isLoading, isSuccess } = useQuery(
    trpc.products.getProductsByIds.queryOptions({ ids: items.map(item => item.productId) })
  );
  const [products, setProducts] = useState<ProductInterface[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!data?.products && !isSuccess) {
        setValue([]);
        return;
      }

      setProducts(data.products);
      const validProductIds =
        data?.products?.map((product: ProductInterface) => product.custom_id) || [];
      const filteredItems = items.filter(item => validProductIds.includes(item.productId));
      if (filteredItems.length !== items.length) {
        setValue(filteredItems);
      }

      const updatedItems = filteredItems.map(item => {
        const product = data.products.find(
          (product: ProductInterface) => product.custom_id === item.productId
        );
        if (product && item.quantity > product.stock_availability.stock) {
          return { ...item, quantity: product.stock_availability.stock };
        }
        return item;
      });
      setValue(updatedItems);
    }
  }, [data, isLoading]);

  return (
    <motion.div
      onMouseDown={e => {
        e.stopPropagation();
        setSidebarOpen(false);
      }}
      className='fixed w-screen h-full top-0 left-0 z-50 flex justify-end'
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, ease: easeInOutCubic } }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: easeInOutCubic } }}
        className='absolute left-0 top-0 z-0 w-full h-full bg-darkblue/75 backdrop-blur-xs'
      ></motion.div>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { duration: 0.4, ease: easeInOutCubic } }}
        exit={{ x: '100%', transition: { duration: 0.4, ease: easeInOutCubic } }}
        className='bg-white h-full w-full lg:w-1/3 z-10 pt-3 lg:pt-6 px-4 lg:pl-6 lg:pr-8 relative flex flex-col pb-32 lg:pb-42'
        onMouseDown={e => {
          e.stopPropagation();
        }}
      >
        <div className='flex justify-between items-center mb-6 lg:mb-12'>
          <div className='flex gap-2'>
            <p className='text-black font-manrope text-2xl leading-7 font-semibold'>{t('title')}</p>
            <div className='rounded-full size-8 bg-black text-white text-sm flex items-center justify-center leading-tight'>
              {items.length}
            </div>
          </div>
          <button
            className='cursor-pointer'
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <X className='size-6 lg:size-8' strokeWidth={1.5} />
          </button>
        </div>
        {items.length > 0 ? (
          <div
            data-lenis-prevent
            className='xl:pl-10 lg:pr-4 xl:pr-8 flex flex-col gap-6 flex-1 overflow-y-auto scroll-bar-custom'
          >
            {items.map((item, index) => {
              const product =
                products.find(
                  (product: ProductInterface) => product.custom_id === item.productId
                ) || undefined;
              if (!product) return;

              return (
                <div key={index} className='w-full flex gap-2 lg:gap-4'>
                  <Link
                    href={{ pathname: '/catalog/product/[id]', params: { id: item.productId } }}
                    className='peer bg-purewhite rounded-lg'
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.title[locale]}
                      width={129}
                      height={164}
                      className='w-32 aspect-[129/164] object-contain'
                    />
                  </Link>
                  <div className='flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full'>
                    <div>
                      <p className='font-manrope text-sm w-fit font-semibold mb-4 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>
                        {product.title[locale]}
                      </p>
                      <div className={`flex gap-1 items-center`}>
                        {product.sale && product.sale.active && (
                          <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>
                            {product.price.toLocaleString()} MDL
                          </p>
                        )}
                        <div
                          className={`font-manrope font-semibold border border-gray rounded-3xl w-fit py-2 px-4`}
                        >
                          {product.sale && product.sale.active
                            ? product.sale.sale_price.toLocaleString()
                            : product.price.toLocaleString()}{' '}
                          MDL
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between items-end'>
                      <div className='w-30 flex items-center justify-between font-manrope font-semibold py-1 px-4 border border-gray rounded-3xl'>
                        <button
                          disabled={item.quantity === 1}
                          className='cursor-pointer disabled:pointer-events-none disabled:text-gray'
                          onClick={() => {
                            const newItems = [...items];
                            newItems[index].quantity = Math.max(1, newItems[index].quantity - 1);
                            setValue(newItems);
                          }}
                        >
                          <Minus strokeWidth={1.5} className='w-6' />
                        </button>

                        <span className={`${item.quantity}`}>{item.quantity}</span>

                        <button
                          disabled={item.quantity === product.stock_availability.stock}
                          onClick={() => {
                            const newItems = [...items];
                            newItems[index].quantity = Math.min(
                              product.stock_availability.stock,
                              newItems[index].quantity + 1
                            );
                            setValue(newItems);
                          }}
                          className='cursor-pointer disabled:pointer-events-none disabled:text-gray'
                        >
                          <Plus strokeWidth={1.5} className='w-6' />
                        </button>
                      </div>

                      <button
                        className='text-gray cursor-pointer relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'
                        onClick={() => {
                          const newItems = items.filter((_, i) => i !== index);
                          setValue(newItems);
                        }}
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='absolute left-0 top-1/2 -translate-y-1/2 w-full px-8 lg:px-16'>
            <ShoppingBag className='size-12 mx-auto mb-2' strokeWidth={1.25} />
            <p className='text-center text-sm leading-4 lg:leading-5 lg:text-base'>{t('empty')}</p>
          </div>
        )}
        <div className='absolute left-0 w-full bottom-6 lg:bottom-16 px-4 lg:pl-6 lg:pr-14 xl:px-16'>
          {items.length > 0 && products.length > 0 && (
            <div className='flex justify-between items-end mb-4'>
              <p>{t('subtotal')}:</p>
              <p className='font-semibold'>
                {items
                  .reduce((acc, item) => {
                    const product = products.find(product => product.custom_id === item.productId);
                    return (
                      acc +
                      (product?.sale.active ? product.sale.sale_price : product?.price || 0) *
                        item.quantity
                    );
                  }, 0)
                  .toLocaleString()}{' '}
                MDL
              </p>
            </div>
          )}
          {items.length > 0 ? (
            <Link href='/checkout'>
              <button className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300'>
                {t('to_checkout')}
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                setSidebarOpen(false);
              }}
              className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300'
            >
              {t('back')}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
