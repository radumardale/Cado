/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from "@/lib/connect-mongo";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { addHomeBannerRequestSchema } from "@/lib/validation/home/addHomeBannerRequest";
import { HomeBanner } from "@/models/home_banner/HomeBanner";
import { protectedProcedure } from "@/server/trpc";
import { DestinationEnum, generateUploadLinks } from "../image/generateUploadLinks";
import { HomeBannerInterface } from "@/models/home_banner/types/HomeBannerInterface";

interface addHomeBannerI extends ActionResponse {
    imageLink: string,
    homeBanner: HomeBannerInterface | null
}

export const addHomeBannerProcedure = protectedProcedure
    .input(addHomeBannerRequestSchema)
    .mutation(async ({ input }): Promise<addHomeBannerI> => {
        try {

            await connectMongo();

            const homeBanner = await HomeBanner.create({
                ocasion: input.ocasion,
            });

            const imageUrl = await generateUploadLinks({
                id: homeBanner._id.toString(),
                destination: DestinationEnum.BANNER
            });

            return {
                success: true,
                imageLink: imageUrl.imageUrl,
                homeBanner: homeBanner
            }
        } catch (e: any) {
            return {
                imageLink: "",
                error: e.message,
                success: true,
                homeBanner: null
            }
        }
    })