import { Router } from 'express';
import * as locationController from './location.controller';

export const locationRouter = Router();

locationRouter.get('/live/:token', locationController.live);
