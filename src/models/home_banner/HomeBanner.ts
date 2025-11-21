import mongoose from 'mongoose';
import { HomeBannerInterface } from './types/HomeBannerInterface';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductInfoSchema } from '../product/types/productInfo';

// HomeBanner Schema
const HomeBannerSchema = new mongoose.Schema<HomeBannerInterface>({
  images: {
    type: ProductInfoSchema,
    required: true,
  },
  ocasion: {
    type: String,
    enum: Ocasions,
    required: true,
  },
});

const HomeBanner =
  mongoose.models.HomeBanner || mongoose.model<HomeBannerInterface>('HomeBanner', HomeBannerSchema);

export { HomeBanner };
