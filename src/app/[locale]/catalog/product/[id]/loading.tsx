'use client'

import Header from "@/components/header/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mr-[10px] col-span-full grid grid-cols-full">
            <Header />
            <Skeleton className="w-1/3 h-8" />
        </div>
    )
  }

