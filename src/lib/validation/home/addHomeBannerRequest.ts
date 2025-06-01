import { Ocasions } from '@/lib/enums/Ocasions';
import { z } from 'zod';

export const addHomeBannerRequestSchema = z.object({
    ocasion: z.nativeEnum(Ocasions)
});