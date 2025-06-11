'use client';
import { useTRPC } from '@/app/_trpc/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ocasions, OcasionsArr } from '@/lib/enums/Ocasions';
import { updateHomeOcasionRequestSchema } from '@/lib/validation/home/updateHomeOcasion';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect } from 'react'
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const toastMessages = {
  success: {
    ro: "Ocazie adăugată cu succes!",
    ru: "Событие успешно добавлено!",
    en: "Occasion added successfully!"
  }
};

export default function AdminHomeOcasion() {

    const locale = useLocale() as "ro" | "ru" | "en";

    const trpc = useTRPC();
    const { data } = useQuery(trpc.homeOcasion.getHomeOcasion.queryOptions());
    const { mutate, isSuccess, data: MutatedData } = useMutation(trpc.homeOcasion.updateHomeOcasion.mutationOptions());
    const ocastionsT = useTranslations("ocasions");

    const form = useForm<z.infer<typeof updateHomeOcasionRequestSchema>>({
        resolver: zodResolver(updateHomeOcasionRequestSchema),
        defaultValues: {
            id: data?.homeOcasion?._id,
            ocasionTitle: {
                ro: data?.homeOcasion?.title.ro || '',
                ru: data?.homeOcasion?.title.ru || '',
                en: data?.homeOcasion?.title.en || '',
            },
            ocasion: data?.homeOcasion?.ocasion || Ocasions.CHRISTMAS_NEW_YEAR
        } 
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success(toastMessages.success[locale])
            form.reset({
                id: MutatedData.homeOcasion?._id,
                ocasion: MutatedData.homeOcasion?.ocasion,
                ocasionTitle: MutatedData.homeOcasion?.title
            });
        }
    }, [isSuccess])

    const { isDirty } = useFormState({ control: form.control });

    const onSubmit = (values: z.infer<typeof updateHomeOcasionRequestSchema>) => {
        mutate(values);
    };

    const t = useTranslations("Admin.AdminHomePage");

    return (
      <>
          <h2 className='col-span-5 font-manrope font-semibold text-3xl leading-11 mb-10'>{t("soon_ocasion")}</h2>
          <h3 className='col-start-1 col-span-4 font-manrope font-semibold leading-7'>{t("ocasion_details")}</h3>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-full mt-6 grid grid-cols-12 gap-x-6 h-fit mb-16 items-end">
                  {/* Title */}
                      <FormField
                          control={form.control}
                          name="ocasionTitle.ro"
                          render={({ field }) => (
                              <FormItem className="text-black col-span-3">
                                  <FormLabel className="font-semibold font-manrope leading-5">Titlu</FormLabel>
                                  <FormMessage className='top-7' />
                                  <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Titlu produs*" {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="ocasionTitle.ru"
                          render={({ field }) => (
                              <FormItem className="text-black col-span-3">
                                  <FormLabel className="font-semibold font-manrope leading-5">Название</FormLabel>
                                  <FormMessage className='top-7' />
                                  <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Название продукта*" {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="ocasionTitle.en"
                          render={({ field }) => (
                              <FormItem className="text-black col-span-3">
                                  <FormLabel className="font-semibold font-manrope leading-5">Title</FormLabel>
                                  <FormMessage className='top-7' />
                                  <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                      <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Product title*" {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />

                  <div className='col-span-3 flex items-center gap-6 -col-start-4 h-fit'>
                      <p>{t("ocasion_filter")}:</p>
                      <FormField
                          control={form.control}
                          name="ocasion"
                          render={({ field }) => (
                              <FormItem className='flex-1'> 
                                  <FormMessage />
                                      <Select onValueChange={field.onChange} value={field.value}>
                                          <FormControl>
                                              <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black w-full">
                                                  <SelectValue placeholder="Alege disponibilitate stoc" />
                                                  <ChevronDown className='size-5' strokeWidth={1.5}/>
                                              </SelectTrigger>
                                          </FormControl>  
                                          <SelectContent className="border-gray">
                                              <SelectGroup>
                                                  {
                                                      OcasionsArr.map((ocasion) => (
                                                          <SelectItem key={ocasion} className="text-base cursor-pointer" value={ocasion}>{ocastionsT(`${ocasion}.title`)}</SelectItem>
                                                      ))
                                                  }
                                              </SelectGroup>
                                          </SelectContent>
                                      </Select>
                              </FormItem>
                          )}
                      />
                  </div>

                  <div className='mt-12 pt-4 col-span-full flex justify-end'>
                      <div className='flex gap-6'>
                          <button 
                              className='cursor-pointer h-12' 
                              onClick={(e) => {
                                  e.preventDefault();                                 
                                  form.reset();
                              }}
                          >
                              <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>
                                  {t("cancel")}
                              </span>
                          </button>
                          <button type="submit" disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>{t("save")}</button>
                      </div>
                  </div>
              </form>
          </Form>
      </>
    )
}
