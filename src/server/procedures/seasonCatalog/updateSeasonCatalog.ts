/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from "@/lib/connect-mongo";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { updateSeasonCatalogRequestSchema } from "@/lib/validation/home/updateSeasonCatalogRequest";
import { SeasonCatalog } from "@/models/seasonCatalog/SeasonCatalog";
import { SeasonCatalogI } from "@/models/seasonCatalog/types/SeasonCatalogI";
import { publicProcedure } from "@/server/trpc";


    interface updateSeasonCatalogI extends ActionResponse {
        seasonCatalog: SeasonCatalogI | null
    }

    export const updateSeasonCatalogProcedure = publicProcedure
        .input(updateSeasonCatalogRequestSchema)
        .mutation(async ({ input }): Promise<updateSeasonCatalogI> => {
            try {

                await connectMongo();

                const seasonCatalog = await SeasonCatalog.findByIdAndUpdate(input.id, {
                    $set: {
                        link: input.link,
                        active: input.active
                    }
                }, {new: true});

                if (!seasonCatalog) {
                    return {
                        seasonCatalog,
                        error: "Season Catalog not found!",
                        success: false,
                    }
                }

                return {
                    success: true,
                    seasonCatalog
                }
            } catch (e: any) {
                return {
                    seasonCatalog: null,
                    error: e.message,
                    success: false,
                }
            }
        })