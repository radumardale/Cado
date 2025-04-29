import { StockState } from "@/lib/enums/StockState";
import mongoose from "mongoose";

export type StockAvailability = {
    stock: number,
    state: StockState
  }

export const StockAvailabilitySchema = new mongoose.Schema<StockAvailability>({
    stock: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: StockState,
      required: true,
    },
},  { _id: false });