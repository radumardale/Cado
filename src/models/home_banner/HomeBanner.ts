import mongoose from 'mongoose';
import { HomeBannerInterface } from './types/HomeBannerInterface';
import { Ocasions } from '@/lib/enums/Ocasions';

// Product Schema
const HomeBannerSchema = new mongoose.Schema<HomeBannerInterface>({
  images: {
    ro: {
      type: String,
      required: false,
      default: '',
    },
    ru: {
      type: String,
      required: false,
      default: '',
    },
    en: {
      type: String,
      required: false,
      default: '',
    },
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
