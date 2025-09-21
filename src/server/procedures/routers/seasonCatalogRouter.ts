import { router } from '../../trpc';
import { getSeasonCatalogProcedure } from '../seasonCatalog/getSeasonCatalog';
import { updateSeasonCatalogProcedure } from '../seasonCatalog/updateSeasonCatalog';

export const seasonCatalogRouter = router({
  getSeasonCatalog: getSeasonCatalogProcedure,
  updateSeasonCatalog: updateSeasonCatalogProcedure,
});
