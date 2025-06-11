"use client";

import { useTRPC } from "@/app/_trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface Props { 
    id : string;
}

export function PageContent({ id } : Props) {

    const t = useTranslations("PaymentErrorPage")

    const trpc = useTRPC();
    const { mutate } = useMutation(trpc.order.cancelOrder.mutationOptions());

    useEffect(() => {
        mutate({
            id : id
        })
    }, [id, mutate])

    return (
        <div className="col-span-full flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center">
            <Image 
                src="/icons/red-cross-icon.svg"
                alt="Error Icon"
                width={48}
                height={48}
                className="size-[3rem]"
            />

            <h1 className="font-manrope text-[1.5rem] font-bold uppercase leading-[1.75rem] text-center text-darkblue mt-[1.5rem]">{t("title_slice_1")}<br />{t("title_slice_2")}</h1>
            <p className="text-base leading-4.5 font-roboto font-[400] text-center text-darkblue mt-[2.5rem]">{t("subtitle_slice_1")}<br />{t("subtitle_slice_2")} <Link href={"/contacts"} className="underline">{t("subtitle_slice_3")}</Link> </p>

            <Link href="/">
                <button className="rounded-[1.5rem] cursor-pointer bg-[#8AA1C4] px-6 h-[3rem] flex justify-center items-center text-base font-bold font-manrope text-[#FAFAFA] transition-colors hover:bg-[#6685B2] duration-300 mt-[2.5rem]">
                    {t("back")}
                </button>
            </Link>
        </div>
    )
}