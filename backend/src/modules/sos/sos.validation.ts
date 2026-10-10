import { z } from 'zod';

const coordinates = {
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  accuracy: z.number().nonnegative().nullable().optional(),
};

export const createSosSchema = z.object({
  body: z.object(coordinates),
});

export const sosLocationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object(coordinates),
});

export const sosIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
