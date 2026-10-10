import { Router } from 'express';
import * as safetyTipsController from './safetyTips.controller';

export const safetyTipsRouter = Router();

safetyTipsRouter.get('/', safetyTipsController.list);
