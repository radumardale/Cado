import mongoose from 'mongoose';
import { OrderInterface } from './types/orderInterface';
import { OrderState } from './types/orderState';
import { OrderPaymentMethod } from './types/orderPaymentMethod';
import { AdditionalInfoSchema } from './types/additionalInfo';
import { NormalAddressSchema } from './types/normalAddress';
import { LegalAddressSchema } from './types/legalAddress';
import { Client } from '../client/client';
import { DeliveryMethod } from './types/deliveryMethod';
import { nanoid } from 'nanoid';
import { DeliveryDetailsSchema } from './types/deliveryDetails';
import { CartProductsSchema } from './types/cartProducts';

// Order Schema
const OrderSchema = new mongoose.Schema<OrderInterface>(
  {
    custom_id: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(8),
    },
    products: [
      {
        type: CartProductsSchema,
        required: true,
      },
    ],
    invoice_id: {
      type: Number,
      unique: true,
    },
    client: {
      type: 'ObjectId',
      ref: 'Client',
      required: true,
    },
    additional_info: {
      type: AdditionalInfoSchema,
      required: true,
    },
    state: {
      type: String,
      enum: OrderState,
      required: true,
      default: OrderState.NotPaid,
    },
    payment_method: {
      type: String,
      enum: OrderPaymentMethod,
      required: true,
    },
    delivery_method: {
      type: String,
      enum: DeliveryMethod,
      required: true,
    },
    total_cost: {
      type: Number,
      required: true,
    },
    delivery_details: {
      type: DeliveryDetailsSchema,
      required: false,
    },
    paynet_id: {
      type: Number,
    },
  },
  { timestamps: true }
);

OrderSchema.pre('findOneAndDelete', async function (next) {
  try {
    const orderId = this.getQuery()._id;
    const order = await this.model.findById(orderId);

    if (order && order.client) {
      await Client.updateOne({ _id: order.client }, { $pull: { orders: order._id } });
    }
    next();
  } catch (error) {
    console.error(error);
  }
});

OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await Order.findOne().sort({ invoice_id: -1 });
    this.invoice_id = (lastOrder?.invoice_id || 100000) + 1;
  }
  next();
});

OrderSchema.path<mongoose.Schema.Types.Subdocument>(
  'additional_info.billing_address'
).discriminator('NATURAL', NormalAddressSchema);
OrderSchema.path<mongoose.Schema.Types.Subdocument>(
  'additional_info.billing_address'
).discriminator('LEGAL', LegalAddressSchema);

const Order = mongoose.models.Order || mongoose.model<OrderInterface>('Order', OrderSchema);

export { Order };
