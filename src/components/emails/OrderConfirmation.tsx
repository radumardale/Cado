import {
    Html,
    Head,
    Preview,
    Font,
  } from "@react-email/components";
  import {
    ResOrderInterface,
  } from "@/models/order/types/orderInterface";
  import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
  import { DeliveryMethod } from "@/models/order/types/deliveryMethod";
  
  // Define the props interface
  interface OrderConfirmationEmailProps {
    order: ResOrderInterface;
    locale: string;
    paymentMethodName: string;
    regionName: string;
    baseUrl?: string;
  }
  
  export default function OrderConfirmationEmail ({
    order,
    locale,
    paymentMethodName,
    baseUrl = "https://cado-henna.vercel.app",
  }: OrderConfirmationEmailProps) {
    return (
      <Html>
        <Head>
          <Font
            fontFamily="Roboto-Bold"
            fallbackFontFamily="Verdana"
            webFont={{
              url: `${baseUrl}/fonts/Roboto-Bold.ttf`,
              format: "truetype",
            }}
          />
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: `${baseUrl}/fonts/Roboto-Regular.ttf`,
              format: "truetype",
            }}
          />
          <style>
            {`
              body {
                font-family: 'Roboto', Verdana, sans-serif;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
              }
              .arial {
                font-family: 'Arial', Verdana, sans-serif;
              }
              .roboto-bold {
                font-family: 'Roboto-Bold', Verdana, sans-serif;
                font-weight: bold;
              }
            `}
          </style>
        </Head>
        <Preview>Comanda #{order.custom_id} a fost preluată</Preview>
        
        <body style={{ margin: "0", padding: "0", backgroundColor: "#ffffff" }}>
          <table width="100%" cellPadding={0} cellSpacing={0} border={0} role="presentation">
            <tr>
              <td align="center" style={{ padding: "0" }}>
                <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ maxWidth: "800px", margin: "0 auto" }}>
                  {/* Header with logo */}
                  <tr>
                    <td align="center" style={{ padding: "32px 0 48px" }}>
                      <img 
                        src={`${baseUrl}/logo/logo-white.png`} 
                        alt="logo" 
                        height="56" 
                        style={{ height: "56px" }}
                      />
                    </td>
                  </tr>
                  
                  {/* Divider */}
                  <tr>
                    <td style={{ borderTop: "1px solid #C6C6C6", padding: "16px 0 0" }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                        <tr>
                          <td align="center" style={{ padding: "0 0 24px" }}>
                            <img 
                              src={`${baseUrl}/icons/check.png`} 
                              alt="Success" 
                              width="48" 
                              height="48"
                              style={{ 
                                width: "48px", 
                                height: "48px", 
                                color: "#3A9F5C" // Fallback if image doesn't load
                              }}
                            />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  {/* Thank you message */}
                  <tr>
                    <td align="center" style={{ padding: "0 20px" }}>
                      <p 
                        style={{ 
                          fontFamily: "'Arial', Verdana, sans-serif", 
                          fontWeight: "600", 
                          textTransform: "uppercase", 
                          fontSize: "24px", 
                          lineHeight: "36px", 
                          textAlign: "center", 
                          marginBottom: "24px",
                          marginTop: "0"
                        }}
                      >
                        Mulțumim MULT!<br />
                        comanda <span style={{ textDecoration: "underline" }}>#{order?.custom_id}</span> a fost preluată
                      </p>
                    </td>
                  </tr>
                  
                  {/* Email sent info */}
                  <tr>
                    <td align="center" style={{ padding: "0 20px 48px" }}>
                      <p style={{ textAlign: "center", margin: "0" }}>
                        Am trimis un e-mail la adresa <span style={{ fontFamily: "'Roboto-Bold', Verdana, sans-serif", fontWeight: "bold" }}>{order?.additional_info.user_data.email}</span> cu confirmarea și factura comenzii.<br /><br />
                        Dacă nu ai primit e-mailul în două minute, te rugăm să verifici și folderul spam.
                      </p>
                    </td>
                  </tr>
                  
                  {/* Order Summary */}
                  <tr>
                    <td style={{ borderTop: "1px solid #C6C6C6", paddingTop: "16px", paddingBottom: "48px", paddingLeft: "24px", paddingRight: "24px" }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                      <tr>
                        <td style={{ padding: "0 0 16px" }}>
                        <p 
                          style={{ 
                          fontFamily: "'Arial', Verdana, sans-serif", 
                          fontWeight: "600", 
                          margin: "0"
                          }}
                        >
                          Sumarul comenzii
                        </p>
                        </td>
                      </tr>
                      
                      {/* Products */}
                      {order?.products.map((product, index) => (
                        <tr key={index}>
                        <td style={{ padding: "12px 0" }}>
                          <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                          <tr>
                            <td width="129" valign="top" style={{ paddingRight: "16px" }}>
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", width: "129px", height: "164px" }}>
                              <img
                              src={product.product.images[0]}
                              alt={product.product.title[locale]}
                              width="129"
                              height="164"
                              style={{ 
                                width: "129px", 
                                height: "164px", 
                                objectFit: "contain", 
                                display: "block"
                              }}
                              />
                            </div>
                            </td>
                            <td valign="top">
                            <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                              <tr>
                              <td style={{ paddingBottom: "16px" }}>
                                <p 
                                style={{ 
                                  fontFamily: "'Arial', Verdana, sans-serif", 
                                  fontSize: "14px", 
                                  lineHeight: "20px", 
                                  fontWeight: "600", 
                                  margin: "0"
                                }}
                                >
                                {product.product.title[locale]}
                                </p>
                              </td>
                              </tr>
                              <tr>
                              <td style={{ paddingBottom: "16px" }}>
                                <table cellPadding="0" cellSpacing="0" border={0} role="presentation">
                                <tr>
                                  {product.product.sale && product.product.sale.active && (
                                  <td style={{ paddingRight: "8px" }}>
                                    <p 
                                    style={{ 
                                      color: "#929292", 
                                      fontSize: "16px", 
                                      lineHeight: "20px", 
                                      fontWeight: "600", 
                                      textDecoration: "line-through", 
                                      margin: "0"
                                    }}
                                    >
                                    {product.product.price.toLocaleString()} MDL
                                    </p>
                                  </td>
                                  )}
                                  <td>
                                  <div 
                                    style={{ 
                                    fontFamily: "'Arial', Verdana, sans-serif", 
                                    fontWeight: "600", 
                                    border: "1px solid #929292", 
                                    borderRadius: "24px", 
                                    padding: "8px 16px", 
                                    display: "inline-block"
                                    }}
                                  >
                                    {product.product.sale && product.product.sale.active
                                    ? product.product.sale.sale_price.toLocaleString()
                                    : product.product.price.toLocaleString()}{" "}
                                    MDL
                                  </div>
                                  </td>
                                </tr>
                                </table>
                              </td>
                              </tr>
                              <tr>
                              <td>
                                <p style={{ color: "#929292", margin: "0" }}>
                                Cantitatea: {product.quantity}
                                </p>
                              </td>
                              </tr>
                            </table>
                            </td>
                          </tr>
                          </table>
                        </td>
                        </tr>
                      ))}
                      </table>
                    </td>
                  </tr>
                  
                  {/* Price Summary */}
                  <tr>
                    <td style={{ borderTop: "1px solid #C6C6C6", paddingTop: "16px", paddingBottom: '48px', paddingLeft: "24px", paddingRight: "24px" }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                      {order?.delivery_method === DeliveryMethod.HOME_DELIVERY && (
                        <tr>
                        <td style={{ paddingBottom: "16px" }}>
                          <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                          <tr>
                            <td>
                            <p style={{ margin: "0" }}>Subtotal:</p>
                            </td>
                            <td align="right">
                            <p style={{ margin: "0" }}>
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
                            </td>
                          </tr>
                          </table>
                        </td>
                        </tr>
                      )}
                      
                      {order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
                        order?.additional_info.delivery_address?.region && (
                        <tr>
                          <td style={{ paddingBottom: "16px" }}>
                          <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                            <tr>
                            <td>
                              <p style={{ margin: "0" }}>Livrare:</p>
                            </td>
                            <td align="right">
                              <p style={{ margin: "0" }}>
                              {getDeliveryPrice(
                                order?.additional_info.delivery_address
                                .region as DeliveryRegions
                              )}{" "}
                              MDL
                              </p>
                            </td>
                            </tr>
                          </table>
                          </td>
                        </tr>
                        )}
                      
                      <tr>
                        <td>
                        <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                          <tr>
                          <td>
                            <p style={{ margin: "0" }}>Total:</p>
                          </td>
                          <td align="right">
                            <p style={{ 
                            fontFamily: "'Roboto-Bold', Verdana, sans-serif",
                            fontWeight: "bold",
                            margin: "0" 
                            }}>
                            {order?.total_cost.toLocaleString()} MDL
                            </p>
                          </td>
                          </tr>
                        </table>
                        </td>
                      </tr>
                      </table>
                    </td>
                  </tr>
                  
                  {/* Contact and Order Details */}
                  <tr>
                    <td style={{ borderTop: "1px solid #C6C6C6", paddingTop: "16px", paddingBottom: '48px', paddingLeft: "24px", paddingRight: "24px" }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                        <tr>
                          <td style={{ paddingBottom: "32px" }}>
                            <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                              <tr>
                                {/* Contact Details */}
                                <td width="50%" valign="top" style={{ paddingRight: "12px" }}>
                                  <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                                    <tr>
                                      <td style={{ paddingBottom: "8px" }}>
                                        <p style={{ 
                                          fontFamily: "'Arial', Verdana, sans-serif",
                                          fontWeight: "600",
                                          margin: "0"
                                        }}>
                                          Detalii de contact
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          {order?.additional_info.user_data.firstname}{" "}
                                          {order?.additional_info.user_data.lastname}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          Email: {order?.additional_info.user_data.email}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <p style={{ margin: "0" }}>
                                          Telefon: {order?.additional_info.user_data.tel_number}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                
                                {/* Order Details */}
                                <td width="50%" valign="top" style={{ paddingLeft: "12px" }}>
                                  <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                                    <tr>
                                      <td style={{ paddingBottom: "8px" }}>
                                        <p style={{ 
                                          fontFamily: "'Arial', Verdana, sans-serif",
                                          fontWeight: "600",
                                          margin: "0"
                                        }}>
                                          Detalii comandă
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          Data:{" "}
                                          {order?.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString("ro-RO", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                            : "Data indisponibilă"}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <p style={{ margin: "0" }}>Metodă de plată: {paymentMethodName}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td>
                            <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                              <tr>
                                {/* Delivery Address */}
                                {order?.delivery_method === DeliveryMethod.HOME_DELIVERY &&
                                  order?.additional_info.delivery_address && (
                                    <td width="50%" valign="top" style={{ paddingRight: "12px" }}>
                                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                                        <tr>
                                          <td style={{ paddingBottom: "8px" }}>
                                            <p style={{ 
                                              fontFamily: "'Arial', Verdana, sans-serif",
                                              fontWeight: "600",
                                              margin: "0"
                                            }}>
                                              Adresa de livrare
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style={{ paddingBottom: "4px" }}>
                                            <p style={{ margin: "0" }}>
                                              {order?.additional_info.user_data.firstname}{" "}
                                              {order?.additional_info.user_data.lastname}
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style={{ paddingBottom: "4px" }}>
                                            <p style={{ margin: "0" }}>
                                              {order?.additional_info.delivery_address.home_address}{" "}
                                              {order?.additional_info.delivery_address.home_nr}
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style={{ paddingBottom: "4px" }}>
                                            <p style={{ margin: "0" }}>
                                              {typeof order?.additional_info.delivery_address.region === 'string' ? 
                                                order?.additional_info.delivery_address.region.split(" - ")[0] : 
                                                order?.additional_info.delivery_address.region
                                              },
                                              {" "}{order?.additional_info.delivery_address.city}
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <p style={{ margin: "0" }}>Republica Moldova</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  )}
                                
                                {/* Billing Address */}
                                <td width={order?.delivery_method === DeliveryMethod.HOME_DELIVERY ? "50%" : "100%"} valign="top" style={{ paddingLeft: order?.delivery_method === DeliveryMethod.HOME_DELIVERY ? "12px" : "0" }}>
                                  <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                                    <tr>
                                      <td style={{ paddingBottom: "8px" }}>
                                        <p style={{ 
                                          fontFamily: "'Arial', Verdana, sans-serif",
                                          fontWeight: "600",
                                          margin: "0"
                                        }}>
                                          Adresa de facturare
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          {order?.additional_info.user_data.firstname}{" "}
                                          {order?.additional_info.user_data.lastname}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          {order?.additional_info.billing_address.home_address}{" "}
                                          {order?.additional_info.billing_address.home_nr}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "4px" }}>
                                        <p style={{ margin: "0" }}>
                                          {typeof order?.additional_info.billing_address.region === 'string' ? 
                                            order?.additional_info.billing_address.region.split(" - ")[0] : 
                                            order?.additional_info.billing_address.region
                                          },
                                          {" "}{order?.additional_info.billing_address.city}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <p style={{ margin: "0" }}>Republica Moldova</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  {/* Footer */}
                  <tr>
                    <td style={{ backgroundColor: "#8AA1C4", padding: "48px 24px 24px", marginTop: "48px", color: "#ffffff" }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                        <tr>
                          <td>
                            <p style={{ margin: "0", lineHeight: "1.5" }}>
                              Dacă ai întrebări, te rugăm să ne <a href={`${baseUrl}/contacts`} target="_blank" style={{ color: "#ffffff" }}>contactezi.</a> Pentru mai multe informații despre drepturile tale legale privind anulările, te rugăm să consulți <a href={`${baseUrl}/terms`} target="_blank" style={{ color: "#ffffff" }}>politica noastră de retur.</a>
                              <br/><br/><br/>
                              DIM EXPRES S.R.L.
                              <br/>
                              Adresă juridică și poștală: mun. Chișinău, str. Alecu Russo, nr. 15, of. 59, Moldova
                              <br/>
                              Cod fiscal: 1015600006586
                              <br/><br/><br/>
                              © 2025 CADO. Toate drepturile rezervate.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </Html>
    );
  }