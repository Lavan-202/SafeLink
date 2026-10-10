import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as authController from './auth.controller';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.validation';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many attempts. Try again later.' } },
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
authRouter.get('/me', requireAuth, authController.me);
