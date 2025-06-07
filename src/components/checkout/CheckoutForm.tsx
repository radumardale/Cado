'use client';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { addOrderRequestSchema } from '@/lib/validation/order/addOrderRequest'
import { z } from 'zod'
import { DeliveryMethod } from '@/models/order/types/deliveryMethod'
import { RadioGroup } from '../ui/radio-group'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { BanknoteIcon, BriefcaseBusiness, CalendarIcon, ChevronDown, Clock, CreditCard, MapPin, Truck, User } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Fragment, useEffect } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ClientEntity } from '@/models/order/types/orderEntity'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Textarea } from '../ui/textarea'
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod'
import { Link, useRouter } from '@/i18n/navigation'
import { CartInterface } from '@/lib/types/CartInterface'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeliveryRegions, DeliveryRegionsArr } from '@/lib/enums/DeliveryRegions'
import { useTranslations } from 'next-intl'
import { DeliveryHours, DeliveryHoursArr } from '@/lib/enums/DeliveryHours'
import { useTRPC } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { ProductInterface } from '@/models/product/types/productInterface'

import { useMutation } from "@tanstack/react-query";
import { revalidateServerPath } from '@/server/actions/revalidateServerPath';

interface CheckoutFormProps {
    items: CartInterface[],
    setDeliveryRegion: (v: DeliveryRegions | null) => void,
    setDeliveryHour: (v: DeliveryHours | null) => void,
    totalCost: number,
    products: ProductInterface[]
}

const determineAvailableDeliveryHours = (hour: number): DeliveryHours[] => {
    const thresholds = [5, 9, 13, 19, 24];
    const sliceIndex = thresholds.findIndex(threshold => hour < threshold);
    
    return sliceIndex === -1 
        ? [] 
        : DeliveryHoursArr.slice(sliceIndex) as DeliveryHours[];
}

