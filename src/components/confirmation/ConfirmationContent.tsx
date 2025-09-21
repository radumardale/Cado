'use client';
import { useTRPC } from '@/app/_trpc/client';
import { Link } from '@/i18n/navigation';
import { DeliveryRegions, getDeliveryPrice } from '@/lib/enums/DeliveryRegions';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { CircleCheckBig } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from 'usehooks-ts';
import { CartInterface } from '@/lib/types/CartInterface';
import { useEffect } from 'react';

interface ConfirmationContentProps {
  id: string;
}

export default function ConfirmationContent({ id }: ConfirmationContentProps) {
  const t = useTranslations('ConfirmationPage');

  const trpc = useTRPC();
  const { data } = useQuery(trpc.order.getOrderById.queryOptions({ id }));
  const locale = useLocale();
  const paymentMethodsT = useTranslations('Admin.AdminOrders.payment_methods');
  const deliveryRegionsT = useTranslations('CheckoutPage.CheckoutForm.delivery_regions');
  const [, setValue] = useLocalStorage<CartInterface[]>('cart', []);

  useEffect(() => {
    setValue([]);
  }, []);

  return (
    <div className='col-span-full lg:col-span-7 lg:col-start-5 mt-16 mb-24'>
      <CircleCheckBig strokeWidth={1.5} className='text-green size-12 mx-auto mb-6' />
      <p className='font-manrope font-semibold uppercase text-center text-[2rem] leading-9 mb-6'>
        {t('title')} <br /> {t('subtitle_slice_1')}{' '}
        <span className='underline'>#{data?.order?.custom_id}</span> {t('subtitle_slice_2')}
      </p>
      <p className='text-center mb-12'>
        {t('paragraph_slice_1')}{' '}
        <span className='font-semibold'>{data?.order?.additional_info.user_data.email}</span>{' '}
        {t('paragraph_slice_2')} <br />
        <br /> {t('paragraph_slice_3')}
      </p>
      <div className='border-t border-lightgray pt-4 mb-12'>
        <p className='font-manrope font-semibold mb-4'>{t('summary')}</p>
        <div className='grid col-span-full grid-cols-1 lg:grid-cols-2 gap-6'>
          {data?.order?.products.map((product, index) => (
            <div key={index} className='w-full flex gap-2 lg:gap-4'>
              <Link
                href={{
                  pathname: '/catalog/product/[id]',
                  params: { id: product.product.custom_id },
                }}
                className='peer bg-purewhite rounded-lg'
              >
                <Image
                  src={product.product.images[0]}
                  alt={product.product.title[locale]}
                  width={129}
                  height={164}
                  className='w-32 aspect-[129/164] object-contain peer'
                />
              </Link>
              <div className='flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full'>
                <div>
                  <p className='font-manrope text-sm leading-4 w-fit font-semibold mb-4 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>
                    {product.product.title[locale]}
                  </p>
                  <div className={`flex gap-1 items-center`}>
                    {product.product.sale && product.product.sale.active && (
                      <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>
                        {product.product.price.toLocaleString()} MDL
                      </p>
                    )}
                    <div
                      className={`font-manrope font-semibold border border-gray rounded-3xl w-fit py-2 px-4`}
                    >
                      {product.product.sale && product.product.sale.active
                        ? product.product.sale.sale_price.toLocaleString()
                        : product.product.price.toLocaleString()}{' '}
                      MDL
                    </div>
                  </div>
                </div>
                <p className='text-gray'>
                  {t('quantity')}: {product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='border-t border-lightgray pt-4 mb-12 flex flex-col gap-4'>
        {data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY && (
          <div className='flex justify-between'>
            <p>{t('subtotal')}:</p>
            <p>
              {data?.order?.products
                .reduce(
                  (acc, item) =>
                    acc +
                    ((item.product.sale?.active
                      ? item.product.sale.sale_price
                      : item.product.price) || 0) *
                      item.quantity,
                  0
                )
                .toLocaleString()}{' '}
              MDL
            </p>
          </div>
        )}
        {data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
          data?.order?.additional_info.delivery_address?.region && (
            <div className='flex justify-between'>
              <p>{t('delivery')}:</p>
              <p>
                {getDeliveryPrice(
                  data?.order?.additional_info.delivery_address.region as DeliveryRegions
                )}{' '}
                MDL
              </p>
            </div>
          )}
        <div className='flex justify-between'>
          <p>{t('total')}:</p>
          <p className='font-semibold'>{data?.order?.total_cost.toLocaleString()} MDL</p>
        </div>
      </div>
      <div className='border-t border-lightgray pt-4 grid grid-cols-2 gap-x-6 gap-y-8'>
        <div className='flex flex-col gap-2 overflow-hidden overflow-ellipsis'>
          <p className='font-manrope font-semibold mb-2'>{t('contact')}</p>
          <p>
            {data?.order?.additional_info.user_data.firstname}{' '}
            {data?.order?.additional_info.user_data.lastname}
          </p>
          <p className='truncate'>
            {t('email')}: {data?.order?.additional_info.user_data.email}
          </p>
          <p>
            {t('phone')}: {data?.order?.additional_info.user_data.tel_number}
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='font-manrope font-semibold mb-2'>{t('order_details')}</p>
          <p>
            {t('date')}:{' '}
            {data?.order?.createdAt
              ? new Date(data.order.createdAt).toLocaleDateString('ro-RO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : t('date_unavailable')}
          </p>
          <p>
            {t('payment_method')}: {paymentMethodsT(data?.order?.payment_method)}
          </p>
        </div>
        {data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
          data?.order?.additional_info.delivery_address && (
            <div className='flex flex-col gap-2'>
              <p className='font-manrope font-semibold mb-2'>{t('address')}</p>
              <p>
                {data?.order?.additional_info.user_data.firstname}{' '}
                {data?.order?.additional_info.user_data.lastname}
              </p>
              <p>
                {data?.order?.additional_info.delivery_address.home_address}{' '}
                {data?.order?.additional_info.delivery_address.home_nr}
              </p>
              <p>
                {
                  deliveryRegionsT(data?.order?.additional_info.delivery_address.region).split(
                    ' - '
                  )[0]
                }
                , {data?.order?.additional_info.delivery_address.city}
              </p>
              <p>{t('moldova')}</p>
            </div>
          )}
        <div className='flex flex-col gap-2'>
          <p className='font-manrope font-semibold mb-2'>{t('billing_address')}</p>
          <p>
            {data?.order?.additional_info.user_data.firstname}{' '}
            {data?.order?.additional_info.user_data.lastname}
          </p>
          <p>
            {data?.order?.additional_info.billing_address.home_address}{' '}
            {data?.order?.additional_info.billing_address.home_nr}
          </p>
          <p>
            {deliveryRegionsT(data?.order?.additional_info.billing_address.region).split(' - ')[0]},{' '}
            {data?.order?.additional_info.billing_address.city}
          </p>
          <p>{t('moldova')}</p>
        </div>
      </div>
    </div>
  );
}
