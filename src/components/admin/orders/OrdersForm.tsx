'use client'

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
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod'
import { DeliveryRegions, DeliveryRegionsArr } from '@/lib/enums/DeliveryRegions'
import { useTranslations } from 'next-intl'
import { DeliveryHours, DeliveryHoursArr } from '@/lib/enums/DeliveryHours'
import { useFormContext } from 'react-hook-form'
import { updateOrderRequestSchema, UpdateOrderValues } from '@/lib/validation/order/updateOrderRequest'
import { z } from 'zod'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'

export default function OrdersForm() {
    const t = useTranslations();
    const { isSuccess, isPending, mutate, data: MutatedData} = trpc.order.updateOrder.useMutation();
    const form = useFormContext<UpdateOrderValues>()

    useEffect(() => {
        if (isSuccess) {
            toast.success("Produsul a fost actualizat cu succes!");
            console.log(MutatedData.success, MutatedData.error)
            if (MutatedData) form.reset({
                id: MutatedData.order?._id,
                ...MutatedData.order
            });
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
            // setDeliveryRegion(null);
            // setDeliveryHour(null);
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
        <div data-lenis-prevent className='scroll-bar-custom lg:col-span-6 lg:col-start-2 grid grid-cols-6 gap-x-2 lg:gap-x-6 flex-1 overflow-auto mt-16 pr-6 pb-16'>
                <form id="order-update-form" onSubmit={form.handleSubmit(onSubmit)} className='col-span-full grid grid-cols-6 gap-x-6'>
                    <p className='text-2xl font-semibold leading-7 mb-4 lg:mb-6 col-span-full font-manrope'>Metoda de expediere</p>

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
                                                    <p className='font-semibold'>Livrare domiciliu</p>
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
                                                    <p className='font-semibold'>Ridicare personală</p>
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
                            <p className=' text-2xl font-semibold leading-7 mb-2 lg:mb-6 col-span-full mt-8 lg:mt-12'>Punct de ridicare</p>
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
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer flex h-div12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full max-w-full *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-left  *:data-[slot=select-value]:flex-1">
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
                                                                return (
                                                                    <SelectItem key={index} className="text-base cursor-pointer" value={DeliveryHours[hour as DeliveryHours]}>{t(`delivery_hours.${hour}`)}</SelectItem>
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
                                                    <p className='font-semibold'>Achitare online</p>
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
                                                    <p className='font-semibold'>Achitare în numerar</p>
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