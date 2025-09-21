/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { HomeOcasion } from '@/models/homeOcasion/HomeOcasion';
import { HomeOcasionI } from '@/models/homeOcasion/types/HomeOcasionI';
import { publicProcedure } from '@/server/trpc';

interface getHomeOcasionI extends ActionResponse {
  homeOcasion: HomeOcasionI | null;
}

export const getHomeOcasionProcedure = publicProcedure.query(async (): Promise<getHomeOcasionI> => {
  try {
    await connectMongo();

    const homeOcasion = await HomeOcasion.find();

    return {
      success: true,
      homeOcasion: homeOcasion[0],
    };
  } catch (e: any) {
    return {
      homeOcasion: null,
      error: e.message,
      success: true,
    };
  }
});
