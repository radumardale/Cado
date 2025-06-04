'use client';
import { useTRPC } from "@/app/_trpc/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OcasionsArr } from "@/lib/enums/Ocasions";
import { addHomeBannerRequestSchema } from "@/lib/validation/home/addHomeBannerRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";

interface NewBannerFormProps {
  selectedImage: string | null,
  setSelectedImage: (img: string | null) => void,
  refetchBanners: () => void
}

export default function NewBannerForm({ selectedImage, refetchBanners, setSelectedImage }: NewBannerFormProps) {
  const trpc = useTRPC();
  const ocastionsT = useTranslations("ocasions");
  const {
    isSuccess,
    mutate,
    data: MutatedData,
  } = useMutation(trpc.home_banner.addHomeBanner.mutationOptions());
  const { mutate: UpdateMutate, isSuccess: UpdateIsSuccess } =
    useMutation(trpc.image.uploadBannerImage.mutationOptions());

  useEffect(() => {
    if (UpdateIsSuccess) {
      setSelectedImage(null);
      toast.success("Banerul a fost creat cu succes!")
      refetchBanners();
    }
  }, [UpdateIsSuccess]);

  const form = useForm<z.infer<typeof addHomeBannerRequestSchema>>({
    resolver: zodResolver(addHomeBannerRequestSchema),
    defaultValues: {
      ocasion: undefined,
    },
  });

  const { isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    // Define an async function for sequential uploads
    const uploadImagesInOrder = async () => {
      if (isSuccess && MutatedData && selectedImage) {
        let newMainImageKey = null;

        try {
          const dataUrl = MutatedData.imageLink;

          // Convert base64 to Buffer
          const base64Data = selectedImage.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buf = Buffer.from(base64Data, "base64");

          // Upload to S3
          const response = await fetch(dataUrl, {
            method: "PUT",
            body: buf,
          });

          // Extract key from URL
          const extractedKey = dataUrl.split(".com/")[1]?.split("?")[0];

          if (response.ok && extractedKey) {
            newMainImageKey = extractedKey;
          } else {
            console.log(
              `Failed to upload main image: ${response.statusText}`
            );
          }
        } catch (error) {
          console.log(`Error uploading main image:`, error);
        }

        if (MutatedData.homeBanner?._id) {
          UpdateMutate({
            id: MutatedData.homeBanner._id,
            newMainImageKey,
          });
        }
      }
    };

    // Call the async function if we have successful mutation
    if (isSuccess && MutatedData) {
      if (selectedImage) {
        uploadImagesInOrder();
      } else {
        toast.error("Introduceti imaginea!");
      }

      // Reset form with updated product data
      form.reset(
        {
          ...MutatedData.homeBanner,
        },
        {
          keepDirty: false,
          keepDefaultValues: false,
        }
      );
    }
  }, [isSuccess, MutatedData, form]);

  const onSubmit = (values: z.infer<typeof addHomeBannerRequestSchema>) => {
    if (!selectedImage) {
      toast.error("Introduceti imaginea!"); 
    } else {
      mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-full flex justify-between items-center mb-42">
        <div className="flex items-center gap-6">
          <p>Filtru banner:</p>
          <FormField
            control={form.control}
            name="ocasion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormMessage />
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black w-full">
                      <SelectValue placeholder="Alege filtru" />
                      <ChevronDown className="size-5" strokeWidth={1.5} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray">
                    <SelectGroup>
                      {OcasionsArr.map((ocasion) => (
                        <SelectItem
                          key={ocasion}
                          className="text-base cursor-pointer"
                          value={ocasion}
                        >
                          {ocastionsT(`${ocasion}.title`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <button type="submit" disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>Salvează banner</button>
      </form>
    </Form>
  );
}
