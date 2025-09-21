'use client';
import { useLocalStorage } from 'usehooks-ts';
import CheckoutCart from './CheckoutCart';
import CheckoutForm from './CheckoutForm';
import { CartInterface } from '@/lib/types/CartInterface';
import { DeliveryRegions } from '@/lib/enums/DeliveryRegions';
import { useState } from 'react';
import { DeliveryHours } from '@/lib/enums/DeliveryHours';
import { useTRPC } from '@/app/_trpc/client';
import { ProductInterface } from '@/models/product/types/productInterface';

import { useQuery } from '@tanstack/react-query';

export default function CheckoutSection() {
  const trpc = useTRPC();
  const [items, setValue] = useLocalStorage<CartInterface[]>('cart', []);
  const [deliveryRegion, setDeliveryRegion] = useState<DeliveryRegions | null>(
    DeliveryRegions.CHISINAU
  );
  const [deliveryHour, setDeliveryHour] = useState<DeliveryHours | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const { data: productsData, isLoading } = useQuery(
    trpc.products.getProductsByIds.queryOptions({
      ids: items.map(item => item.productId),
    })
  );

  return (
    <div className='relative col-span-full grid grid-cols-8 lg:grid-cols-15 mt-16 gap-x-2 lg:gap-x-6'>
      <CheckoutForm
        products={!isLoading ? (productsData?.products as ProductInterface[]) : []}
        items={items}
        setDeliveryRegion={setDeliveryRegion}
        setDeliveryHour={setDeliveryHour}
        totalCost={totalCost}
      />
      <CheckoutCart
        products={!isLoading ? (productsData?.products as ProductInterface[]) : []}
        items={items}
        setValue={setValue}
        deliveryRegion={deliveryRegion}
        deliveryHour={deliveryHour}
        setTotalCost={setTotalCost}
      />
    </div>
  );
}
