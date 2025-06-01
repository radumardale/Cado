import { router } from '../../trpc';
import { addHomeBannerProcedure } from '../HomeBanner/addHomeBanner';
import { deleteHomeBannerProcedure } from '../HomeBanner/deleteHomeBanner';
import { getAllHomeBanners } from '../HomeBanner/getAllHomeBanners';

export const homeRouter = router({
    addHomeBanner: addHomeBannerProcedure,
    getAllHomeBanners: getAllHomeBanners,
    deleteHomebanner: deleteHomeBannerProcedure
});