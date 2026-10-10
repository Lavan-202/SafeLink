import { z } from 'zod';

const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20)
  .regex(/^[+0-9()\-\s]+$/, 'Phone number can contain digits and + ( ) -');

const contactBody = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  phone,
  relationship: z.string().trim().max(40).optional().default(''),
  isPrimary: z.boolean().optional().default(false),
  notifyOnSos: z.boolean().optional().default(true),
  preselectLocation: z.boolean().optional().default(false),
});

export const createContactSchema = z.object({
  body: contactBody,
});

export const updateContactSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80).optional(),
      phone: phone.optional(),
      relationship: z.string().trim().max(40).optional(),
      isPrimary: z.boolean().optional(),
      notifyOnSos: z.boolean().optional(),
      preselectLocation: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, { message: 'Nothing to update' }),
});

export const contactIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
