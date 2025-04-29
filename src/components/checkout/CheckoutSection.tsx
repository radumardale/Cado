'use client'

import { useLocalStorage } from "usehooks-ts";
import CheckoutCart from "./CheckoutCart";
import CheckoutForm from "./CheckoutForm";
import { CartInterface } from "@/lib/types/CartInterface";
import { DeliveryRegions } from "@/lib/enums/DeliveryRegions";
import { useState } from "react";
import { DeliveryHours } from "@/lib/enums/DeliveryHours";

export default function CheckoutSection() {
  const [items, setValue] = useLocalStorage<CartInterface[]>("cart", []);
  const [deliveryRegion, setDeliveryRegion] = useState<DeliveryRegions | null>(DeliveryRegions.CHISINAU);
  const [deliveryHour, setDeliveryHour] = useState<DeliveryHours | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  return (
    <div className="relative col-span-full grid grid-cols-8 lg:grid-cols-15 mt-16 gap-x-2 lg:gap-x-6">
      <CheckoutForm items={items} setDeliveryRegion={setDeliveryRegion} setDeliveryHour={setDeliveryHour} totalCost={totalCost}/>
      <CheckoutCart items={items} setValue={setValue} deliveryRegion={deliveryRegion} deliveryHour={deliveryHour} setTotalCost={setTotalCost}/>
    </div>
  )
}
