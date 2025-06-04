'use client';
import { useTRPC } from "@/app/_trpc/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ocasions, OcasionsArr } from "@/lib/enums/Ocasions";
import { useLenis } from "lenis/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

interface DeleteBannerFormProps {
  id: string,
  ocasion: Ocasions,
  refetchBanners: () => void
}

export default function DeleteBannerForm({ id, ocasion, refetchBanners }: DeleteBannerFormProps) {
    const trpc = useTRPC();
    const ocastionsT = useTranslations("ocasions");
    const lenis = useLenis();
    const {
      isSuccess,
      mutate,
      data: MutatedData,
    } = useMutation(trpc.home_banner.deleteHomebanner.mutationOptions());

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
      if (isDeleteDialogOpen) {
        lenis?.stop();
        document.body.classList.add("carousel")
      } else {
        lenis?.start();
        document.body.classList.remove("carousel")
      }
    }, [isDeleteDialogOpen])

    useEffect(() => {
      if (isSuccess && MutatedData) {
          refetchBanners();
      }
    }, [isSuccess, MutatedData]);

    return (
      <>
       {
          isDeleteDialogOpen && 
          <div className='fixed top-0 left-0 w-full h-full bg-black/75 z-50 flex justify-center items-center' onMouseDown={() => {setIsDeleteDialogOpen(false)}}>
              <div className='p-8 rounded-3xl bg-white' onMouseDown={(e) => {e.stopPropagation()}}>
                  <p className='text-lg'>Ești sigur că vrei să ștergi banerul?</p>
                  <div className='flex gap-6 ml-36 mt-12'>
                      <button className='cursor-pointer h-12' onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(false);}}>
                          <span className='relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all after:duration-300'>Anulează</span>
                      </button>
                      <button 
                          onClick={(e) => {
                              e.preventDefault(); 
                              mutate({id});
                              setIsDeleteDialogOpen(false);
                          }} 
                          className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'
                          >
                              Da, șterge
                          </button>
                  </div>
              </div>
          </div>
      }
      <div className="col-span-full flex justify-between items-center mb-42">
          <div className="flex items-center gap-6 w-fit">
            <p className="whitespace-nowrap">Filtru banner:</p>
              <Select value={ocasion} disabled>
                  <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black w-full">
                      <SelectValue placeholder="Alege disponibilitate stoc" />
                      <ChevronDown className="size-5" strokeWidth={1.5} />
                  </SelectTrigger>
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
          </div>
          <button onClick={() => {setIsDeleteDialogOpen(true)}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>Șterge banner</button>
      </div>
      </>
    );
}
