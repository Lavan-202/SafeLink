import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as privacyController from './privacy.controller';
import { updatePrivacySchema } from './privacy.validation';

export const privacyRouter = Router();

privacyRouter.use(requireAuth);
privacyRouter.get('/', privacyController.get);
privacyRouter.patch('/', validate(updatePrivacySchema), privacyController.update);
