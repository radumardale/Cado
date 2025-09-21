import mongoose from 'mongoose';

export type OptionalInfoTexts = {
  ro: string;
  ru: string;
  [key: string]: string;
};

// OptionalInfoTexts Schema
export const OptionalInfoTextsSchema = new mongoose.Schema<OptionalInfoTexts>(
  {
    ro: {
      type: String,
      required: false,
    },
    ru: {
      type: String,
      required: false,
    },
    en: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);
