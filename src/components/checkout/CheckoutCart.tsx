'use client'

import { Link } from "@/i18n/navigation";
import { DeliveryHours, getDeliveryAdditionalRate } from "@/lib/enums/DeliveryHours";
import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
import { CartInterface } from "@/lib/types/CartInterface";
import { ProductInterface } from "@/models/product/types/productInterface";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CheckoutCartProps {
    items: CartInterface[],
    setValue: Dispatch<SetStateAction<CartInterface[]>>,
    deliveryRegion: DeliveryRegions | null,
    deliveryHour: DeliveryHours | null,
    setTotalCost: (v: number) => void,
    products: ProductInterface[]
}

export default function CheckoutCart({items, setValue, deliveryRegion, deliveryHour, setTotalCost, products}: CheckoutCartProps) {
    const [mounted, setMounted] = useState(false);
    const [deliveryPrice, setDeliveryPrice] = useState(deliveryRegion ? getDeliveryPrice(deliveryRegion) : null)
    const [deliveryHourRate, setDeliveryHourRate] = useState(deliveryHour ? getDeliveryAdditionalRate(deliveryHour) : null);
    const locale = useLocale();

    useEffect(() => {
        setDeliveryPrice(deliveryRegion ? getDeliveryPrice(deliveryRegion) : null);
    }, [deliveryRegion])

    useEffect(() => {
        setDeliveryHourRate(deliveryHour ? getDeliveryAdditionalRate(deliveryHour) : null);
    }, [deliveryHour])

    useEffect(() => {
        if (products.length > 0) setTotalCost(items.reduce((acc, item, index) => acc + (products[index].sale.active ? products[index].sale.sale_price : products[index].price) * item.quantity, 0) + (deliveryPrice ? deliveryPrice + (deliveryHourRate ? deliveryHourRate * deliveryPrice : 0) : 0));
    }, [items, deliveryHourRate, deliveryPrice, products])

    useEffect(() => {
        setMounted(true);
    }, [])

  return (
    <div className='col-span-full lg:col-start-10 2xl:col-start-10 lg:col-span-5 2xl:col-span-4 lg:sticky left-0 lg:h-screen -mb-7 pb-16 lg:pb-31 top-25 flex flex-col justify-between'>
        <p className='font-manrope text-2xl font-semibold leading-7 mb-4 lg:mb-6'>Sumarul comenzii</p>
        {
            items.length > 0 && mounted && products.length > 0 ?
                <div data-lenis-prevent className='flex flex-col pr-2 gap-6 flex-1 lg:overflow-y-auto scroll-bar-custom mb-16 lg:mb-8'>
                    {
                        items.map((item, index) => {
                            const product = products.find((product: ProductInterface) => product.custom_id === item.productId) || undefined;
                            if (!product) return;

                            return (
                                <div key={index} className='w-full flex gap-2 lg:gap-4'>
                                    <Link href={{pathname: '/catalog/product/[id]', params: {id: product.custom_id}}} className='peer'>
                                        <Image unoptimized src={product.images[0]} alt={product.title[locale]} width={129} height={164} className='w-32 aspect-[129/164] object-cover rounded-lg peer' />
                                    </Link>
                                    <div className='flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full'>
                                        <div>
                                            <p className='font-manrope text-sm leading-4 w-fit font-semibold mb-4 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>{product.title[locale]}</p>
                                            <div className={`flex gap-1 items-center`}>
                                                {
                                                    product.sale && product.sale.active &&
                                                    <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                                                }
                                                <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit py-2 px-4`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className='w-30 flex items-center justify-between font-manrope font-semibold py-1 px-4 border border-gray rounded-3xl'>
                                                <button 
                                                    disabled={item.quantity === 1} 
                                                    className='cursor-pointer disabled:pointer-events-none disabled:text-gray' 
                                                    onClick={() => {
                                                        const newItems = [...items];
                                                        newItems[index].quantity = Math.max(1, newItems[index].quantity - 1);
                                                        setValue(newItems);
                                                    }}
                                                ><Minus strokeWidth={1.5} className='w-6' /></button>

                                                <span>{item.quantity}</span>

                                                <button 
                                                    disabled={item.quantity === product.stock_availability.stock} 
                                                    onClick={() => {
                                                        const newItems = [...items];
                                                        newItems[index].quantity = Math.min(product.stock_availability.stock, newItems[index].quantity + 1);
                                                        setValue(newItems);
                                                    }} 
                                                    className='cursor-pointer disabled:pointer-events-none disabled:text-gray'
                                                ><Plus strokeWidth={1.5} className='w-6' /></button>
                                            </div>

                                            
                                            <button 
                                                className='text-gray cursor-pointer relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300' 
                                                onClick={() => {
                                                    const newItems = items.filter((_, i) => i !== index);
                                                    setValue(newItems);
                                                }}
                                            >Elimină</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) 
                    }
                </div>
            :
            <div className='lg:absolute left-0 top-1/2 lg:-translate-y-1/2 w-full px-4 lg:px-16 my-16 lg:my-0'>
                <ShoppingBag className='size-12 mx-auto mb-2' strokeWidth={1.25}/>
                <p className='text-sm leading-4 lg:text-base lg:leading-5 text-center'>Coșul dvs. este gol. Vizitați magazinul pentru inspirație și recomandări personalizate.</p>
            </div>
        }
        {
            mounted && items.length > 0 && products.length > 0 &&
            <>
                {
                    deliveryPrice !== null &&
                    <>
                        <div className="flex justify-between items-end mb-2">
                            <p>Subtotal:</p>
                            <p>{mounted && items.reduce((acc, item, index) => acc + (products[index].sale.active ? products[index].sale.sale_price : products[index].price) * item.quantity, 0).toLocaleString()} MDL</p>
                        </div>
                        <div className="flex justify-between items-end mb-2 lg:mb-4">
                            <p>Livrare:</p>
                            <p>{deliveryPrice.toLocaleString()} MDL</p>
                        </div>
                        {
                            deliveryHourRate !== null && deliveryPrice * deliveryHourRate !== 0 && 
                            <div className="flex justify-between items-end -mt-2 mb-2 lg:mb-4">
                                <p>Ora livrării: {deliveryHour}</p>
                                <p>{(deliveryPrice * deliveryHourRate).toLocaleString()} MDL</p>
                            </div>
                        }
                    </>
                }
                <div className="flex justify-between items-end mb-4">
                    <p>Total:</p>
                    <p className='font-semibold'>{mounted && (items.reduce((acc, item, index) => acc + (products[index].sale.active ? products[index].sale.sale_price : products[index].price) * item.quantity, 0) + (deliveryPrice ? deliveryPrice + (deliveryHourRate ? deliveryHourRate * deliveryPrice : 0) : 0)).toLocaleString()} MDL</p>
                </div>
            </>
        }

        <button className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border hover:opacity-75 transition duration-300' form="checkout-form">Continuă plata</button>
    </div>
  )
}
