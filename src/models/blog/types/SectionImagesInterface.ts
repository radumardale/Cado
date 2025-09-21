import mongoose from 'mongoose';

export interface SectionImagesInterface {
  image: string;
  index: number;
}

// Normal Address Schema
export const SectionImagesSchema = new mongoose.Schema<SectionImagesInterface>({
  image: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
