'use client';
import { useTRPC } from '@/app/_trpc/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { updateSeasonCatalogRequestSchema } from '@/lib/validation/home/updateSeasonCatalogRequest';
import { Switch } from '@/components/ui/switch';
import { useLocale, useTranslations } from 'next-intl';

const toastMessages = {
  success: {
    ro: 'Catalog sezon modificat cu succes!',
    ru: 'Сезонный каталог успешно обновлён!',
    en: 'Season catalog updated successfully!',
  },
};

export default function AdminSeasonCatalog() {
  const locale = useLocale() as 'ro' | 'ru' | 'en';
  const trpc = useTRPC();
  const { data } = useQuery(trpc.seasonCatalog.getSeasonCatalog.queryOptions());
  const {
    mutate,
    isSuccess,
    data: MutatedData,
  } = useMutation(trpc.seasonCatalog.updateSeasonCatalog.mutationOptions());

  const form = useForm<z.infer<typeof updateSeasonCatalogRequestSchema>>({
    resolver: zodResolver(updateSeasonCatalogRequestSchema),
    defaultValues: {
      id: '',
      link: '',
      active: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.seasonCatalog?._id,
        link: data.seasonCatalog?.link,
        active: data.seasonCatalog?.active,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(toastMessages.success[locale]);
      form.reset({
        id: MutatedData.seasonCatalog?._id,
        link: MutatedData.seasonCatalog?.link,
        active: MutatedData.seasonCatalog?.active,
      });
    }
  }, [isSuccess]);

  const { isDirty } = useFormState({ control: form.control });

  const onSubmit = (values: z.infer<typeof updateSeasonCatalogRequestSchema>) => {
    mutate(values);
  };

  const t = useTranslations('Admin.AdminHomePage');

  return (
    <>
      <h2 className='col-span-5 font-manrope font-semibold text-3xl leading-11 mb-10 mt-42 uppercase'>
        {t('season_catalog')}
      </h2>
      <h3 className='col-start-1 col-span-4 font-manrope font-semibold leading-7'>
        {t('season_catalog_details')}
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='col-span-full mt-6 grid grid-cols-12 gap-x-6 h-fit mb-16 items-end'
        >
          {/* Title */}
          <FormField
            control={form.control}
            name='active'
            render={({ field }) => (
              <>
                <FormItem className='text-black col-span-3'>
                  <FormLabel className='font-semibold font-manrope leading-5 whitespace-nowrap'>
                    {t('season_catalog')}
                  </FormLabel>
                  <FormMessage />
                  <FormControl className='border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none'>
                    <Switch
                      className='cursor-pointer max-w-full h-12 flex border-gray [&>span]:border [&>span]:border-gray [&>span]:w-auto [&>span]:aspect-square [&>span]:h-10 w-1/3'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name='link'
            render={({ field }) => (
              <FormItem className='text-black col-span-6'>
                <FormLabel className='font-semibold font-manrope leading-5'>
                  {t('season_catalog_link')}
                </FormLabel>
                <FormMessage className='top-7' />
                <FormControl className='border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none'>
                  <Input
                    className=' text-base h-12 w-full px-6 rounded-3xl'
                    placeholder='Link-ul*'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='col-span-3 flex justify-end'>
            <div className='flex gap-6'>
              <button
                className='cursor-pointer h-12'
                onClick={e => {
                  e.preventDefault();
                  form.reset();
                }}
              >
                <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>
                  {t('cancel')}
                </span>
              </button>
              <button
                type='submit'
                disabled={!isDirty}
                className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'
              >
                {t('save')}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
