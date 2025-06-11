'use client'

import { useTRPC } from "@/app/_trpc/client";
import { Link, useRouter } from "@/i18n/navigation";
import { DeliveryHours, getDeliveryAdditionalRate } from "@/lib/enums/DeliveryHours";
import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
import { UpdateOrderValues } from "@/lib/validation/order/updateOrderRequest";
import { CartProducts } from "@/models/order/types/cartProducts";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

export default function OrdersProductsSummary() {
    const trpc = useTRPC();

    const [mounted, setMounted] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { mutate } = useMutation(trpc.order.deleteOrder.mutationOptions({
        onSuccess: async () => {
            router.push("/admin/orders");
            router.refresh();
        }
    }));

    // Get form context
    const form = useFormContext<UpdateOrderValues>();
    const { isDirty } = useFormState({ control: form.control });

    // Watch for changes to these form fields
    const formValues = useWatch({
        control: form.control,
        name: ["additional_info.delivery_address.region", "delivery_details.hours_intervals", "products"]
    });
    
    // Extract values from form
    const deliveryRegion = formValues[0] as DeliveryRegions;
    const deliveryHour = formValues[1] as DeliveryHours;
    const items = formValues[2] as CartProducts[];
    
    // Calculate delivery price and rates
    const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
    const [deliveryHourRate, setDeliveryHourRate] = useState<number | null>(null);
    const [totalCost, setTotalCost] = useState(0);

    // Update delivery price when region changes
    useEffect(() => {
        if (!mounted) return;
            
        setDeliveryPrice(deliveryRegion ? 
            getDeliveryPrice(deliveryRegion) : null);
    }, [deliveryRegion, items, mounted]);

    // Update delivery hour rate when it changes
    useEffect(() => {
        if (!mounted) return;
        setDeliveryHourRate(deliveryHour ? 
            getDeliveryAdditionalRate(deliveryHour) : null);
    }, [deliveryHour, mounted]);

    // Update total cost when any component changes
    useEffect(() => {
        if (!mounted) return;
        
        const subtotal = items.reduce((acc, item) => 
            acc + (item.product.sale?.active ? item.product.sale.sale_price : item.product.price) * 
            (item.quantity || 1), 0);
            
        const deliveryPriceTotal = deliveryPrice ? 
            deliveryPrice + (deliveryHourRate ? deliveryHourRate * deliveryPrice : 0) : 0;
            
        setTotalCost(subtotal + deliveryPriceTotal);
        
        // Update form total_cost field
        form.setValue("total_cost", subtotal + deliveryPriceTotal, { shouldDirty: true });
        
    }, [items, deliveryHourRate, deliveryPrice, mounted, form]);

    // Set mounted state on initial render
    useEffect(() => {
        setMounted(true);
    }, []);

    const t = useTranslations("Admin.AdminOrders")

  return (
    <>
        {
            isDeleteDialogOpen && 
            <div className='fixed top-0 left-0 w-full h-full bg-black/75 z-50 flex justify-center items-center' onMouseDown={() => {setIsDeleteDialogOpen(false)}}>
                <div className='p-8 rounded-3xl bg-white' onMouseDown={(e) => {e.stopPropagation()}}>
                    <p className='text-lg'>{t("delete_question")}</p>
                    <div className='flex gap-6 ml-36 mt-12'>
                        <button className='cursor-pointer h-12' onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(false);}}>
                            <span className='relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all after:duration-300'>{t("cancel")}</span>
                        </button>
                        <button onClick={(e) => {e.preventDefault(); mutate({id: form.getValues("id")})}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>{t("delete")}</button>
                    </div>
                </div>
            </div>
        }
        <div className='col-span-full lg:col-start-9 lg:col-span-4 left-0 flex-1 overflow-auto pb-16 flex flex-col justify-between mt-16 relative'>
            <p className='font-manrope text-2xl font-semibold leading-7 mb-4 lg:mb-6'>{t('summary')}</p>
            {
                items.length > 0 && mounted ?
                    <div data-lenis-prevent className='flex flex-col pr-2 gap-6 flex-1 lg:overflow-y-auto scroll-bar-custom mb-16 lg:mb-8'>
                        {
                            items.map((item, index) => {
                                return (
                                    <div key={index} className='w-full flex gap-2 lg:gap-4'>
                                        <Link href={{pathname: '/catalog/product/[id]', params: {id: item.product.custom_id || item.product._id}}} className='peer'>
                                            <Image unoptimized src={item.product.images?.[0] || '/placeholder.jpg'} alt={item.product.title?.[locale] || 'Product'} width={129} height={164} className='w-32 aspect-[129/164] object-cover rounded-lg peer' />
                                        </Link>
                                        <div className='flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full'>
                                            <div>
                                                <p className='font-manrope text-sm leading-4 w-fit font-semibold mb-4 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>
                                                    {item.product.title?.[locale] || 'Product'}
                                                </p>
                                                <div className={`flex gap-1 items-center`}>
                                                    {
                                                        item.product.sale && item.product.sale.active &&
                                                        <p className='text-gray text-sm lg:text-base leading-4 lg:leading-5 font-semibold line-through'>
                                                            {item.product.price?.toLocaleString() || 0} MDL
                                                        </p>
                                                    }
                                                    <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit py-2 px-4`}>
                                                        {item.product.sale && item.product.sale.active ? 
                                                            item.product.sale.sale_price?.toLocaleString() : 
                                                            item.product.price?.toLocaleString() || 0} MDL
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className='w-30 flex items-center justify-between font-manrope font-semibold py-1 px-4 border border-gray rounded-3xl'>
                                                    <button 
                                                        disabled={item.quantity === 1} 
                                                        className='cursor-pointer disabled:pointer-events-none disabled:text-gray' 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newItems = [...items];
                                                            newItems[index].quantity = Math.max(1, newItems[index].quantity - 1);
                                                            form.setValue("products", newItems.map(item => ({
                                                                product: {
                                                                    ...item.product,
                                                                    title: {
                                                                        ro: item.product.title?.ro || '',
                                                                        ru: item.product.title?.ru || '',
                                                                        en: item.product.title?.en || ''
                                                                    }
                                                                },
                                                                quantity: item.quantity
                                                            })));
                                                        }}
                                                    ><Minus strokeWidth={1.5} className='w-6' /></button>

                                                    <span>{item.quantity}</span>

                                                    <button 
                                                        disabled={item.quantity === item.product.stock_availability.stock} 
                                                        onClick={() => {
                                                            const newItems = [...items];
                                                            newItems[index].quantity = Math.min(newItems[index].product.stock_availability.stock, newItems[index].quantity + 1);
                                                            form.setValue("products", newItems.map(item => ({
                                                                product: {
                                                                    ...item.product,
                                                                    title: {
                                                                        ro: item.product.title?.ro || '',
                                                                        ru: item.product.title?.ru || '',
                                                                        en: item.product.title?.en || ''
                                                                    }
                                                                },
                                                                quantity: item.quantity
                                                            })));
                                                        }} 
                                                        className='cursor-pointer disabled:pointer-events-none disabled:text-gray'
                                                    ><Plus strokeWidth={1.5} className='w-6' /></button>
                                                </div>

                                                
                                                <button 
                                                    className='text-gray cursor-pointer relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300' 
                                                    onClick={() => {
                                                        const newItems = items.filter((_, i) => i !== index);
                                                        form.setValue("products", newItems.map(item => ({
                                                            product: {
                                                                ...item.product,
                                                                title: {
                                                                    ro: item.product.title?.ro || '',
                                                                    ru: item.product.title?.ru || '',
                                                                    en: item.product.title?.en || ''
                                                                }
                                                            },
                                                            quantity: item.quantity
                                                        })));
                                                    }}
                                                >{t("remove")}</button>
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
                    <p className='text-sm leading-4 lg:text-base lg:leading-5 text-center'>
                        {t("empty")}
                    </p>
                </div>
            }
            {
                mounted && items.length > 0 &&
                <>
                    {
                        deliveryPrice !== null &&
                        <>
                            <div className="flex justify-between items-end mb-2">
                                <p>{t("subtotal")}:</p>
                                <p>
                                    {mounted && items.reduce((acc, item) => 
                                        acc + (item.product.sale?.active ? item.product.sale.sale_price : item.product.price) * (item.quantity || 1), 0).toLocaleString()} MDL
                                </p>
                            </div>
                            <div className="flex justify-between items-end mb-2 lg:mb-4">
                                <p>{t("delivery_cost")}:</p>
                                <p>{deliveryPrice.toLocaleString()} MDL</p>
                            </div>
                            {
                                deliveryHourRate !== null && deliveryPrice * deliveryHourRate !== 0 && 
                                <div className="flex justify-between items-end -mt-2 mb-2 lg:mb-4">
                                    <p>{t("hour")}: {deliveryHour}</p>
                                    <p>{(deliveryPrice * deliveryHourRate).toLocaleString()} MDL</p>
                                </div>
                            }
                        </>
                    }
                    <div className="flex justify-between items-end mb-4">
                        <p>{t('total')}:</p>
                        <p className='font-semibold'>{totalCost.toLocaleString()} MDL</p>
                    </div>
                </>
            }

            <div className='flex justify-between gap-6 items-end mt-6 col-span-full'>
                <button onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(true)}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>{t("delete_order")}</button>
                <div className="flex gap-6">
                    <button className='cursor-pointer h-12' onClick={(e) => {e.preventDefault(); form.reset();}}>
                        <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>{t("cancel")}</span>
                    </button>
                    <button form="order-update-form" disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>{t("save")}</button>
                </div>
            </div>
        </div> 
    </>
  )
}