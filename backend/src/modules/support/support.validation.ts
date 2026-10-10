import { z } from 'zod';

export const createSupportSchema = z.object({
  body: z.object({
    message: z.string().trim().min(8, 'Describe the problem in a few words.').max(1000),
  }),
});
