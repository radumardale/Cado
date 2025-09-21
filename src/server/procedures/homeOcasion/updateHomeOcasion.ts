/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateHomeOcasionRequestSchema } from '@/lib/validation/home/updateHomeOcasion';
import { HomeOcasion } from '@/models/homeOcasion/HomeOcasion';
import { HomeOcasionI } from '@/models/homeOcasion/types/HomeOcasionI';
import { protectedProcedure } from '@/server/trpc';

interface updateHomeOcasionI extends ActionResponse {
  homeOcasion: HomeOcasionI | null;
}

export const updateHomeOcasionProcedure = protectedProcedure
  .input(updateHomeOcasionRequestSchema)
  .mutation(async ({ input }): Promise<updateHomeOcasionI> => {
    try {
      await connectMongo();

      const homeOcasion = await HomeOcasion.findByIdAndUpdate(
        input.id,
        {
          $set: {
            title: input.ocasionTitle,
            ocasion: input.ocasion,
          },
        },
        { new: true }
      );

      if (!homeOcasion) {
        return {
          homeOcasion,
          error: 'Home Ocasion not found!',
          success: false,
        };
      }

      return {
        success: true,
        homeOcasion,
      };
    } catch (e: any) {
      return {
        homeOcasion: null,
        error: e.message,
        success: false,
      };
    }
  });
