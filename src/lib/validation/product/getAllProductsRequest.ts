import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import SortBy from '@/lib/enums/SortBy';
import { z } from 'zod';

export const getAllProductsRequestSchema = z.object({
    title: z.string().min(2, "Search string should be at least 2 characters long").nullable(),
    limit: z.number().min(1).max(100).default(10),
    cursor: z.number().nullish(),
    category: z.nativeEnum(Categories).or(z.null()),
    ocasions: z.array(z.nativeEnum(Ocasions)).optional(),
    productContent: z.array(z.nativeEnum(ProductContent)).optional(),
    price: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }).nullish(),
    sortBy: z.nativeEnum(SortBy).default(SortBy.RECOMMENDED),
  })