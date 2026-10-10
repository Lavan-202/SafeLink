import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as supportController from './support.controller';
import { createSupportSchema } from './support.validation';

export const supportRouter = Router();

supportRouter.use(requireAuth);
supportRouter.post('/', validate(createSupportSchema), supportController.create);
