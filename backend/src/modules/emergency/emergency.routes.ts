import { Router } from 'express';
import * as emergencyController from './emergency.controller';

export const emergencyRouter = Router();

emergencyRouter.get('/services', emergencyController.list);
