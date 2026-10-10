import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as sosController from './sos.controller';
import { createSosSchema, sosIdSchema, sosLocationSchema } from './sos.validation';

const sosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many SOS requests. Wait a moment and try again.' } },
});

export const sosRouter = Router();

sosRouter.use(requireAuth);
sosRouter.post('/', sosLimiter, validate(createSosSchema), sosController.create);
sosRouter.get('/active', sosController.active);
sosRouter.get('/:id', validate(sosIdSchema), sosController.getOne);
sosRouter.post('/:id/location', validate(sosLocationSchema), sosController.addLocation);
sosRouter.post('/:id/resolve', validate(sosIdSchema), sosController.resolve);
sosRouter.post('/:id/cancel', validate(sosIdSchema), sosController.cancel);
