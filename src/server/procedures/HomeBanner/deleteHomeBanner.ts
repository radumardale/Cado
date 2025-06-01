/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from "@/lib/connect-mongo";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { deleteHomeBannerRequestSchema } from "@/lib/validation/home/updateHomeBannerRequest";
import { HomeBanner } from "@/models/home_banner/HomeBanner";
import { publicProcedure } from "@/server/trpc";

export const deleteHomeBannerProcedure = publicProcedure
    .input(deleteHomeBannerRequestSchema)
    .mutation(async ({ input }): Promise<ActionResponse> => {
        try {

            await connectMongo();

            const homeBanner = await HomeBanner.findByIdAndDelete(input.id);

            if (!homeBanner) {
                return {
                    success: true,
                }
            }

            return {
                success: true,
            }
        } catch (e: any) {
            return {
                error: e.message,
                success: true,
            }
        }
    })