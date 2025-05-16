'use client'

import { trpc } from "@/app/_trpc/client"
import { CircleCheckBig } from "lucide-react"
import { useEffect } from "react";

interface ConfirmationContentProps {
    id: string
}

export default function ConfirmationContent({ id }: ConfirmationContentProps) {
  const { 
    data, 
    isLoading, 
    isFetching, 
    isRefetching, 
    dataUpdatedAt, 
    isFetchedAfterMount
} = trpc.order.getOrderById.useQuery({ id });

// This effect will help you debug what's happening with data loading
useEffect(() => {
    console.log({
        isLoading, // True if the query is loading for the first time (no cached data)
        isFetching, // True whenever the query is fetching data (includes background updates)
        isRefetching, // True if the query is re-fetching after data was already loaded
        dataUpdatedAt, // Timestamp when the data was last updated
        isFetchedAfterMount, // True if the data was fetched after the component mounted
                            // This is the key indicator! If false, it's using dehydrated data
        hasData: !!data, // Whether we have data already
        fromCache: !!data && !isFetchedAfterMount // True if data came from cache/hydration
    });
}, [isLoading, isFetching, isRefetching, dataUpdatedAt, isFetchedAfterMount, data]);

  return (
    <div>
        <CircleCheckBig strokeWidth={1.5} className='text-green size-12' />
        <p>{data?.order?.custom_id}</p>
    </div>
  )
}
