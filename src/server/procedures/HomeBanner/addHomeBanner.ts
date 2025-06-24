/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from "@/lib/connect-mongo";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { addHomeBannerRequestSchema } from "@/lib/validation/home/addHomeBannerRequest";
import { HomeBanner } from "@/models/home_banner/HomeBanner";
import { protectedProcedure } from "@/server/trpc";
import { DestinationEnum, generateUploadLinks } from "../image/generateUploadLinks";
import { HomeBannerInterface } from "@/models/home_banner/types/HomeBannerInterface";

interface addHomeBannerI extends ActionResponse {
    imageLinks: {
        ro: string;
        ru: string;
        en: string;
    },
    homeBanner: HomeBannerInterface | null
}

export const addHomeBannerProcedure = protectedProcedure
    .input(addHomeBannerRequestSchema)
    .mutation(async ({ input }): Promise<addHomeBannerI> => {
        try {
            await connectMongo();

            const homeBanner = await HomeBanner.create({
                ocasion: input.ocasion,
                images: {
                    ro: "",
                    ru: "",
                    en: ""
                }
            });

            // Generate upload links for all 3 languages
            const roUploadLink = await generateUploadLinks({
                id: `${homeBanner._id.toString()}-ro`,
                destination: DestinationEnum.BANNER
            });
            
            const ruUploadLink = await generateUploadLinks({
                id: `${homeBanner._id.toString()}-ru`,
                destination: DestinationEnum.BANNER
            });
            
            const enUploadLink = await generateUploadLinks({
                id: `${homeBanner._id.toString()}-en`,
                destination: DestinationEnum.BANNER
            });

            return {
                success: true,
                imageLinks: {
                    ro: roUploadLink.imageUrl,
                    ru: ruUploadLink.imageUrl,
                    en: enUploadLink.imageUrl
                },
                homeBanner: homeBanner
            }
        } catch (e: any) {
            return {
                imageLinks: {
                    ro: "",
                    ru: "",
                    en: ""
                },
                error: e.message,
                success: false,
                homeBanner: null
            }
        }
    })