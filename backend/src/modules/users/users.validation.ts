import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(80).optional(),
      email: z.string().trim().email('Enter a valid email').optional(),
      phone: z
        .string()
        .trim()
        .min(8)
        .max(20)
        .regex(/^[+0-9()\-\s]+$/)
        .optional(),
      role: z.string().trim().min(2).max(60).optional(),
      preferredLanguage: z.enum(['en', 'ta', 'si']).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, { message: 'Nothing to update' }),
});