export default function CheckoutForm({items, setDeliveryRegion, setDeliveryHour, totalCost, products}: CheckoutFormProps) {
    const trpc = useTRPC();
    const t = useTranslations();
    const router = useRouter();

    const { mutate } = useMutation(trpc.order.addOrder.mutationOptions({
        onSuccess: async (data) => {
            if (!data.success) {
                toast.error("Comanda nu a putut fi efectuata!");
                return;
            }

            revalidateServerPath('/[locale]/catalog/product/[id]', 'page');
            revalidateServerPath("/ro/catalog");
            revalidateServerPath("/ru/catalog");
            revalidateServerPath("/en/catalog");

            if (data.paymentForm) {
              // Create and auto-submit a form
              const form = document.createElement('form');
              form.method = data.paymentForm.method;
              form.action = data.paymentForm.action;
        
              Object.entries(data.paymentForm.fields).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
              });
        
              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }

            if (data.order) {
                toast.success("Comanda a fost plasată cu succes!");
                router.push({pathname: "/confirmation/[id]", params: {id: data?.order?.custom_id || ""}})
            }
          }
    }));

    const form = useForm<z.infer<typeof addOrderRequestSchema>>({
        resolver: zodResolver(addOrderRequestSchema),
        defaultValues: {
            products: [],
            delivery_method: DeliveryMethod.HOME_DELIVERY,
            additional_info: {
                delivery_address: {
                    region: "CHISINAU",
                    city: "",
                    home_address: "",
                    home_nr: ""
                },
                entity_type: ClientEntity.Natural,
                user_data: {
                    email: "",
                    tel_number: "",
                    firstname: "",
                    lastname: ""
                },
                billing_address: {
                    company_name: "",
                    firstname: "",
                    idno: "",
                    lastname: "",
                    home_address: "",
                    home_nr: "",
                    region: "CHISINAU",
                    city: "",
                },
                billing_checkbox: true,
            },
            payment_method: OrderPaymentMethod.Paynet,
            termsAccepted: false
        }
    });
    function onSubmit(values: z.infer<typeof addOrderRequestSchema>) {
        mutate(values);
    }

    useEffect(() => {
        const updatedProducts = products.map(product => {
            const cartItem = items.find(item => item.productId === product.custom_id);
            return {
                product: {
                    ...product,
                    title: {
                        ro: product.title?.ro || '',
                        ru: product.title?.ru || '',
                        en: product.title?.en || ''
                    }
                },
                quantity: cartItem?.quantity || 1
            };
        });
        form.setValue("products", updatedProducts || []);
    }, [products, items, form]);

    const deliveryMethod = form.watch("delivery_method");
    const entityType = form.watch("additional_info.entity_type");
    const deliveryRegion = form.watch("additional_info.delivery_address.region");
    const deliveryHour = form.watch("delivery_details.hours_intervals");
    const deliveryDate = form.watch("delivery_details.delivery_date");
    const isBillingAddress = form.watch("additional_info.billing_checkbox");

    useEffect(() => {
        form.setValue("total_cost", totalCost);
    }, [totalCost])

    useEffect(() => {
        setDeliveryRegion(deliveryRegion ? deliveryRegion as DeliveryRegions : DeliveryRegions.CHISINAU);
    }, [deliveryRegion])

    useEffect(() => {
        setDeliveryHour(deliveryHour ? deliveryHour as DeliveryHours : null);
    }, [deliveryHour])

    useEffect(() => {
        if (deliveryMethod === DeliveryMethod.HOME_DELIVERY) {
            form.setValue("payment_method", OrderPaymentMethod.Paynet);
            form.setValue("additional_info.billing_checkbox", true);
            setDeliveryRegion(DeliveryRegions.CHISINAU);
        }

        if (deliveryMethod === DeliveryMethod.PICKUP) {
            form.resetField("additional_info.delivery_address.city");
            form.resetField("additional_info.delivery_address.home_address");
            form.resetField("delivery_details.hours_intervals");
            form.setValue("additional_info.billing_checkbox", false);
            setDeliveryRegion(null);
            setDeliveryHour(null);
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

    return (
      <div className='col-span-full lg:col-span-7 2xl:col-span-6 lg:col-start-2 2xl:col-start-3 grid grid-cols-8 lg:grid-cols-6 gap-x-2 lg:gap-x-6 h-fit'>
          <Form {...form}>
              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className='col-span-full grid grid-cols-6 gap-x-6 h-fit'>
                  <p className='text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full font-manrope'>Metoda de expediere</p>

                  {/* Delivery method */}
                  <FormField 
                      control={form.control}
                      name="delivery_method"
                      render={({ field }) => (
                          <FormItem className='col-span-full'>
                              <FormMessage />
                              <FormControl>
                                  <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col lg:flex-row gap-2 lg:gap-6 col-span-full"
                                  >
                                      <FormItem className='w-full lg:w-auto lg:flex-1 gap-0'>
                                          <FormControl>
                                              <RadioGroupItem className='' value={DeliveryMethod.HOME_DELIVERY} id="home-delivery" />
                                          </FormControl>
                                          <label 
                                              htmlFor="home-delivery" 
                                              className={`${field.value === DeliveryMethod.HOME_DELIVERY ? "bg-black text-white" : "bg-white"} transition duration-300 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                          >
                                              <Truck strokeWidth={1.25} className='size-6' />
                                              <p className=' font-semibold'>Livrare domiciliu</p>
                                          </label>
                                      </FormItem>

                                      <FormItem className='w-full lg:w-auto lg:flex-1 gap-0'>
                                          <FormControl>
                                              <RadioGroupItem className='' value={DeliveryMethod.PICKUP} id="pickup" />
                                          </FormControl>
                                          <label 
                                              htmlFor="pickup" 
                                              className={`${field.value === DeliveryMethod.PICKUP ? "bg-black text-white" : "bg-white"} transition duration-300 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
                                          >
                                              <MapPin strokeWidth={1.25} className='size-6' />
                                              <p className=' font-semibold'>Ridicare personală</p>
                                          </label>
                                      </FormItem>

                                  </RadioGroup>
                              </FormControl>
                          </FormItem>
                      )}
                  />

                  {
                      deliveryMethod === DeliveryMethod.PICKUP && 
                      <>
                          <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-8 lg:mt-12'>Punct de ridicare</p>
                          <p className='col-span-full'>Ridicarea comenzii este posibilă pe <span className='font-semibold'>str. Alecu Russo 15, of. 59, Chișinău,  Luni-Vineri 9:00 - 16:00 </span> </p>
                      </>
                  }

                  <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-8 lg:mt-12 font-manrope'>Informație client</p>
                  <p className='col-span-full mb-4 lg:mb-6'>Adresa trebuie să fie în Republica Moldova.</p>

                  {/* Client information */}
                  <FormField
                      control={form.control}
                      name="additional_info.user_data.email"
                      render={({ field }) => (
                          <FormItem className="col-span-full lg:col-span-3 lg:mt-4">
                              <FormMessage />
                              <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Email*" {...field} />
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
                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Telefon*" {...field} />
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
                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Prenume*" {...field} />
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
                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Nume de familie*" {...field} />
                              </FormControl>
                          </FormItem>
                      )}
                  />

                  {
                      deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                      <>
                         <FormField
                          control={form.control}
                          name="additional_info.delivery_address.region"
                          render={({ field }) => (
                              <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4"> 
                                  <FormMessage />
                                      <Select onValueChange={field.onChange} defaultValue={"CHISINAU"}>
                                          <FormControl>
                                              <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full max-w-full *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-left">
                                                  <SelectValue placeholder="Alege subiectul"/>
                                                  <ChevronDown className='min-w-5 size-5' strokeWidth={1.5}/>
                                              </SelectTrigger>
                                          </FormControl>  
                                          <SelectContent className="border-gray">
                                          <SelectGroup className='max-h-[20rem] overflow-auto z-10' data-lenis-prevent>
                                              {
                                                  DeliveryRegionsArr.map((region, index) => {
                                                      return (
                                                          <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryRegions[region as DeliveryRegions]}>{t(`delivery_regions.${region}`)}</SelectItem>
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
                                          <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Oraș*" {...field} />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="additional_info.delivery_address.home_address"
                              render={({ field }) => (
                                  <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                      <FormMessage />
                                      <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                          <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Adresa* (stradă, număr, etc.)" {...field} />
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
                                          <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Număr casă/apartament" {...field} />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                      </>
                  }

                  <p className=' text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full mt-8 lg:mt-12 font-manrope'>Adresa de facturare</p>
                  {
                      deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                      <div className="flex mb-6 col-span-full gap-2">
                          <Checkbox 
                              id='billing_address_check' 
                              checked={isBillingAddress} 
                              onCheckedChange={(checked) => form.setValue("additional_info.billing_checkbox", checked === true)} 
                          />
                          <label htmlFor='billing_address_check'>Folosește aceleași date cu cele de la adresa de livrare.</label>
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
                                      <p className='font-semibold'>Persoană fizică</p>
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
                                      <p className='font-semibold'>Persoană juridică</p>
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
                                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Prenume*" {...field} />
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
                                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Nume de familie*" {...field} />
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
                                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Nume companie*" {...field} />
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
                                                  <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="IDNO*" {...field} />
                                              </FormControl>
                                          </FormItem>
                                      )}
                                  />
                              </Fragment>
                          }
                          <FormField
                              control={form.control}
                              name="additional_info.billing_address.region"
                              render={({ field }) => (
                                  <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4"> 
                                      <FormMessage />
                                          <Select onValueChange={field.onChange} defaultValue={"CHISINAU"} >
                                              <FormControl>
                                                  <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full">
                                                      <SelectValue placeholder="Alege subiectul"/>
                                                      <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                  </SelectTrigger>
                                              </FormControl>  
                                              <SelectContent className="border-gray">
                                                  <SelectGroup className='max-h-[20rem] overflow-auto z-10' data-lenis-prevent>
                                                      {
                                                          DeliveryRegionsArr.map((region, index) => {
                                                              return (
                                                                  <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryRegions[region as DeliveryRegions]}>{t(`delivery_regions.${region}`).split(" - ")[0]}</SelectItem>
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
                                              <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Oraș*" {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                           <FormField
                              control={form.control}
                              name="additional_info.billing_address.home_address"
                              render={({ field }) => (
                                  <FormItem className="col-span-full lg:col-span-3 mt-2 lg:mt-4">
                                      <FormMessage />
                                      <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                          <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Adresa* (stradă, număr, etc.)" {...field} />
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
                                          <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Număr casă/apartament" {...field} />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                          </>
                  }

                  <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-8 lg:mt-12 font-manrope'>Detalii pentru livrare</p>
                  {
                      deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                      <>
                          <p className='col-span-full mb-4 lg:mb-6'>Livrările între intervalele orelor 1:00-9:00 și 20:00-24:00 sunt tarifate diferit</p>
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
                                                  <span className='mr-auto leading-0'>Data de livrare</span>
                                              )}
                                              </Button>
                                          </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
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
                                          <Select onValueChange={field.onChange} >
                                              <FormControl>
                                                  <SelectTrigger className="cursor-pointer flex h-div12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full max-w-full *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:mr-auto">
                                                      <div>
                                                          <Clock strokeWidth={1.25} className='size-5'/>
                                                      </div>
                                                      <SelectValue placeholder="Intervalul orelor de livrare"/>
                                                      <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                  </SelectTrigger>
                                              </FormControl>  
                                              <SelectContent className="border-gray">
                                                  <SelectGroup>
                                                      {
                                                          DeliveryHoursArr.map((hour, index) => {
                                                                const currDate = new Date();
                                                                const isHourDisabled = deliveryDate ? new Date(deliveryDate).getDate() - currDate.getDate() <= 1 ? !determineAvailableDeliveryHours(currDate.getHours()).includes(hour as DeliveryHours) : false : false;
                                                              return (
                                                                  <SelectItem disabled={isHourDisabled} key={index} className="text-base cursor-pointer" value={DeliveryHours[hour as DeliveryHours]}>{t(`delivery_hours.${hour}`)}</SelectItem>
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
                                  <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder="Lăsați aici câteva cuvinte pe care le vom imprima pe felicitare" {...field}/>
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
                                  <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder="Comentariu despre comandă" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />      

                  <p className='font-semibold col-span-full mt-2 lg:mt-4'>*Completarea casetelor nu este obligatorie</p>

                  <p className=' text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full mt-8 lg:mt-12'>Metoda de plată</p>

                  {/* Payment Method Radio Group */}
                      <FormField 
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                          <FormItem className='col-span-full'>
                              <FormControl>
                                  <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex gap-2 lg:gap-6 col-span-full flex-col lg:flex-row"
                                  >
                                  <FormItem className='gap-0 lg:flex-1'>
                                      <FormControl>
                                      <RadioGroupItem className='' value={OrderPaymentMethod.Paynet} id="payment-card" />
                                      </FormControl>
                                      <label 
                                      htmlFor="payment-card" 
                                      className={`${field.value === OrderPaymentMethod.Paynet ? "bg-black text-white" : "bg-white"} transition duration-300 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                      >
                                      <CreditCard strokeWidth={1.25} className='size-6' />
                                      <p className='font-semibold'>Achitare online</p>
                                      </label>
                                  </FormItem>

                                  <FormItem className='gap-0 lg:flex-1'>
                                      <FormControl>
                                      <RadioGroupItem
                                      disabled={deliveryMethod === DeliveryMethod.HOME_DELIVERY} 
                                      className='peer' value={OrderPaymentMethod.Cash} id="payment-cash" />
                                      </FormControl>
                                      <label 
                                      htmlFor="payment-cash" 
                                      className={`${field.value === OrderPaymentMethod.Cash ? "bg-black text-white" : "bg-white"} peer-disabled:cursor-default peer-disabled:opacity-25 transition duration-300 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
                                      >
                                      <BanknoteIcon strokeWidth={1.25} className='size-6' />
                                      <p className='font-semibold'>Achitare în numerar</p>
                                      </label>
                                  </FormItem>
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
                  <p className='font-semibold col-span-full mt-2 lg:mt-4'>*Achitarea numerar este posibilă doar la ridicare personală</p>

                  <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                          <FormItem className="col-span-full mb-24">
                                  <div className="flex gap-2 col-span-full mt-8 lg:mt-12">
                                          <FormControl>
                                              <Checkbox 
                                                  id="termeni" 
                                                  className="border-gray size-4 cursor-pointer"
                                                  checked={field.value}
                                                  onCheckedChange={(checked) => {
                                                      field.onChange(checked)
                                                  }}
                                              />
                                          </FormControl>
                                          <div className={`${form.formState.errors.termsAccepted ? 'text-destructive' : ''}`}>
                                              Am citit și sunt de acord cu condițiile de <Link href="/terms" className="underline">livrare/achitare</Link> și condițiile de <Link href="/terms" className="underline">returnare/anulare</Link>
                                          </div>
                                  </div>
                          </FormItem>
                      )}
                  />  
              </form>
          </Form>

      </div>
    )
}