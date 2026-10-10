import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import * as historyController from './history.controller';

export const historyRouter = Router();

historyRouter.use(requireAuth);
historyRouter.get('/', historyController.list);
