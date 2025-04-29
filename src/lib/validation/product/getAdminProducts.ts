import SortBy from '@/lib/enums/SortBy';
import { z } from 'zod';

export const getAdminProductsRequestSchema = z.object({
    title: z.string().min(2, "Search string should be at least 2 characters long").nullable(),
    limit: z.number().min(1).max(100).default(10),
    cursor: z.number().nullish(),
    sortBy: z.nativeEnum(SortBy).default(SortBy.RECOMMENDED),
  })