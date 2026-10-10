import { z } from 'zod';

const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20, 'Phone number is too long')
  .regex(/^[+0-9()\-\s]+$/, 'Phone number can contain digits and + ( ) -');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().email('Enter a valid email'),
    phone,
    password: z.string().min(8, 'Password must be at least 8 characters').max(72),
    preferredLanguage: z.enum(['en', 'ta', 'si']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email'),
    token: z.string().min(10, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  }),
});
