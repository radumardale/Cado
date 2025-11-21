
import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { HomeBanner } from '@/models/home_banner/HomeBanner';
import { HomeBannerInterface } from '@/models/home_banner/types/HomeBannerInterface';
import { publicProcedure } from '@/server/trpc';

interface addHomeBannerI extends ActionResponse {
  banners: HomeBannerInterface[];
}

export const getFirstHomeBanner = publicProcedure.query(async (): Promise<addHomeBannerI> => {
  try {
    await connectMongo();

    const homeBanners = await HomeBanner.find().limit(1).lean();

    return {
      success: true,
      banners: homeBanners,
    };
  } catch (error) {
    console.error('Error fetching first home banner:', error);
    return {
      banners: [],
      error: error instanceof Error ? error.message : 'Failed to fetch first home banner',
      success: false,
    };
  }
});
