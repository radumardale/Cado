/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { SeasonCatalog } from '@/models/seasonCatalog/SeasonCatalog';
import { SeasonCatalogI } from '@/models/seasonCatalog/types/SeasonCatalogI';
import { publicProcedure } from '@/server/trpc';

interface getSeasonCatalogI extends ActionResponse {
  seasonCatalog: SeasonCatalogI | null;
}

export const getSeasonCatalogProcedure = publicProcedure.query(
  async (): Promise<getSeasonCatalogI> => {
    try {
      await connectMongo();

      const catalog = await SeasonCatalog.find().limit(1).lean();

      return {
        success: true,
        seasonCatalog: catalog[0],
      };
    } catch (e: any) {
      return {
        seasonCatalog: null,
        error: e.message,
        success: true,
      };
    }
  }
);
