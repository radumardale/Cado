import mongoose from 'mongoose';
import { OptionalInfoTexts, OptionalInfoTextsSchema } from './optionalInfoTexts';

export type OptionalInfo = {
  weight: string;
  dimensions: string;
  material: OptionalInfoTexts;
  color: OptionalInfoTexts;
};

// OptionalInfo Schema
export const OptionalInfoSchema = new mongoose.Schema<OptionalInfo>(
  {
    weight: {
      type: String,
      required: false,
    },
    dimensions: {
      type: String,
      required: false,
    },
    material: {
      type: OptionalInfoTextsSchema,
      required: false,
    },
    color: {
      type: OptionalInfoTextsSchema,
      required: false,
    },
  },
  { _id: false }
);
