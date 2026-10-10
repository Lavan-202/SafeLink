import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import * as notificationsController from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);
notificationsRouter.get('/', notificationsController.list);
