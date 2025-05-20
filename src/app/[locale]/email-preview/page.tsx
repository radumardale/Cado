'use client';

import { useState, useEffect } from 'react';
import { DeliveryMethod } from "@/models/order/types/deliveryMethod";
import OrderConfirmationEmail from '@/components/emails/OrderConfirmation';
import { DeliveryRegions } from '@/lib/enums/DeliveryRegions';
import { ClientEntity } from '@/models/order/types/orderEntity';
import { ResOrderInterface } from '@/models/order/types/orderInterface';
import { OrderState } from '@/models/order/types/orderState';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { StockState } from '@/lib/enums/StockState';

export default function EmailPreviewPage() {
  const [html, setHtml] = useState<string>('');
  
  useEffect(() => {
    // Import render function dynamically to avoid server-side errors
    import('@react-email/render').then(async ({ render }) => {
      // Create mock data
      const mockOrder: ResOrderInterface = {
        _id: "64ab3c9e1f31d5e123456789",
        custom_id: "ORD12345",
        createdAt: new Date("2023-07-10T10:30:00Z"),
        
        // Order state
        state: OrderState.NotPaid,
        
        // Payment and delivery
        payment_method: OrderPaymentMethod.Paynet,
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        total_cost: 1250,
        
        // Products in cart
        products: [
          {
            "product": {
                "_id": "681ba3d47d3946dd3d9dabee",
                "custom_id": "GQgsdX0N",
                "title": {
                "ro": "Clepsidră magnetică decorativă \"LALA Mind Pauser\"",
                "ru": "Магнитные песочные часы \"LALA Mind Pauser\"",
                "en": "Magnetic Hourglass \"LALA Mind Pauser\""
                },
                "price": 944,
                "stock_availability": {
                "stock": 2,
                "state": StockState.IN_STOCK
                },
                "sale": {
                "active": false,
                "sale_price": 0
                },
                "images": [
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681ba3d47d3946dd3d9dabee/764f1a50.png",
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681ba3d47d3946dd3d9dabee/0da0fa91.png"
                ]
            },
            quantity: 1
          },
          {
            "product": {
                "_id": "681a58584d2dc90fb34a0d5e",
                "custom_id": "M31QdwLN",
                "title": {
                "ro": "Organizator elegant și funcțional pentru birou \"THEO Office Butler\"",
                "ru": "Элегантный и функциональный органайзер для стола \"THEO Office Butler\"",
                "en": "Elegant and functional desk organizer \"THEO Office Butler\""
                },
                "price": 2160,
                "stock_availability": {
                "stock": 1,
                "state": StockState.IN_STOCK
                },
                "sale": {
                "active": false,
                "sale_price": 0
                },
                "images": [
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681a58584d2dc90fb34a0d5e/7b4d8ca0.png",
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681a58584d2dc90fb34a0d5e/dc50c1ed.png",
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681a58584d2dc90fb34a0d5e/f1a0928e.png",
                "https://d3le09nbvee0zx.cloudfront.net/PRODUCT/681a58584d2dc90fb34a0d5e/77337b6c.png"
                ]
            },
            quantity: 2
          }
        ],
        
        // Client information
        client: {
          email: "john.doe@example.com",
          orders: []
        },
        
        // Additional information including user data and addresses
        additional_info: {
          user_data: {
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
            tel_number: "+37369123456"
          },
          delivery_address: {
            region: DeliveryRegions.CHISINAU,
            city: "Chișinău",
            home_address: "Strada Bulevardul Ștefan cel Mare",
            home_nr: "120, ap. 45"
          },
          billing_checkbox: false, // False means billing address is different from delivery
          billing_address: {
            // Using NormalAddress type here
            region: DeliveryRegions.CHISINAU,
            city: "Chișinău",
            home_address: "Strada Mitropolit Varlaam",
            home_nr: "58",
            firstname: "John", 
            lastname: "Doe"
          },
          entity_type: ClientEntity.Natural // Natural person, not a legal entity
        },
        
        // Delivery details
        delivery_details: {
          delivery_date: new Date(),
          hours_intervals: "12:00-17:00",
          message: "La mulți ani!",
          comments: "Vă rugăm să sunați cu 15 minute înainte de livrare."
        }
      };
      
      // Render the email
      const emailHtml = await render(
        <OrderConfirmationEmail
          order={mockOrder}
          locale="ro"
          paymentMethodName="Card bancar"
          regionName="Chișinău"
          baseUrl="http://localhost:3000"
        />
      );
      
      setHtml(emailHtml);
    });
  }, []);

  return (
    <div className="p-4 col-span-full">
      <h1 className="text-2xl font-bold mb-4">Email Preview</h1>
      <div className="border rounded-lg overflow-hidden">
        {html ? (
          <iframe 
            srcDoc={html} 
            className="w-full h-[800px] border-0" 
            title="Email Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p>Loading email preview...</p>
          </div>
        )}
      </div>
    </div>
  );
}