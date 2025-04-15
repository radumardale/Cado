import CheckoutCart from "./CheckoutCart";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutSection() {
  return (
    <div className="relative col-span-full grid grid-cols-8 lg:grid-cols-15 mt-16 gap-x-2 lg:gap-x-6">
      <CheckoutForm />
      <CheckoutCart />
    </div>
  )
}
