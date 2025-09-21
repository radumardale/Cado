/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useEffect } from 'react';
import OrdersForm from '../OrdersForm';
import { useTRPC } from '@/app/_trpc/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { ClientEntity } from '@/models/order/types/orderEntity';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { Form } from '@/components/ui/form';
import { updateOrderRequestSchema } from '@/lib/validation/order/updateOrderRequest';
import OrdersProductsSummary from '../OrdersProductsSummary';

import { useQuery } from '@tanstack/react-query';
import { OrderState } from '@/models/order/types/orderState';

interface AdminOrderFormProps {
  id: string;
}

function isLegalAddress(address: any): address is { company_name: string; idno: string } {
  return address && typeof address === 'object' && 'company_name' in address && 'idno' in address;
}

export default function AdminOrderForm({ id }: AdminOrderFormProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.order.getOrderById.queryOptions({ id: id }));

  const form = useForm<z.infer<typeof updateOrderRequestSchema>>({
    resolver: zodResolver(updateOrderRequestSchema),
    defaultValues: {
      id: '',
      products: [],
      delivery_method: DeliveryMethod.HOME_DELIVERY,
      delivery_details: {
        delivery_date: '',
        hours_intervals: '',
        message: '',
        comments: '',
      },
      additional_info: {
        delivery_address: {
          region: 'CHISINAU',
          city: '',
          home_address: '',
          home_nr: '',
        },
        entity_type: ClientEntity.Natural,
        user_data: {
          email: '',
          tel_number: '',
          firstname: '',
          lastname: '',
        },
        billing_address: {
          company_name: '',
          firstname: '',
          idno: '',
          lastname: '',
          home_address: '',
          home_nr: '',
          region: 'CHISINAU',
          city: '',
        },
        billing_checkbox: true,
      },
      state: OrderState.NotPaid,
      payment_method: OrderPaymentMethod.Paynet,
      total_cost: 0,
    },
  });

  useEffect(() => {
    if (data?.order && !isLoading) {
      const products = data.order.products.map(product => {
        return {
          product: product.product,
          quantity: product.quantity,
        };
      });
      // Check if billing address is the same as delivery address
      const isSameAddress =
        !data?.order.additional_info?.billing_address ||
        data?.order.additional_info?.delivery_address?.home_address ===
          data?.order.additional_info?.billing_address?.home_address;

      const billingAddress = data.order.additional_info?.billing_address;

      // Determine address type by examining the object itself, not just relying on entity_type
      const isLegalAddressType = isLegalAddress(billingAddress);

      // Create the appropriate billing address based on actual type
      const formattedBillingAddress = isLegalAddressType
        ? {
            // Legal entity billing address
            company_name: billingAddress?.company_name || '',
            idno: billingAddress?.idno || '',
            region: billingAddress?.region || 'CHISINAU',
            city: billingAddress?.city || '',
            home_address: billingAddress?.home_address || '',
            home_nr: billingAddress?.home_nr || '',
          }
        : {
            // Normal person billing address
            firstname:
              billingAddress?.firstname || data.order.additional_info?.user_data?.firstname || '',
            lastname:
              billingAddress?.lastname || data.order.additional_info?.user_data?.lastname || '',
            region: billingAddress?.region || 'CHISINAU',
            city: billingAddress?.city || '',
            home_address: billingAddress?.home_address || '',
            home_nr: billingAddress?.home_nr || '',
          };

      // Prepare the form values
      const formValues = {
        id: data?.order._id,
        products: products,
        delivery_method: data?.order.delivery_method || DeliveryMethod.HOME_DELIVERY,
        delivery_details: {
          delivery_date: data.order.delivery_details?.delivery_date
            ? new Date(data.order.delivery_details.delivery_date).toISOString()
            : data?.order.delivery_details?.delivery_date || '',
          hours_intervals: data?.order.delivery_details?.hours_intervals || '',
          message: data?.order.delivery_details?.message || '',
          comments: data?.order.delivery_details?.comments || '',
        },
        additional_info: {
          delivery_address: {
            region: data?.order.additional_info?.delivery_address?.region || 'CHISINAU',
            city: data?.order.additional_info?.delivery_address?.city || '',
            home_address: data?.order.additional_info?.delivery_address?.home_address || '',
            home_nr: data?.order.additional_info?.delivery_address?.home_nr || '',
          },
          entity_type: data?.order.additional_info?.entity_type || ClientEntity.Natural,
          user_data: {
            email: data?.order.additional_info?.user_data?.email || '',
            tel_number: data?.order.additional_info?.user_data?.tel_number || '',
            firstname: data?.order.additional_info?.user_data?.firstname || '',
            lastname: data?.order.additional_info?.user_data?.lastname || '',
          },
          billing_address: formattedBillingAddress,
          billing_checkbox: isSameAddress,
        },
        state: data?.order.state || OrderState.NotPaid,
        payment_method: data?.order.payment_method || OrderPaymentMethod.Paynet,
        total_cost: data?.order.total_cost,
      };

      // Reset the form with the new values
      form.reset(formValues);
    }
  }, [data?.order, isLoading, form]);

  return (
    <Form {...form}>
      <div
        data-lenis-prevent
        className='col-span-7 grid grid-cols-7 scroll-bar-custom overflow-y-auto flex-1 -mr-6 pr-6 mt-4'
      >
        <OrdersForm orderId={id} />
      </div>
      <OrdersProductsSummary />
    </Form>
  );
}
