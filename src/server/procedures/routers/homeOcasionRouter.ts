import { router } from '../../trpc';
import { getHomeOcasionProcedure } from '../homeOcasion/getHomeOcasion';
import { updateHomeOcasionProcedure } from '../homeOcasion/updateHomeOcasion';

export const homeOcasionRouter = router({
    getHomeOcasion: getHomeOcasionProcedure,
    updateHomeOcasion: updateHomeOcasionProcedure,
});