'use client';
import { useTRPC } from "@/app/_trpc/client"
import { Link } from "@/i18n/navigation";
import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
import { DeliveryMethod } from "@/models/order/types/deliveryMethod";
import { CircleCheckBig } from "lucide-react"
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { CartInterface } from "@/lib/types/CartInterface";
import { useEffect } from "react";

interface ConfirmationContentProps {
    id: string
}

export default function ConfirmationContent({ id }: ConfirmationContentProps) {
  const trpc = useTRPC();
  const { 
    data, 
} = useQuery(trpc.order.getOrderById.queryOptions({ id }));
  const locale = useLocale();
  const paymentMethodsT = useTranslations("payment_methods");
  const deliveryRegionsT = useTranslations("delivery_regions");
  const [,setValue] = useLocalStorage<CartInterface[]>("cart", []);

  useEffect(() => {
    setValue([]);
  }, [])

  return (
    <div className="col-span-7 col-start-5 mt-16 mb-24">
        <CircleCheckBig strokeWidth={1.5} className='text-green size-12 mx-auto mb-6' />
        <p className="font-manrope font-semibold uppercase text-center text-[2rem] leading-9 mb-6">Mulțumim MULT! <br/> comanda <span className="underline">#{data?.order?.custom_id}</span> a fost preluată</p>
        <p className="text-center mb-12">Am trimis un e-mail la adresa <span className="font-semibold">{data?.order?.additional_info.user_data.email}</span> cu confirmarea și factura comenzii. <br/><br/> Dacă nu ai primit e-mailul în două minute, te rugăm să verifici și folderul spam.</p>
        <div className="border-t border-lightgray pt-4 mb-12">
          <p className="font-manrope font-semibold mb-4">Sumarul comenzii</p>
          <div className="grid col-span-full grid-cols-2 gap-6">
            {
              data?.order?.products.map((product, index) => (
                <div key={index} className='w-full flex gap-2 lg:gap-4'>
                    <Link href={{pathname: '/catalog/product/[id]', params: {id: product.product.custom_id}}} className='peer bg-purewhite rounded-lg'>
                        <Image unoptimized src={product.product.images[0]} alt={product.product.title[locale]} width={129} height={164} className='w-32 aspect-[129/164] object-contain peer' />
                    </Link>
                    <div className='flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full'>
                        <div>
                            <p className='font-manrope text-sm leading-4 w-fit font-semibold mb-4 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>{product.product.title[locale]}</p>
                            <div className={`flex gap-1 items-center`}>
                                {
                                    product.product.sale && product.product.sale.active &&
                                    <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>{product.product.price.toLocaleString()} MDL</p>
                                }
                                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit py-2 px-4`}>{product.product.sale && product.product.sale.active ? product.product.sale.sale_price.toLocaleString() : product.product.price.toLocaleString()} MDL</div>
                            </div>
                        </div>
                        <p className="text-gray">Cantitatea: {product.quantity}</p>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="border-t border-lightgray pt-4 mb-12 flex flex-col gap-4">
          {
            data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>{data?.order?.products.reduce((acc, item) => acc + ((item.product.sale?.active ? item.product.sale.sale_price : item.product.price) || 0) * item.quantity, 0).toLocaleString()} MDL</p>
            </div>
          }
          {
            data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY && data?.order?.additional_info.delivery_address?.region &&
            <div className="flex justify-between">
              <p>Livrare:</p>
              <p>{getDeliveryPrice(data?.order?.additional_info.delivery_address.region as DeliveryRegions)} MDL</p>
            </div>
          }
             <div className="flex justify-between">
              <p>Total:</p>
              <p className="font-semibold">{data?.order?.total_cost.toLocaleString()} MDL</p>
            </div>
        </div>
        <div className="border-t border-lightgray pt-4 grid grid-cols-2 gap-x-6 gap-y-8">
          <div className="flex flex-col gap-2">
            <p className="font-manrope font-semibold mb-2">Detalii de contact</p>
            <p>{data?.order?.additional_info.user_data.firstname} {data?.order?.additional_info.user_data.lastname}</p>
            <p>Email: {data?.order?.additional_info.user_data.email}</p>
            <p>Metodă de plată: {data?.order?.additional_info.user_data.tel_number}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-manrope font-semibold mb-2">Datalii comandă</p>
            <p>Data: {data?.order?.createdAt ? new Date(data.order.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Data indisponibilă'}</p>
            <p>Metodă de plată: {paymentMethodsT(data?.order?.payment_method)}</p>
          </div>
          {
            data?.order?.delivery_method === DeliveryMethod.HOME_DELIVERY && data?.order?.additional_info.delivery_address &&
            <div className="flex flex-col gap-2">
              <p className="font-manrope font-semibold mb-2">Adresa de livrare</p>
              <p>{data?.order?.additional_info.user_data.firstname} {data?.order?.additional_info.user_data.lastname}</p>
              <p>{data?.order?.additional_info.delivery_address.home_address} {data?.order?.additional_info.delivery_address.home_nr}</p>
              <p>{deliveryRegionsT(data?.order?.additional_info.delivery_address.region).split(" - ")[0]}, {data?.order?.additional_info.delivery_address.city}</p>
              <p>Republica Moldova</p>
            </div>
          }
          <div className="flex flex-col gap-2">
            <p className="font-manrope font-semibold mb-2">Adresa de facturare</p>
            <p>{data?.order?.additional_info.user_data.firstname} {data?.order?.additional_info.user_data.lastname}</p>
            <p>{data?.order?.additional_info.billing_address.home_address} {data?.order?.additional_info.billing_address.home_nr}</p>
            <p>{deliveryRegionsT(data?.order?.additional_info.billing_address.region).split(" - ")[0]}, {data?.order?.additional_info.billing_address.city}</p>
            <p>Republica Moldova</p>
          </div>
        </div>
    </div>
  )
}
