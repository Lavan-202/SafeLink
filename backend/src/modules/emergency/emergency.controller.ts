import type { RequestHandler } from 'express';
import { env } from '../../config/env';
import { getEmergencyDirectory } from './emergency.data';

export const list: RequestHandler = (_req, res) => {
  res.json({ data: getEmergencyDirectory(env.emergencyRegion) });
};
