import { Schema } from 'mongoose';

export interface DeliveryDetailsInterface {
  delivery_date?: Date;
  hours_intervals?: string;
  message?: string;
  comments?: string;
}

export const DeliveryDetailsSchema = new Schema<DeliveryDetailsInterface>(
  {
    delivery_date: { type: Date },
    hours_intervals: { type: String },
    message: { type: String },
    comments: { type: String },
  },
  { _id: false }
);
