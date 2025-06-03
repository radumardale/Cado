import connectMongo from "@/lib/connect-mongo";
import { Order } from "@/models/order/order";
import { OrderState } from "@/models/order/types/orderState";
import nodemailer from 'nodemailer';
import { render } from "@react-email/components";
import OrderConfirmation from "@/components/emails/OrderConfirmation";
import { ResOrderInterface } from "@/models/order/types/orderInterface";

const mailConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
};

const subjectLang = new Map([
  ["en", "ORDER CONFIRMATION | CADO"],
  ["ro", "CONFIRMARE COMANDA | CADO"],
  ["fr", "CONFIRMATION DE COMMANDE | CADO"],
  ["ru", "ПОДТВЕРЖДЕНИЕ ЗАКАЗА | CADO"]
])

export async function POST(request: Request) {
    const body = await request.json();

    await connectMongo();

    const order = await Order.findOne({invoice_id: body.Payment.ExternalId});

    if (!order) return;
    order.paynet_id = body.Payment.Id;

    if (body.EventType !== 'PAID') {
        order.state = OrderState.TransactionFailed;
    } else {
        order.state = OrderState.Paid;

    await order.save();

    // Send email
    const transporter = nodemailer.createTransport(mailConfig);

    const emailHtml = await render(OrderConfirmation({
        order: { 
            ...order.toObject(), 
            _id: order._id.toString(),
            additional_info: order.additional_info,
        } as unknown as ResOrderInterface,
        locale: "ro",
        paymentMethodName: order.payment_method,
        regionName: order.additional_info.delivery_address?.region || "",
        baseUrl: process.env.BASE_URL,
    }));

    const emailData = {
        from: process.env.FROM_EMAIL_ADDRESS,
        to: order.additional_info.user_data.email,
        subject: subjectLang.get("ro"),
        html: emailHtml
    }

      await transporter.sendMail(emailData);
    }

    return new Response("Success", { status: 200 });
}