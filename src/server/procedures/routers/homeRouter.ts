import { router } from '../../trpc';
import { addHomeBannerProcedure } from '../HomeBanner/addHomeBanner';
import { deleteHomeBannerProcedure } from '../HomeBanner/deleteHomeBanner';
import { getAllHomeBanners } from '../HomeBanner/getAllHomeBanners';
import { getFirstHomeBanner } from '../HomeBanner/getFirstHomeBanner';

export const homeRouter = router({
    addHomeBanner: addHomeBannerProcedure,
    getAllHomeBanners: getAllHomeBanners,
    getFirstHomeBanner: getFirstHomeBanner,
    deleteHomebanner: deleteHomeBannerProcedure
});