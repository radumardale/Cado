import {
  Body,
  Head,
  Html,
  Preview,
  Font,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import {
  ResOrderInterface,
} from "@/models/order/types/orderInterface";
import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
import { DeliveryMethod } from "@/models/order/types/deliveryMethod";
import { CircleCheckBig } from "lucide-react";

// Define the props interface
interface OrderConfirmationEmailProps {
  order: ResOrderInterface;
  locale: string;
  paymentMethodName: string;
  regionName: string;
  baseUrl?: string;
}

export const OrderConfirmationEmail = ({
  order,
  locale,
  baseUrl = "https://cado-henna.vercel.app",
}: OrderConfirmationEmailProps) => {

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Verdana"
          webFont={{
            url: `${baseUrl}/fonts/Manrope-Bold.ttf`,
            format: "woff2",
          }}
        />
        <Font
          fontFamily="Roboto-Bold"
          fallbackFontFamily="Verdana"
          webFont={{
            url: `${baseUrl}/fonts/Roboto-Bold.ttf`,
            format: "woff2",
          }}
        />
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: `${baseUrl}/fonts/Roboto-Regular.ttf`,
            format: "woff2",
          }}
        />
      </Head>
      <Preview>Comanda #{order.custom_id} a fost preluată</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                blue: "#8AA1C4",
                green: "#3A9F5C",
                gray: "#929292",
                lightgray: "#C6C6C6",
                black: "#1A2433",
                white: "#fafafa",
                purewhite: "#ffffff",
              },
              fontFamily: {
                manrope: "Manrope",
                roboto: "Roboto",
                "roboto-bold": "Roboto-Bold"
              },
              fontSize: {
                sm: "0.875rem",
              },
            },
          },
        }}
      >
        <Body className="max-w-[800px] mx-auto">
            <div className="flex justify-center" style={{justifyContent: "center"}}>
                <img src={`${baseUrl}/logo/logo-white.png`} alt="logo" className="h-14 mt-8 mb-12" />
            </div>
          <div className="flex justify-center border-t border-b-0 border-x-0 border-solid border-lightgray pt-4">
            <CircleCheckBig
              strokeWidth={1.5}
              className="text-green size-12 mx-auto mb-6"
            />
          </div>
          <p className="font-manrope font-semibold uppercase text-center text-[2rem] leading-9 mb-6 mt-0">
            Mulțumim MULT! <br /> comanda{" "}
            <span className="underline">#{order?.custom_id}</span> a fost
            preluată
          </p>
          <p className="text-center mb-12 mt-0">
            Am trimis un e-mail la adresa{" "}
            <span className="font-roboto-bold">
              {order?.additional_info.user_data.email}
            </span>{" "}
            cu confirmarea și factura comenzii. <br />
            <br /> Dacă nu ai primit e-mailul în două minute, te rugăm să
            verifici și folderul spam.
          </p>
          <div className="border-solid border-t border-x-0 border-b-0 border-lightgray pt-4 mb-12">
            <p className="font-manrope font-semibold mb-4 mt-0">
              Sumarul comenzii
            </p>
            <div className="grid col-span-full grid-cols-2 gap-6">
              {order?.products.map((product, index) => (
                <div key={index} className="w-full flex gap-4">
                  <div className="peer bg-purewhite rounded-lg">
                    <img
                      src={product.product.images[0]}
                      alt={product.product.title[locale]}
                      width={129}
                      height={164}
                      className="w-32 aspect-[129/164] object-contain peer"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 peer-hover:[&>div>p]:after:w-full">
                    <div>
                      <p className='font-manrope text-sm leading-5 w-fit font-semibold mb-4 mt-0 relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300'>
                        {product.product.title[locale]}
                      </p>
                      <div className={`flex gap-1 items-center`}>
                        {product.product.sale &&
                          product.product.sale.active && (
                            <p className="text-gray text-base leading-5 font-semibold line-through mt-0">
                              {product.product.price.toLocaleString()} MDL
                            </p>
                          )}
                        <div
                          className={`font-manrope font-semibold border-solid border border-gray rounded-3xl w-fit py-2 px-4`}
                        >
                          {product.product.sale && product.product.sale.active
                            ? product.product.sale.sale_price.toLocaleString()
                            : product.product.price.toLocaleString()}{" "}
                          MDL
                        </div>
                      </div>
                    </div>
                    <p className="text-gray my-0">
                      Cantitatea: {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-x-0 border-b-0 border-solid border-lightgray pt-4 mb-12 flex flex-col gap-4">
            {order?.delivery_method === DeliveryMethod.HOME_DELIVERY && (
              <div className="flex justify-between">
                <p className="m-0">Subtotal:</p>
                <p className="m-0">
                  {order?.products
                    .reduce(
                      (acc, item) =>
                        acc +
                        ((item.product.sale?.active
                          ? item.product.sale.sale_price
                          : item.product.price) || 0) *
                          item.quantity,
                      0
                    )
                    .toLocaleString()}{" "}
                  MDL
                </p>
              </div>
            )}
            {order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
              order?.additional_info.delivery_address?.region && (
                <div className="flex justify-between">
                  <p className="m-0">Livrare:</p>
                  <p className="m-0">
                    {getDeliveryPrice(
                      order?.additional_info.delivery_address
                        .region as DeliveryRegions
                    )}{" "}
                    MDL
                  </p>
                </div>
              )}
            <div className="flex justify-between">
              <p className="m-0">Total:</p>
              <p className="font-roboto-bold mt-0">
                {order?.total_cost.toLocaleString()} MDL
              </p>
            </div>
          </div>
          <div className="border-solid border-t border-x-0 border-b-0 border-lightgray pt-4 grid grid-cols-2 gap-x-6 gap-y-8">
            <div className="flex flex-col gap-2">
              <p className="font-manrope font-semibold mb-2 mt-0">
                Detalii de contact
              </p>
              <p className="m-0">
                {order?.additional_info.user_data.firstname}{" "}
                {order?.additional_info.user_data.lastname}
              </p>
              <p className="m-0">
                Email: {order?.additional_info.user_data.email}
              </p>
              <p className="m-0">
                Metodă de plată: {order?.additional_info.user_data.tel_number}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-manrope font-semibold mb-2 mt-0">
                Datalii comandă
              </p>
              <p className="m-0">
                Data:{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Data indisponibilă"}
              </p>
              <p className="m-0">Metodă de plată: {order?.payment_method}</p>
            </div>
            {order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
              order?.additional_info.delivery_address && (
                <div className="flex flex-col gap-2">
                  <p className="font-manrope font-semibold mb-2 mt-0">
                    Adresa de livrare
                  </p>
                  <p className="m-0">
                    {order?.additional_info.user_data.firstname}{" "}
                    {order?.additional_info.user_data.lastname}
                  </p>
                  <p className="m-0">
                    {order?.additional_info.delivery_address.home_address}{" "}
                    {order?.additional_info.delivery_address.home_nr}
                  </p>
                  <p className="m-0">
                    {
                      order?.additional_info.delivery_address.region.split(
                        " - "
                      )[0]
                    }
                    , {order?.additional_info.delivery_address.city}
                  </p>
                  <p className="m-0">Republica Moldova</p>
                </div>
              )}
            <div className="flex flex-col gap-2">
              <p className="font-manrope font-semibold mb-2 mt-0">
                Adresa de facturare
              </p>
              <p className="m-0">
                {order?.additional_info.user_data.firstname}{" "}
                {order?.additional_info.user_data.lastname}
              </p>
              <p className="m-0">
                {order?.additional_info.billing_address.home_address}{" "}
                {order?.additional_info.billing_address.home_nr}
              </p>
              <p className="m-0">
                {order?.additional_info.billing_address.region.split(" - ")[0]},{" "}
                {order?.additional_info.billing_address.city}
              </p>
              <p className="m-0">Republica Moldova</p>
            </div>
          </div>
          <div className="bg-blue px-6 pt-12 pb-6 mt-12 text-purewhite">
            <p className="m-0">Dacă ai întrebări, te rugăm să ne <a href={`${baseUrl}/contacts`} target="_blank" className="text-white">contactezi.</a> Pentru mai multe informații despre drepturile tale legale privind anulările, te rugăm să consulți <a href={`${baseUrl}/contacts`} target="_blank" className="text-white">politica noastră de retur.</a> <br/><br/><br/> DIM EXPRES S.R.L. <br/> Adresă juridică și poștală: mun. Chișinău, str. Alecu Russo, nr. 15, of. 59, Moldova <br/> Cod fiscal: 1015600006586 <br/> Director General: Irina Cecan <br/><br/><br/> © 2025 CADO. Toate drepturile rezervate.</p>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
