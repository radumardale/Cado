import mongoose from 'mongoose';
import { SeasonCatalogI } from './types/SeasonCatalogI';

// Product Schema
const SeasonCatalogSchema = new mongoose.Schema<SeasonCatalogI>({
  active: {
    type: Boolean,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const SeasonCatalog =
  mongoose.models.SeasonCatalog ||
  mongoose.model<SeasonCatalogI>('SeasonCatalog', SeasonCatalogSchema);

export { SeasonCatalog };
