import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
    Hr,
    Font,
  } from "@react-email/components";
  import { ResOrderInterface } from "@/models/order/types/orderInterface";
  import { DeliveryRegions, getDeliveryPrice } from "@/lib/enums/DeliveryRegions";
  import { DeliveryMethod } from "@/models/order/types/deliveryMethod";
import { CartProducts } from "@/models/order/types/cartProducts";
  
  // Define the props interface
  interface OrderConfirmationEmailProps {
    order: ResOrderInterface;
    products: CartProducts[];
    locale: string;
    paymentMethodName: string;
    regionName: string;
    baseUrl?: string;
  }
  
  // Translation helper function
  const getTranslation = (locale: string, key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        thankYou: "Mulțumim MULT!",
        orderReceived: "comanda a fost preluată",
        emailSent: "Am trimis un e-mail la adresa",
        withConfirmation: "cu confirmarea și factura comenzii.",
        checkSpam: "Dacă nu ai primit e-mailul în două minute, te rugăm să verifici și folderul spam.",
        orderSummary: "Sumarul comenzii",
        quantity: "Cantitatea",
        subtotal: "Subtotal",
        delivery: "Livrare",
        total: "Total",
        contactDetails: "Detalii de contact",
        email: "Email",
        phoneMethod: "Telefon",
        orderDetails: "Datalii comandă",
        date: "Data",
        paymentMethod: "Metodă de plată",
        deliveryAddress: "Adresa de livrare",
        billingAddress: "Adresa de facturare",
        moldova: "Republica Moldova",
      },
      ru: {
        thankYou: "Спасибо БОЛЬШОЕ!",
        orderReceived: "заказ был принят",
        emailSent: "Мы отправили электронное письмо на адрес",
        withConfirmation: "с подтверждением и счетом заказа.",
        checkSpam: "Если вы не получили электронное письмо в течение двух минут, пожалуйста, проверьте папку спам.",
        orderSummary: "Сводка заказа",
        quantity: "Количество",
        subtotal: "Промежуточный итог",
        delivery: "Доставка",
        total: "Всего",
        contactDetails: "Контактная информация",
        email: "Эл. почта",
        phoneMethod: "Телефон",
        orderDetails: "Детали заказа",
        date: "Дата",
        paymentMethod: "Способ оплаты",
        deliveryAddress: "Адрес доставки",
        billingAddress: "Адрес для выставления счета",
        moldova: "Республика Молдова",
      },
      en: {
        thankYou: "THANK YOU VERY MUCH!",
        orderReceived: "your order has been received",
        emailSent: "We sent an email to",
        withConfirmation: "with the confirmation and invoice for your order.",
        checkSpam: "If you haven't received the email in two minutes, please check your spam folder.",
        orderSummary: "Order Summary",
        quantity: "Quantity",
        subtotal: "Subtotal",
        delivery: "Delivery",
        total: "Total",
        contactDetails: "Contact Details",
        email: "Email",
        phoneMethod: "Phone",
        orderDetails: "Order Details",
        date: "Date",
        paymentMethod: "Payment Method",
        deliveryAddress: "Delivery Address",
        billingAddress: "Billing Address",
        moldova: "Republic of Moldova",
      }
    };
  
    return translations[locale]?.[key] || translations.en[key] || key;
  };
  
  export const OrderConfirmationEmail = ({
    order,
    products,
    locale,
    paymentMethodName,
    regionName,
    baseUrl = "https://cado-henna.vercel.app",
  }: OrderConfirmationEmailProps) => {
    const t = (key: string) => getTranslation(locale, key);
    const formattedDate = order.createdAt 
      ? new Date(order.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'ro-RO', 
          { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'N/A';
    
    // Calculate subtotal
    const subtotal = products.reduce(
      (acc, item) => acc + (item.product.sale?.active ? item.product.sale.sale_price : item.product.price) * item.quantity, 
      0
    );
    
    return (
      <Html lang={locale}>
        <Head>
            <Font
            fontFamily="Manrope"
            fallbackFontFamily="Verdana"
            webFont={{
                url: `${baseUrl}/fonts/Manrope-Semibold.woff2`,
                format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
            />
        </Head>
        <Preview>{`${t('thankYou')} ${t('orderReceived')}`}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={header}>
              <Img
                src={`${baseUrl}/logo/logo-white.svg`}
                width="120"
                height="50"
                alt="Logo"
                style={logo}
              />
            </Section>
            
            <Section style={thankYouSection}>
              <Heading style={thankYouHeading}>
                {t('thankYou')}
                <br />
                {t('orderReceived')} #{order.custom_id}
              </Heading>
              <Text style={emailSentText}>
                {t('emailSent')} <strong>{order.additional_info.user_data.email}</strong> {t('withConfirmation')}
                <br /><br />
                {t('checkSpam')}
              </Text>
            </Section>
            
            <Hr style={divider} />
            
            <Section>
              <Heading as="h2" style={sectionHeading}>
                {t('orderSummary')}
              </Heading>
              
              {products.map((product, index) => (
                <Row key={index} style={productRow}>
                  <Column style={productImageColumn}>
                    <Img
                      src={product.product.images[0]}
                      width="100"
                      height="130"
                      alt={product.product.title[locale] || "Product"}
                      style={productImage}
                    />
                  </Column>
                  <Column style={productDetailsColumn}>
                    <Text style={productTitle}>{product.product.title[locale]}</Text>
                    <Row>
                      {product.product.sale?.active && (
                        <Text style={salePrice}>{product.product.price.toLocaleString()} MDL</Text>
                      )}
                      <Text style={currentPrice}>
                        {(product.product.sale?.active ? product.product.sale.sale_price : product.product.price).toLocaleString()} MDL
                      </Text>
                    </Row>
                    <Text style={quantityText}>{t('quantity')}: {product.quantity}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
            
            <Hr style={divider} />
            
            <Section>
              {order.delivery_method === DeliveryMethod.HOME_DELIVERY && (
                <Row style={pricingRow}>
                  <Column style={pricingLabelColumn}>
                    <Text style={pricingLabel}>{t('subtotal')}:</Text>
                  </Column>
                  <Column style={pricingValueColumn}>
                    <Text style={pricingValue}>{subtotal.toLocaleString()} MDL</Text>
                  </Column>
                </Row>
              )}
              
              {order.delivery_method === DeliveryMethod.HOME_DELIVERY && order.additional_info.delivery_address?.region && (
                <Row style={pricingRow}>
                  <Column style={pricingLabelColumn}>
                    <Text style={pricingLabel}>{t('delivery')}:</Text>
                  </Column>
                  <Column style={pricingValueColumn}>
                    <Text style={pricingValue}>
                      {getDeliveryPrice(order.additional_info.delivery_address.region as DeliveryRegions).toLocaleString()} MDL
                    </Text>
                  </Column>
                </Row>
              )}
              
              <Row style={totalRow}>
                <Column style={pricingLabelColumn}>
                  <Text style={pricingLabel}>{t('total')}:</Text>
                </Column>
                <Column style={pricingValueColumn}>
                  <Text style={totalValue}>{order.total_cost.toLocaleString()} MDL</Text>
                </Column>
              </Row>
            </Section>
            
            <Hr style={divider} />
            
            <Section>
              <Row>
                <Column style={detailsColumn}>
                  <Heading as="h3" style={detailsHeading}>{t('contactDetails')}</Heading>
                  <Text style={detailsText}>
                    {order.additional_info.user_data.firstname} {order.additional_info.user_data.lastname}
                  </Text>
                  <Text style={detailsText}>
                    {t('email')}: {order.additional_info.user_data.email}
                  </Text>
                  <Text style={detailsText}>
                    {t('phoneMethod')}: {order.additional_info.user_data.tel_number}
                  </Text>
                </Column>
                
                <Column style={detailsColumn}>
                  <Heading as="h3" style={detailsHeading}>{t('orderDetails')}</Heading>
                  <Text style={detailsText}>
                    {t('date')}: {formattedDate}
                  </Text>
                  <Text style={detailsText}>
                    {t('paymentMethod')}: {paymentMethodName}
                  </Text>
                </Column>
              </Row>
              
              <Row style={{ marginTop: '20px' }}>
                {order.delivery_method === DeliveryMethod.HOME_DELIVERY && order.additional_info.delivery_address && (
                  <Column style={detailsColumn}>
                    <Heading as="h3" style={detailsHeading}>{t('deliveryAddress')}</Heading>
                    <Text style={detailsText}>
                      {order.additional_info.user_data.firstname} {order.additional_info.user_data.lastname}
                    </Text>
                    <Text style={detailsText}>
                      {order.additional_info.delivery_address.home_address} {order.additional_info.delivery_address.home_nr}
                    </Text>
                    <Text style={detailsText}>
                      {regionName}, {order.additional_info.delivery_address.city}
                    </Text>
                    <Text style={detailsText}>
                      {t('moldova')}
                    </Text>
                  </Column>
                )}
                
                <Column style={detailsColumn}>
                  <Heading as="h3" style={detailsHeading}>{t('billingAddress')}</Heading>
                  <Text style={detailsText}>
                    {order.additional_info.user_data.firstname} {order.additional_info.user_data.lastname}
                  </Text>
                  <Text style={detailsText}>
                    {order.additional_info.billing_address.home_address} {order.additional_info.billing_address.home_nr}
                  </Text>
                  <Text style={detailsText}>
                    {regionName}, {order.additional_info.billing_address.city}
                  </Text>
                  <Text style={detailsText}>
                    {t('moldova')}
                  </Text>
                </Column>
              </Row>
            </Section>
            
            <Hr style={divider} />
            
            <Section style={footer}>
              <Text style={footerText}>
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "600px",
  };
  
  const header = {
    padding: "20px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const thankYouSection = {
    padding: "0 20px",
    textAlign: "center" as const,
  };
  
  const thankYouHeading = {
    fontSize: "24px",
    fontWeight: "semibold" as const,
    margin: "30px 0 15px",
    fontFamily: '"Manrope", sans-serif',
    textTransform: "uppercase" as const,
  };
  
  const emailSentText = {
    margin: "0 0 24px",
    fontSize: "14px",
    lineHeight: "24px",
    color: "#333",
  };
  
  const divider = {
    borderColor: "#E5E7EB",
    margin: "24px 0",
  };
  
  const sectionHeading = {
    fontSize: "18px",
    lineHeight: "24px",
    margin: "16px 0",
    padding: "0 24px",
    fontFamily: '"Manrope", sans-serif',
    fontWeight: "semibold" as const,
  };
  
  const productRow = {
    padding: "12px 24px",
    borderBottom: "1px solid #F3F4F6",
  };
  
  const productImageColumn = {
    width: "30%",
    paddingRight: "12px",
  };
  
  const productImage = {
    borderRadius: "8px",
    objectFit: "contain" as const,
    backgroundColor: "#F9FAFB",
  };
  
  const productDetailsColumn = {
    width: "70%",
  };
  
  const productTitle = {
    fontSize: "14px",
    fontWeight: "semibold" as const,
    margin: "0 0 8px",
    fontFamily: '"Manrope", sans-serif',
  };
  
  const salePrice = {
    fontSize: "13px",
    color: "#9CA3AF",
    textDecoration: "line-through",
    marginRight: "8px",
  };
  
  const currentPrice = {
    fontSize: "14px",
    fontWeight: "semibold" as const,
    border: "1px solid #D1D5DB",
    borderRadius: "24px",
    padding: "4px 12px",
    display: "inline-block",
  };
  
  const quantityText = {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: "8px",
  };
  
  const pricingRow = {
    padding: "4px 24px",
  };
  
  const pricingLabelColumn = {
    width: "50%",
  };
  
  const pricingValueColumn = {
    width: "50%",
    textAlign: "right" as const,
  };
  
  const pricingLabel = {
    fontSize: "14px",
    color: "#4B5563",
    margin: "0",
  };
  
  const pricingValue = {
    fontSize: "14px",
    margin: "0",
  };
  
  const totalRow = {
    padding: "12px 24px",
    marginTop: "8px",
  };
  
  const totalValue = {
    fontSize: "16px",
    fontWeight: "semibold" as const,
    margin: "0",
  };
  
  const detailsColumn = {
    width: "50%",
    padding: "0 12px",
  };
  
  const detailsHeading = {
    fontSize: "16px",
    margin: "0 0 8px",
    fontFamily: '"Manrope", sans-serif',
    fontWeight: "semibold" as const,
  };
  
  const detailsText = {
    fontSize: "14px",
    margin: "0 0 4px",
    color: "#374151",
  };
  
  const footer = {
    padding: "0 24px",
    textAlign: "center" as const,
  };
  
  const footerText = {
    fontSize: "12px",
    color: "#6B7280",
  };
  
  export default OrderConfirmationEmail;