'use client';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { DeliveryMethod } from '@/models/order/types/deliveryMethod'
import { RadioGroup } from '@/components/ui/radio-group'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { BanknoteIcon, BriefcaseBusiness, CalendarIcon, ChevronDown, Clock, CreditCard, LoaderCircle, MapPin, Truck, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Fragment, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { ClientEntity } from '@/models/order/types/orderEntity'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, Locale } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod'
import { DeliveryRegions, DeliveryRegionsArr } from '@/lib/enums/DeliveryRegions'
import { useLocale, useTranslations } from 'next-intl'
import { DeliveryHours, DeliveryHoursArr } from '@/lib/enums/DeliveryHours'
import { useFormContext } from 'react-hook-form'
import { updateOrderRequestSchema, UpdateOrderValues } from '@/lib/validation/order/updateOrderRequest'
import { z } from 'zod'
import { useTRPC } from '@/app/_trpc/client'
import { toast } from 'sonner'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enUS, ro, ru } from 'date-fns/locale';
import { orderStateColors } from '@/models/order/types/orderState';

const toastMessages = {
  success: {
    ro: "Comanda a fost actualizată cu succes!",
    ru: "Заказ был успешно обновлён!",
    en: "Order updated successfully!"
  }
};

export default function OrdersForm({orderId}: {orderId: string}) {
    const trpc = useTRPC();
    const queryClient = useQueryClient(); 
    const t = useTranslations();
    const { isSuccess, isPending, mutate, data: MutatedData} = useMutation(trpc.order.updateOrder.mutationOptions());
    const form = useFormContext<UpdateOrderValues>()

    useEffect(() => {
        if (isSuccess) {
            toast.success(toastMessages.success[locale]);

            if (MutatedData) form.reset({
                id: MutatedData.order?._id,
                ...MutatedData.order,
                state: MutatedData.order?.state,
                delivery_details: {
                    ...MutatedData.order?.delivery_details,
                    delivery_date: MutatedData.order?.delivery_details?.delivery_date
                        ? new Date(MutatedData.order.delivery_details.delivery_date).toISOString()
                        : undefined,
                },
            });

            const ordersListQueryKey = trpc.order.getAllOrders.queryKey();
            queryClient.invalidateQueries({queryKey: ordersListQueryKey});
        
            const orderQueryKey = trpc.order.getOrderById.queryKey({id: orderId});
            queryClient.invalidateQueries({queryKey: orderQueryKey});
        }
    }, [isSuccess])

    const deliveryMethod = form.watch("delivery_method");
    const entityType = form.watch("additional_info.entity_type");
    const isBillingAddress = form.watch("additional_info.billing_checkbox");

    useEffect(() => {
        if (deliveryMethod === DeliveryMethod.HOME_DELIVERY) {
            form.setValue("payment_method", OrderPaymentMethod.Paynet);
            form.setValue("additional_info.billing_checkbox", true);
            // setDeliveryRegion(DeliveryRegions.CHISINAU);
        }

        if (deliveryMethod === DeliveryMethod.PICKUP) {
            form.resetField("additional_info.delivery_address.city");
            form.resetField("additional_info.delivery_address.home_address");
            form.resetField("delivery_details.hours_intervals");
            form.setValue("additional_info.billing_checkbox", false);
        }
    }, [deliveryMethod])

    useEffect(() => {
        if (entityType === ClientEntity.Legal) {
            form.resetField("additional_info.billing_address.firstname");
            form.resetField("additional_info.billing_address.lastname");
        }

        if (entityType === ClientEntity.Natural) {
            form.resetField("additional_info.billing_address.company_name");
            form.resetField("additional_info.billing_address.idno");
        }
    }, [entityType])

    function onSubmit(values: z.infer<typeof updateOrderRequestSchema>) {
        mutate(values);
    }

    const locale = useLocale() as 'ro' | 'en' | 'ru';
    let calLocale : Locale;
        switch(locale){
            case 'ro' : calLocale = ro; break;
            case 'en' : calLocale = enUS; break;
            case 'ru' : calLocale = ru; break;
            default : calLocale = enUS; break;
        }

    const checkout_t = useTranslations("CheckoutPage.CheckoutForm");

    return (
      <>
           {
              isPending &&
              <div className='fixed top-0 left-0 w-full h-full bg-pureblack/25 z-10 items-center justify-center'>
                  <div className="flex items-center justify-center h-full w-full">
                      <LoaderCircle className='animate-spin text-white size-20' />
                  </div>
              </div>
          }
          <div className='col-span-7 xl:col-span-6 col-start-1 xl:col-start-2 grid grid-cols-6 gap-x-2 lg:gap-x-6 flex-1 pb-16'>
                  <form id="order-update-form" onSubmit={form.handleSubmit(onSubmit)} className='col-span-full grid grid-cols-6 gap-x-6'>

                        <p className=' text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full mt-8 lg:mt-12 font-manrope'>{t("Admin.AdminOrders.order_status_title")}</p>

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem className="col-span-full lg:col-span-3 mb-8"> 
                                    <FormMessage />
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value || "NOT_PAID"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full" style={{color: orderStateColors[field.value as keyof typeof orderStateColors]}}>
                                                <SelectValue placeholder={t("Admin.AdminOrders.select_status")} />
                                                <ChevronDown className='size-5' strokeWidth={1.5} color='black'/>
                                            </SelectTrigger>
                                        </FormControl>  
                                        <SelectContent className="border-gray">
                                            <SelectGroup>
                                                <SelectItem className="text-base cursor-pointer" style={{color: orderStateColors["TRANSACTION_FAILED"]}}  value="TRANSACTION_FAILED">
                                                    {t("Admin.AdminOrders.order_status.TRANSACTION_FAILED")}
                                                </SelectItem>
                                                <SelectItem className="text-base cursor-pointer" style={{color: orderStateColors["NOT_PAID"]}}  value="NOT_PAID">
                                                    {t("Admin.AdminOrders.order_status.NOT_PAID")}
                                                </SelectItem>
                                                <SelectItem className="text-base cursor-pointer" style={{color: orderStateColors["PAID"]}}  value="PAID">
                                                    {t("Admin.AdminOrders.order_status.PAID")}
                                                </SelectItem>
                                                <SelectItem className="text-base cursor-pointer" style={{color: orderStateColors["DELIVERED"]}}  value="DELIVERED">
                                                    {t("Admin.AdminOrders.order_status.DELIVERED")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                            />

                      <p className='text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full font-manrope'>{checkout_t("method")}</p>

                      {/* Delivery method */}
                      <FormField 
                          control={form.control}
                          name="delivery_method"
                          render={({ field }) => (
                              <FormItem className='col-span-3'>
                                  <FormMessage />
                                  <FormControl>
                                      <RadioGroup
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          className="flex flex-col lg:flex-row gap-2 lg:gap-6 col-span-full"
                                      >
                                          {field.value === DeliveryMethod.HOME_DELIVERY ? (
                                              <FormItem className='w-full lg:flex-1 gap-0'>
                                                  <FormControl>
                                                      <RadioGroupItem value={DeliveryMethod.HOME_DELIVERY} id="home-delivery" />
                                                  </FormControl>
                                                  <label 
                                                      htmlFor="home-delivery" 
                                                      className="bg-black text-white transition duration-300 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer"
                                                  >
                                                      <Truck strokeWidth={1.25} className='size-6' />
                                                      <p className='font-semibold'>{checkout_t("delivery")}</p>
                                                  </label>
                                              </FormItem>
                                          ) : (
                                              <FormItem className='w-full lg:flex-1 gap-0'>
                                                  <FormControl>
                                                      <RadioGroupItem value={DeliveryMethod.PICKUP} id="pickup" />
                                                  </FormControl>
                                                  <label 
                                                      htmlFor="pickup" 
                                                      className="bg-black text-white transition duration-300 py-3 w-full flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer"
                                                  >
                                                      <MapPin strokeWidth={1.25} className='size-6' />
                                                      <p className='font-semibold'>{checkout_t("pickup")}</p>
                                                  </label>
                                              </FormItem>
                                          )}
                                      </RadioGroup>
                                  </FormControl>
                              </FormItem>
                          )}
                      />

                      {
                          deliveryMethod === DeliveryMethod.PICKUP && 
                          <>
                              <p className=' text-2xl font-semibold leading-7 mb-2 lg:mb-6 col-span-full mt-8 lg:mt-12'>{checkout_t("pickup_place")}</p>
                              <p className='col-span-full'>{checkout_t("pickup_info_slice_1")} <span className='font-semibold'>{checkout_t("pickup_info_slice_2")} </span> </p>
                          </>
                      }

                      <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-8 lg:mt-12 font-manrope'>{checkout_t("customer_info")}</p>
                      <p className='col-span-full mb-4 lg:mb-6'>{checkout_t("address_info")}</p>

                      {/* Client information */}
                      <FormField
                          control={form.control}
                          name="additional_info.user_data.email"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 lg:mt-4">
                                  <FormMessage />
                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("email")}*`} {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="additional_info.user_data.tel_number"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                  <FormMessage />
                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("phone")}*`} {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="additional_info.user_data.firstname"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                  <FormMessage />
                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("first_name")}*`} {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="additional_info.user_data.lastname"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                  <FormMessage />
                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("last_name")}*`} {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />

                      {
                          deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                          <>
                              <FormField
                                  control={form.control}
                                  name="additional_info.delivery_address.home_address"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                          <FormMessage />
                                          <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={checkout_t("address")} {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="additional_info.delivery_address.home_nr"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                          <FormMessage />
                                          <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={checkout_t("number")} {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                          <FormField
                              control={form.control}
                              name="additional_info.delivery_address.region"
                              render={({ field }) => (
                                  <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4"> 
                                      <FormMessage />
                                          <Select onValueChange={field.onChange} defaultValue={"CHISINAU"}>
                                              <FormControl>
                                                  <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full max-w-full *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-left">
                                                      <SelectValue placeholder={checkout_t("city")}/>
                                                      <ChevronDown className='min-w-5 size-5' strokeWidth={1.5}/>
                                                  </SelectTrigger>
                                              </FormControl>  
                                              <SelectContent className="border-gray">
                                              <SelectGroup className='max-h-[20rem] overflow-auto z-10' data-lenis-prevent>
                                                  {
                                                      DeliveryRegionsArr.map((region, index) => {
                                                          return (
                                                              <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryRegions[region as DeliveryRegions]}>{t(`CheckoutPage.CheckoutForm.delivery_regions.${region}`)}</SelectItem>
                                                          )
                                                      })
                                                  }
                                              </SelectGroup>
                                              </SelectContent>
                                          </Select>
                                  </FormItem>
                              )}
                          />
                              <FormField
                                  control={form.control}
                                  name="additional_info.delivery_address.city"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                          <FormMessage />
                                          <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("city")}*`} {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                          </>
                      }

                      <p className=' text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full mt-8 lg:mt-12 font-manrope'>{checkout_t("billing_address")}</p>
                      {
                          deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                          <div className="flex mb-6 col-span-full gap-2">
                              <Checkbox 
                                  id='billing_address_check' 
                                  checked={isBillingAddress} 
                                  onCheckedChange={(checked) => form.setValue("additional_info.billing_checkbox", checked === true)} 
                              />
                              <label htmlFor='billing_address_check'>{checkout_t("billing_address_checkbox")}</label>
                          </div>
                      }

                      {
                          (!isBillingAddress ) && 
                          <>
                              {/* Entity Type Radio Group */}
                              <FormField 
                              control={form.control}
                              name="additional_info.entity_type"
                              render={({ field }) => (
                                  <FormItem className='col-span-full'>
                                  <FormMessage />
                                  <FormControl>
                                      <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col lg:flex-row gap-2 lg:gap-6 col-span-full"
                                      >
                                      <FormItem className='gap-0 lg:flex-1'>
                                          <FormControl>
                                              <RadioGroupItem className='' value={ClientEntity.Natural} id="entity-natural" />
                                          </FormControl>
                                          <label 
                                          htmlFor="entity-natural" 
                                          className={`${field.value === ClientEntity.Natural ? "bg-black text-white" : "bg-white"} transition duration-300 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                          >
                                          <User strokeWidth={1.25} className='size-6' />
                                          <p className='font-semibold'>{checkout_t("individual")}</p>
                                          </label>
                                      </FormItem>

                                      <FormItem className='gap-0 lg:flex-1'>
                                          <FormControl>
                                              <RadioGroupItem className='' value={ClientEntity.Legal} id="entity-legal" />
                                          </FormControl>
                                          <label 
                                          htmlFor="entity-legal" 
                                          className={`${field.value === ClientEntity.Legal ? "bg-black text-white" : "bg-white"} transition duration-300 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
                                          >
                                          <BriefcaseBusiness strokeWidth={1.25} className='size-6' />
                                          <p className='font-semibold'>{checkout_t("company")}</p>
                                          </label>
                                      </FormItem>
                                      </RadioGroup>
                                  </FormControl>
                                  </FormItem>
                              )}
                              />

                              {
                                  entityType === ClientEntity.Natural ? 
                                  <Fragment key="natural-fields">
                                      <FormField
                                          control={form.control}
                                          name="additional_info.billing_address.firstname"
                                          render={({ field }) => (
                                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                                  <FormMessage />
                                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("first_name")}*`} {...field} />
                                                  </FormControl>
                                              </FormItem>
                                          )}
                                      />
                                      <FormField
                                          control={form.control}
                                          name="additional_info.billing_address.lastname"
                                          render={({ field }) => (
                                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                                  <FormMessage />
                                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("last_name")}*`} {...field} />
                                                  </FormControl>
                                              </FormItem>
                                          )}
                                      />
                                  </Fragment>
                                  :
                                  <Fragment key="legal-fields">
                                      <FormField
                                          control={form.control}
                                          name="additional_info.billing_address.company_name"
                                          render={({ field }) => (
                                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                                  <FormMessage />
                                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("company_name")}*`} {...field} />
                                                  </FormControl>
                                              </FormItem>
                                          )}
                                      />
                                      <FormField
                                          control={form.control}
                                          name="additional_info.billing_address.idno"
                                          render={({ field }) => (
                                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                                  <FormMessage />
                                                  <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                      <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("company_id")}*`} {...field} />
                                                  </FormControl>
                                              </FormItem>
                                          )}
                                      />
                                  </Fragment>
                              }

                              <FormField
                                  control={form.control}
                                  name="additional_info.billing_address.home_address"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                          <FormMessage />
                                          <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={checkout_t("address")} {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="additional_info.billing_address.home_nr"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                          <FormMessage />
                                          <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={checkout_t("number")} {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />

                              <FormField
                                  control={form.control}
                                  name="additional_info.billing_address.region"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4"> 
                                          <FormMessage />
                                              <Select onValueChange={field.onChange} defaultValue={"CHISINAU"} >
                                                  <FormControl>
                                                      <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full">
                                                          <SelectValue placeholder={checkout_t("city")}/>
                                                          <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                      </SelectTrigger>
                                                  </FormControl>  
                                                  <SelectContent className="border-gray">
                                                      <SelectGroup className='max-h-[20rem] overflow-auto z-10' data-lenis-prevent>
                                                          {
                                                              DeliveryRegionsArr.map((region, index) => {
                                                                  return (
                                                                      <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryRegions[region as DeliveryRegions]}>{t(`CheckoutPage.CheckoutForm.delivery_regions.${region}`).split(" - ")[0]}</SelectItem>
                                                                  )
                                                              })
                                                          }
                                                      </SelectGroup>
                                                  </SelectContent>
                                              </Select>
                                      </FormItem>
                                  )}
                              />
                                  <FormField
                                      control={form.control}
                                      name="additional_info.billing_address.city"
                                      render={({ field }) => (
                                          <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                              <FormMessage />
                                              <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder={`${checkout_t("city")}*`} {...field} />
                                              </FormControl>
                                          </FormItem>
                                      )}
                                  />
                              </>
                      }

                      <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-8 lg:mt-12 font-manrope'>{checkout_t("delivery_details")}</p>
                      {
                          deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                          <>
                              <p className='col-span-full mb-4 lg:mb-6'>{checkout_t("delivery_info")}</p>
                              <FormField
                                  control={form.control}
                                  name="delivery_details.delivery_date"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3">
                                          <FormMessage />
                                          <Popover>
                                              <PopoverTrigger asChild>
                                              <FormControl>
                                                  <Button
                                                  className={cn(
                                                      "w-full h-12 pl-6 text-left font-normal bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black justify-start",
                                                      !field.value && "text-black"
                                                  )}
                                                  >
                                                  <CalendarIcon className="size-5" strokeWidth={1.25} />
                                                  {field.value ? (
                                                      format(field.value, "PPP")
                                                  ) : (
                                                      <span className='mr-auto leading-0'>{checkout_t("date")}</span>
                                                  )}
                                                  </Button>
                                              </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                              <Calendar
                                                  locale = {calLocale}
                                                  mode="single"
                                                  selected={field.value ? new Date(field.value) : new Date()}
                                                  onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                                                  disabled={(date) =>
                                                      date < new Date()
                                                  }
                                                  weekStartsOn={1}
                                                  initialFocus
                                              />
                                              </PopoverContent>
                                          </Popover>
                                      </FormItem>
                                  )}
                              />
              
                              <FormField
                                  control={form.control}
                                  name="delivery_details.hours_intervals"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-0"> 
                                          <FormMessage />
                                              <Select onValueChange={field.onChange} value={field.value}>
                                                  <FormControl>
                                                      <SelectTrigger className="cursor-pointer flex h-div12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full max-w-full *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-left  *:data-[slot=select-value]:flex-1">
                                                          <div>
                                                              <Clock strokeWidth={1.25} className='size-5'/>
                                                          </div>
                                                          <SelectValue placeholder={checkout_t("time")}/>
                                                          <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                      </SelectTrigger>
                                                  </FormControl>  
                                                  <SelectContent className="border-gray">
                                                      <SelectGroup>
                                                          {
                                                              DeliveryHoursArr.map((hour, index) => {
                                                                  return (
                                                                      <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryHours[hour as DeliveryHours]}>{t(`CheckoutPage.CheckoutForm.delivery_hours.${hour}`)}</SelectItem>
                                                                  )
                                                              })
                                                          }
                                                      </SelectGroup>
                                                  </SelectContent>
                                              </Select>
                                      </FormItem>
                                  )}
                              />  
                          </>
                      }


                      <FormField
                          control={form.control}
                          name="delivery_details.message"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                  <FormControl>
                                      <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder={checkout_t("print")} {...field}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />      

                      <FormField
                          control={form.control}
                          name="delivery_details.comments"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                  <FormControl>
                                      <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder={checkout_t("comment")} {...field}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />      

                      <p className='font-semibold col-span-full mt-2 lg:mt-4'>*{checkout_t("not_req")}</p>

                      <p className=' text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full mt-8 lg:mt-12'>{checkout_t("payment_method")}</p>

                      {/* Payment Method Radio Group */}
                          <FormField 
                          control={form.control}
                          name="payment_method"
                          render={({ field }) => (
                              <FormItem className='col-span-3'>
                                  <FormControl>
                                      <RadioGroup
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          className="flex gap-2 lg:gap-6 col-span-full flex-col lg:flex-row"
                                      >
                                          {field.value === OrderPaymentMethod.Paynet ? (
                                              <FormItem className='gap-0 lg:flex-1'>
                                                  <FormControl>
                                                      <RadioGroupItem value={OrderPaymentMethod.Paynet} id="payment-card" />
                                                  </FormControl>
                                                  <label 
                                                      htmlFor="payment-card" 
                                                      className="bg-black text-white transition duration-300 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer"
                                                  >
                                                      <CreditCard strokeWidth={1.25} className='size-6' />
                                                      <p className='font-semibold'>{checkout_t("online")}</p>
                                                  </label>
                                              </FormItem>
                                          ) : (
                                              <FormItem className='gap-0 lg:flex-1'>
                                                  <FormControl>
                                                      <RadioGroupItem
                                                          disabled={deliveryMethod === DeliveryMethod.HOME_DELIVERY} 
                                                          value={OrderPaymentMethod.Cash} id="payment-cash" />
                                                  </FormControl>
                                                  <label 
                                                      htmlFor="payment-cash" 
                                                      className="bg-black text-white transition duration-300 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer"
                                                  >
                                                      <BanknoteIcon strokeWidth={1.25} className='size-6' />
                                                      <p className='font-semibold'>{checkout_t("cash")}</p>
                                                  </label>
                                              </FormItem>
                                          )}
                                      </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                          />
                  </form>
          </div>
      </>
    )
}