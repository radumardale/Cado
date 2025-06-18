"use client"
 
import { sendMessageRequest } from "@/lib/validation/contacts/sendMessageRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ChevronDown } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Link } from "@/i18n/navigation"
import { toast } from "@/components/ui/contactToast";
import { useTranslations } from "next-intl"

export default function ContactForm() {

    const t = useTranslations("ContactPage.ContactForm")

    const form = useForm<z.infer<typeof sendMessageRequest>>({
        resolver: zodResolver(sendMessageRequest),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            contact_method: ["EMAIL"],
            tel_number: "",
            termsAccepted: false,
        },
      })

    function onSubmit(values: z.infer<typeof sendMessageRequest>) {
        console.log(values)
        toast();
        form.reset()
    }

    return (
        <>
            <h3 className='col-span-full lg:text-center mb-8 lg:mb-16 font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold'>{ t('title') }</h3>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-full lg:col-start-4 lg:col-span-9 grid grid-cols-8 lg:grid-cols-9">
                <div className="col-span-full lg:col-span-4 mb-2 lg:mb-0"> 
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem> 
                                <FormMessage />
                                    <Select onValueChange={field.onChange} >
                                        <FormControl>
                                            <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black  w-full">
                                                <SelectValue placeholder={t('subject')} />
                                                <ChevronDown className='size-5' strokeWidth={1.5}/>
                                            </SelectTrigger>
                                        </FormControl>  
                                        <SelectContent className="border-gray">
                                            <SelectGroup>
                                                <SelectItem className="text-base cursor-pointer  " value={"ORDER_ISSUE"}>{ t("order_issue") }</SelectItem>
                                                <SelectItem className="text-base cursor-pointer  " value={"GIFT_ASSITANCE"}>{ t("gift_assistance") }</SelectItem>
                                                <SelectItem className="text-base cursor-pointer  " value={"COMPANY_COLLABORATION"}>{ t("company_collaboration") }</SelectItem>
                                                <SelectItem className="text-base cursor-pointer  " value={"OTHER"}>{ t("other") }</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-full lg:col-span-1 hidden lg:block"></div>
                <div className="col-span-full lg:col-span-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="text-base text-black  w-full">
                                <FormMessage />
                                <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                    <Input className="h-12 w-full px-6 rounded-3xl" placeholder={`${t('name')}*`} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-full lg:col-span-4 mt-2 lg:mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="text-black w-full">
                                <FormMessage />
                                <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                    <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder={`${t('email')}*`} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-full lg:col-span-1 hidden lg:block"></div>
                <div className="col-span-full lg:col-span-4 mt-2 lg:mt-4">
                    <FormField
                        control={form.control}
                        name="tel_number"
                        render={({ field }) => (
                            <FormItem className="text-black  w-full">
                                <FormMessage />
                                <FormControl className="border  rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                    <Input className="text-base h-12 w-full px-6 rounded-3xl" placeholder={`${t('phone')}*`} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-full mt-8 lg:mt-4">
                    <p className=" mb-2 lg:mb-4">{t('preference')}</p>
                    <div className="flex gap-8">
                        <FormField
                            control={form.control}
                            name="contact_method"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-8">
                                        <FormControl className="border-none shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <div className="flex gap-2">
                                                <Checkbox 
                                                    checked={field.value?.includes("EMAIL")}  
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...field.value, "EMAIL"])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== "EMAIL"
                                                            )
                                                            )
                                                    }}
                                                    id="email" 
                                                    className="border-gray size-4 cursor-pointer"/>
                                                <label htmlFor="email" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{t('email')}</label>
                                            </div>
                                        </FormControl>
                                        <FormControl>
                                        <div className="flex gap-2">
                                                <Checkbox 
                                                    checked={field.value?.includes("TEL")}  
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...field.value, "TEL"])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== "TEL"
                                                            )
                                                            )
                                                    }}
                                                    id="TEL" 
                                                    className="border-gray size-4 cursor-pointer"/>
                                                <label htmlFor="TEL" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{t('phone')}</label>
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage className="left-6 right-auto" />
                                </FormItem>
                            )}
                            
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="col-span-full mt-8 lg:mt-4">
                            <FormControl>
                                <Textarea className="placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black   col-span-full" placeholder={`${t('message')}*`} {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                        <FormItem className="col-span-full mt-2 lg:mt-4">
                                <div className="flex gap-2 col-span-full mt-2 lg:mt-4">
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
                                        <div className={`${form.formState.errors.termsAccepted ? 'text-destructive animate-shake' : ''}`}>
                                            {t('agreement_slice_1')} <Link href="/terms" className="underline">{t('agreement_slice_2')}</Link>
                                        </div>
                                </div>
                        </FormItem>
                    )}
                />  
                <Button type="submit" className=" hover:bg-blue-2 text-white  text-base cursor-pointer col-span-full h-12 rounded-3xl bg-blue-2 mt-8 mb-24 font-semibold">{t('send')}</Button>
            </form>
            </Form>
        </>
      )
}