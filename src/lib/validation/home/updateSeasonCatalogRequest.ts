import { z } from 'zod';

export const updateSeasonCatalogRequestSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    link: z.string(),
    active: z.boolean()
});