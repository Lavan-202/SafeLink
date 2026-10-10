import { z } from 'zod';

export const updatePrivacySchema = z.object({
  body: z
    .object({
      shareLiveLocation: z.boolean().optional(),
      sharePreciseLocation: z.boolean().optional(),
      smsFallback: z.boolean().optional(),
      notifyAllContacts: z.boolean().optional(),
      locationUpdateIntervalSec: z.number().int().min(5).max(120).optional(),
      autoShareOnSos: z.boolean().optional(),
      showSharingStatus: z.boolean().optional(),
      sharingDuration: z.enum(['30', '60', 'until']).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, { message: 'Nothing to update' }),
});
