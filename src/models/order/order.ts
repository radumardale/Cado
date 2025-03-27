import mongoose, { Schema } from "mongoose";
import { OrderInterface } from "./types/orderInterface";
import { OrderState } from "./types/orderState";
import { OrderPaymentMethod } from "./types/orderPaymentMethod";
import { AdditionalInfoSchema } from "./types/additionalInfo";
import { NormalAddressSchema } from "./types/normalAddress";
import { LegalAddressSchema } from "./types/legalAddress";
import { Client } from "../client/client";

// Order Schema
const OrderSchema = new mongoose.Schema<OrderInterface>({
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    client: {
        type: 'ObjectId',
        ref: "Client",
        required: true
    },
    additional_info: {
        type: AdditionalInfoSchema,
        required: true
    },
    state: {
        type: String,
        enum: OrderState,
        required: true,
        default: OrderState.NotPaid
    },
    payment_method: {
        type: String,
        enum: OrderPaymentMethod,
        required: true
    },
});

interface CompleteOrderI extends OrderInterface {
    _id: string
}

OrderSchema.pre<CompleteOrderI>("findOneAndDelete", function(next) {

    Client.updateOne({ _id: this.client }, {
        $pull: {
            orders: this._id
        }
    });
    next();
});

OrderSchema.path<mongoose.Schema.Types.Subdocument>('additional_info.billing_address').discriminator('NormalAddress', NormalAddressSchema);
OrderSchema.path<mongoose.Schema.Types.Subdocument>('additional_info.billing_address').discriminator('LegalAddress', LegalAddressSchema);

const Order = mongoose.models.Order || mongoose.model<OrderInterface>("Order", OrderSchema);

export { Order };