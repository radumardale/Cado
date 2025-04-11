'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { addOrderRequestSchema } from '@/lib/validation/order/addOrderRequest'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeliveryMethod } from '@/models/order/types/deliveryMethod'
import { RadioGroup } from '../ui/radio-group'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { BanknoteIcon, BriefcaseBusiness, CalendarIcon, ChevronDown, Clock, CreditCard, MapPin, Truck, User } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ClientEntity } from '@/models/order/types/orderEntity'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Textarea } from '../ui/textarea'
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod'
import { Link } from '@/i18n/navigation'

export default function CheckoutForm() {
    const [isBillingAddress, setBillingAddress] = useState(true);

    const form = useForm<z.infer<typeof addOrderRequestSchema>>({
        resolver: zodResolver(addOrderRequestSchema),
        defaultValues: {
            delivery_method: DeliveryMethod.HOME_DELIVERY,
            additional_info: {
                delivery_address: {
                    city: "CHISINAU"
                },
                enitity_type: ClientEntity.Natural
            },
            payment_method: OrderPaymentMethod.Paynet
        }
      })      

    function onSubmit(values: z.infer<typeof addOrderRequestSchema>) {
        console.log(values)
    }

    const deliveryMethod = form.watch("delivery_method");
    const entityType = form.watch("additional_info.enitity_type");

  return (
    <div className='lg:col-span-7 2x:col-span-6 lg:col-start-2 2xl:col-start-3 grid grid-cols-6 gap-x-6 h-fit'>
        <Form {...form}>
            <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className='col-span-full grid grid-cols-6 gap-x-6 h-fit'>
                <p className=' text-2xl font-semibold leading-7 mb-6 col-span-full font-manrope'>Metoda de expediere</p>

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
                                    className="flex gap-6 col-span-full"
                                >
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <RadioGroupItem className='' value={DeliveryMethod.HOME_DELIVERY} id="home-delivery" />
                                        </FormControl>
                                        <label 
                                            htmlFor="home-delivery" 
                                            className={`${field.value === DeliveryMethod.HOME_DELIVERY ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                        >
                                            <Truck strokeWidth={1.25} className='size-6' />
                                            <p className=' font-semibold'>Livrare domiciliu</p>
                                        </label>
                                    </FormItem>

                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <RadioGroupItem className='' value={DeliveryMethod.PICKUP} id="pickup" />
                                        </FormControl>
                                        <label 
                                            htmlFor="pickup" 
                                            className={`${field.value === DeliveryMethod.PICKUP ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
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

                <p className=' text-2xl font-semibold leading-7 mb-6 col-span-full mt-12'>Punct de ridicare</p>
                <p className='col-span-full mb-12'>Ridicarea comenzii este posibilă pe <span className='font-semibold'>str. Alecu Russo 15, of. 59, Chișinău,  Luni-Vineri 9:00 - 16:00 </span> </p>

                <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-12 font-manrope'>Informație client</p>
                <p className='col-span-full mb-6'>Adresa trebuie să fie în Republica Moldova.</p>

                {/* Client information */}
                <FormField
                    control={form.control}
                    name="additional_info.user_data.email"
                    render={({ field }) => (
                        <FormItem className="col-span-3 mt-4">
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
                        <FormItem className="col-span-3 mt-4">
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
                        <FormItem className="col-span-3 mt-4">
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
                        <FormItem className="col-span-3 mt-4">
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
                                <FormItem className="col-span-3 mt-4">
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
                                <FormItem className="col-span-3 mt-4">
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
                            <FormItem className="col-span-3 mt-4"> 
                                <FormMessage />
                                    <Select onValueChange={field.onChange} defaultValue={"CHISINAU"} >
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black  w-full">
                                                <SelectValue placeholder="Alege subiectul"/>
                                                <ChevronDown className='size-5' strokeWidth={1.5}/>
                                            </SelectTrigger>
                                        </FormControl>  
                                        <SelectContent className="border-gray">
                                            <SelectGroup>
                                                <SelectItem className="text-base cursor-pointer " value={"CHISINAU"}>Chișinău</SelectItem>
                                                <SelectItem className="text-base cursor-pointer " value={"CAHUL"}>Cahul</SelectItem>
                                                <SelectItem className="text-base cursor-pointer " value={"BALTI"}>Balti</SelectItem>
                                                <SelectItem className="text-base cursor-pointer " value={"ANENII NOI"}>Anenii Noi</SelectItem>
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
                                <FormItem className="col-span-3 mt-4">
                                    <FormMessage />
                                    <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                        <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Oraș*" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                }

                <p className=' text-2xl font-semibold leading-7 mb-6 col-span-full mt-12 font-manrope'>Adresa de facturare</p>
                {
                    deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                    <div className="flex mb-6 col-span-full gap-2">
                        <Checkbox 
                            id='billing_address_check' 
                            checked={isBillingAddress} 
                            onCheckedChange={(checked) => setBillingAddress(checked === true)} 
                        />
                        <label htmlFor='billing_address_check'>Adresa trebuie să fie în Republica Moldova.</label>
                    </div>
                }

                {
                    (deliveryMethod === DeliveryMethod.PICKUP || !isBillingAddress ) && 
                    <>
                        {/* Entity Type Radio Group */}
                        <FormField 
                        control={form.control}
                        name="additional_info.enitity_type"
                        render={({ field }) => (
                            <FormItem className='col-span-full'>
                            <FormMessage />
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-6 col-span-full"
                                >
                                <FormItem className='flex-1'>
                                    <FormControl>
                                    <RadioGroupItem className='' value={ClientEntity.Natural} id="entity-natural" />
                                    </FormControl>
                                    <label 
                                    htmlFor="entity-natural" 
                                    className={`${field.value === ClientEntity.Natural ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                    >
                                    <User strokeWidth={1.25} className='size-6' />
                                    <p className='font-semibold'>Persoană fizică</p>
                                    </label>
                                </FormItem>

                                <FormItem className='flex-1'>
                                    <FormControl>
                                    <RadioGroupItem className='' value={ClientEntity.Legal} id="entity-legal" />
                                    </FormControl>
                                    <label 
                                    htmlFor="entity-legal" 
                                    className={`${field.value === ClientEntity.Legal ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
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
                            <>
                                <FormField
                                    control={form.control}
                                    name="additional_info.billing_address.firstname"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3 mt-4">
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
                                        <FormItem className="col-span-3 mt-4">
                                            <FormMessage />
                                            <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Nume de familie*" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                            :
                            <>
                                <FormField
                                    control={form.control}
                                    name="additional_info.billing_address.company_name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3 mt-4">
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
                                        <FormItem className="col-span-3 mt-4">
                                            <FormMessage />
                                            <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                                <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="IDNO*" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        }

                         <FormField
                            control={form.control}
                            name="additional_info.billing_address.home_address"
                            render={({ field }) => (
                                <FormItem className="col-span-3 mt-4">
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
                                <FormItem className="col-span-3 mt-4">
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
                                <FormItem className="col-span-3 mt-4"> 
                                    <FormMessage />
                                        <Select onValueChange={field.onChange} defaultValue={"CHISINAU"} >
                                            <FormControl>
                                                <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black  w-full">
                                                    <SelectValue placeholder="Alege subiectul"/>
                                                    <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                </SelectTrigger>
                                            </FormControl>  
                                            <SelectContent className="border-gray">
                                                <SelectGroup>
                                                    <SelectItem className="text-base cursor-pointer " value={"CHISINAU"}>Chișinău</SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"CAHUL"}>Cahul</SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"BALTI"}>Balti</SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"ANENII NOI"}>Anenii Noi</SelectItem>
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
                                    <FormItem className="col-span-3 mt-4">
                                        <FormMessage />
                                        <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input className="h-12 w-full px-6 rounded-3xl text-base text-black" placeholder="Oraș*" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </>
                }

                <p className=' text-2xl font-semibold leading-7 mb-2 col-span-full mt-12 font-manrope'>Detalii pentru livrare</p>
                {
                    deliveryMethod === DeliveryMethod.HOME_DELIVERY && 
                    <>
                        <p className='col-span-full mb-6'>Livrările între intervalele orelor 1:00-9:00 și 20:00-24:00 sunt tarifate diferit</p>
                        <FormField
                            control={form.control}
                            name="delivery_details.delivery_date"
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormMessage />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            className={cn(
                                                "w-full h-12 pl-6 text-left font-normal bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black ",
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
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                            }
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
                                <FormItem className="col-span-3"> 
                                    <FormMessage />
                                        <Select onValueChange={field.onChange} >
                                            <FormControl>
                                                <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-base text-black w-full">
                                                    <div className='flex gap-2 items-center'>
                                                        <Clock strokeWidth={1.25} className='size-5'/>
                                                        <SelectValue placeholder="Intervalul orelor de livrare"/>
                                                    </div>
                                                    <ChevronDown className='size-5' strokeWidth={1.5}/>
                                                </SelectTrigger>
                                            </FormControl>  
                                            <SelectContent className="border-gray">
                                                <SelectGroup>
                                                    <SelectItem className="text-base cursor-pointer " value={"01-05"}>01:00 - 05:00</SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"06-09"}>06:00 - 09:00</SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"10-13"}>10:00 - 13:00 </SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"14-19"}>14:00 - 19:00 </SelectItem>
                                                    <SelectItem className="text-base cursor-pointer " value={"20-00"}>20:00 - 00:00</SelectItem>
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
                        <FormItem className="col-span-3 mt-4">
                            <FormControl>
                                <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder="Scrie aici câteva cuvinte pe care le vom imprima pe felicitare" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />      

                <FormField
                    control={form.control}
                    name="delivery_details.comments"
                    render={({ field }) => (
                        <FormItem className="col-span-3 mt-4">
                            <FormControl>
                                <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black col-span-full" placeholder="Comentariu despre comandă" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />      

                <p className='font-semibold col-span-full mt-4'>*Completarea casetelor nu este obligatorie</p>

                <p className=' text-2xl font-semibold leading-7 mb-6 col-span-full mt-12'>Metoda de plată</p>

                {/* Payment Method Radio Group */}
                    <FormField 
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                        <FormItem className='col-span-full'>
                        <FormMessage />
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6 col-span-full"
                            >
                            <FormItem className='flex-1'>
                                <FormControl>
                                <RadioGroupItem className='' value={OrderPaymentMethod.Paynet} id="payment-card" />
                                </FormControl>
                                <label 
                                htmlFor="payment-card" 
                                className={`${field.value === OrderPaymentMethod.Paynet ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 w-full flex gap-2 font-semibold justify-center items-center rounded-3xl border border-black cursor-pointer`}
                                >
                                <CreditCard strokeWidth={1.25} className='size-6' />
                                <p className='font-semibold'>Achitare online</p>
                                </label>
                            </FormItem>

                            <FormItem className='flex-1'>
                                <FormControl>
                                <RadioGroupItem className='' value={OrderPaymentMethod.Cash} id="payment-cash" />
                                </FormControl>
                                <label 
                                htmlFor="payment-cash" 
                                className={`${field.value === OrderPaymentMethod.Cash ? "bg-black text-white" : "bg-white"} transition duration-200 py-3 flex gap-2 justify-center items-center font-semibold rounded-3xl border border-black cursor-pointer`}
                                >
                                <BanknoteIcon strokeWidth={1.25} className='size-6' />
                                <p className='font-semibold'>Achitare în numerar</p>
                                </label>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        </FormItem>
                    )}
                    />

                <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                        <FormItem className="col-span-full mb-24">
                                <div className="flex gap-2 col-span-full mt-12">
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
