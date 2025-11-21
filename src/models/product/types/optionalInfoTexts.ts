import mongoose from 'mongoose';

/**
 * Optional multilingual product information text.
 * Uses the global OptionalMultilingualString type to ensure consistency.
 *
 * @deprecated Import this type is no longer needed - use global OptionalMultilingualString instead.
 */
export type OptionalInfoTexts = OptionalMultilingualString;

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
