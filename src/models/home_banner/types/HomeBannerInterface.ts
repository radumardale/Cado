import { Ocasions } from "@/lib/enums/Ocasions";

export interface HomeBannerInterface {
    _id: string,
    images: {
        ro: string;
        ru: string;
        en: string;
    };
    ocasion: Ocasions
}