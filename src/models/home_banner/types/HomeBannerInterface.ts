import { Ocasions } from '@/lib/enums/Ocasions';

/**
 * Home banner interface with multilingual image URLs.
 * Each banner has images in all three supported languages.
 */
export interface HomeBannerInterface {
  _id: string;
  images: MultilingualString;
  ocasion: Ocasions;
}
