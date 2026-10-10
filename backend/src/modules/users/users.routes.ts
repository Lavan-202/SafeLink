import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as usersController from './users.controller';
import { updateProfileSchema } from './users.validation';

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get('/me', usersController.getMe);
usersRouter.patch('/me', validate(updateProfileSchema), usersController.updateMe);
